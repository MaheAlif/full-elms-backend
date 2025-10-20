import request from 'supertest';
import app from '../../src/app';

describe('Teacher Assignment Creation', () => {
  let teacherToken: string;
  const cleanupAssignments: number[] = [];

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'shihab123@gmail.com',
        password: 'shihab123',
        role: 'teacher'
      });

    expect(loginResponse.status).toBe(200);
    teacherToken = loginResponse.body.data.token;
  });

  afterAll(async () => {
    for (const assignmentId of cleanupAssignments) {
      await request(app)
        .delete(`/api/teacher/assignments/${assignmentId}`)
        .set('Authorization', `Bearer ${teacherToken}`);
    }
  });

  it('should allow a teacher to create an assignment for section 10', async () => {
    const payload = {
      section_id: 10,
      title: `Automation Assignment ${Date.now()}`,
      description: 'Automated test assignment creation',
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      total_marks: 100
    };

    const createResponse = await request(app)
      .post('/api/teacher/assignments')
      .set('Authorization', `Bearer ${teacherToken}`)
      .send(payload);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toHaveProperty('success', true);
    expect(createResponse.body).toHaveProperty('message', 'Assignment created successfully');
    expect(createResponse.body.data).toMatchObject({
      title: payload.title,
      description: payload.description,
      due_date: payload.due_date,
      total_marks: payload.total_marks
    });

    const assignmentId: number = createResponse.body.data.id;
    expect(typeof assignmentId).toBe('number');
    expect(assignmentId).toBeGreaterThan(0);
    cleanupAssignments.push(assignmentId);

    const listResponse = await request(app)
      .get('/api/teacher/assignments')
      .set('Authorization', `Bearer ${teacherToken}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveProperty('success', true);
    const assignments = listResponse.body.data?.assignments ?? [];
    const created = assignments.find((assignment: any) => assignment.id === assignmentId);

    expect(created).toBeDefined();
    expect(created.title).toBe(payload.title);
    expect(created.section_name).toBeDefined();
    expect(new Date(created.due_date).toDateString()).toBe(new Date(payload.due_date).toDateString());
  });
});
