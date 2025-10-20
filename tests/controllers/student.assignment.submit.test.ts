import path from 'path';
import fs from 'fs/promises';
import request from 'supertest';
import app from '../../src/app';

/**
 * Assignment submission upload integration test
 */
describe('Student Assignment Submission Upload', () => {
  let studentToken: string;
  let studentId: number;
  let teacherToken: string;
  let assignmentId: number;
  const createdAssignmentIds: number[] = [];
  const createdSubmissionFiles: string[] = [];

  beforeAll(async () => {
  // Authenticate as seeded student user
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'sakib221131@bscse.uiu.ac.bd',
        password: 'password123',
        role: 'student'
      });

    expect(loginResponse.status).toBe(200);
    studentToken = loginResponse.body.data.token;
    studentId = loginResponse.body.data.user.id;

    // Authenticate as admin to ensure enrollment in section 10
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin.aminul@uiu.ac.bd',
        password: 'password123',
        role: 'admin'
      });

    expect(adminLogin.status).toBe(200);
    const adminToken = adminLogin.body.data.token;

    const enrollmentResponse = await request(app)
      .post('/api/admin/enrollments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        student_id: studentId,
        section_id: 10
      });

    if (!(enrollmentResponse.status === 200 || (enrollmentResponse.status === 400 && enrollmentResponse.body?.message?.includes('already enrolled')))) {
      throw new Error(`Failed to ensure enrollment: ${enrollmentResponse.status} ${enrollmentResponse.text}`);
    }

    // Authenticate as teacher to create assignment for section 10
    const teacherLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'shihab123@gmail.com',
        password: 'shihab123',
        role: 'teacher'
      });

    expect(teacherLogin.status).toBe(200);
    teacherToken = teacherLogin.body.data.token;

    const assignmentPayload = {
      section_id: 10,
      title: `Auto Upload Assignment ${Date.now()}`,
      description: 'Temporary assignment for submission upload test',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      total_marks: 100
    };

    const createAssignment = await request(app)
      .post('/api/teacher/assignments')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send(assignmentPayload);

    expect(createAssignment.status).toBe(201);
    assignmentId = createAssignment.body.data.id;
    createdAssignmentIds.push(assignmentId);
  });

  afterAll(async () => {
    for (const file of createdSubmissionFiles) {
      try {
        await fs.unlink(file);
      } catch (error) {
        // File might have been removed already
      }
    }

    for (const id of createdAssignmentIds) {
      await request(app)
        .delete(`/api/teacher/assignments/${id}`)
        .set('Authorization', `Bearer ${teacherToken}`);
    }
  });

  it('should upload a submission file and persist metadata', async () => {
    const payload = {
      title: 'Final Project Submission',
      description: 'Automated submission upload test'
    };

    const fixturePath = path.join(__dirname, '../fixtures/test-submission.pdf');

    const response = await request(app)
      .post(`/api/student/assignments/${assignmentId}/submit`)
      .set('Authorization', `Bearer ${studentToken}`)
      .field('title', payload.title)
      .field('description', payload.description)
      .attach('submission', fixturePath);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message');
    expect(response.body.data).toMatchObject({
      assignment_title: expect.any(String),
      course_name: expect.any(String),
      is_resubmission: false,
      is_late: expect.any(Boolean)
    });

    const submissionId = response.body.data.submission_id;
    expect(typeof submissionId).toBe('number');

    const detailsResponse = await request(app)
      .get(`/api/student/assignments/${assignmentId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(detailsResponse.status).toBe(200);
    const assignmentDetails = detailsResponse.body.data?.assignment;
    expect(assignmentDetails).toBeDefined();
    expect(assignmentDetails.status).toBe('submitted');
    expect(assignmentDetails.submission_id).toBe(submissionId);
    expect(assignmentDetails.submission_file).toEqual(expect.any(String));
    expect(new Date(assignmentDetails.submitted_at).getTime()).toBeGreaterThan(0);

    if (assignmentDetails.submission_file) {
      createdSubmissionFiles.push(assignmentDetails.submission_file);
    }
  });
});
