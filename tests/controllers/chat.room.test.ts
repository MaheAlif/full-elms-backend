import request from 'supertest';
import app from '../../src/app';

/**
 * Integration tests for student course chat room flow
 */
describe('Student Course Chat Room', () => {
  let studentToken: string;
  let studentId: number;
  let courseId: number;
  let adminToken: string;
  const createdMessageIds: number[] = [];
  const TARGET_SECTION_ID = 10;

  beforeAll(async () => {
    // Authenticate as seeded student
    const studentLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'sakib221131@bscse.uiu.ac.bd',
        password: 'password123',
        role: 'student'
      });

    expect(studentLogin.status).toBe(200);
    studentToken = studentLogin.body.data.token;
    studentId = studentLogin.body.data.user.id;

    // Authenticate as admin to ensure enrollment and fetch section details
    const adminLogin = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin.aminul@uiu.ac.bd',
        password: 'password123',
        role: 'admin'
      });

    expect(adminLogin.status).toBe(200);
    adminToken = adminLogin.body.data.token;

    const enrollmentResponse = await request(app)
      .post('/api/admin/enrollments')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        student_id: studentId,
        section_id: TARGET_SECTION_ID
      });

    if (!(enrollmentResponse.status === 200 || (enrollmentResponse.status === 400 && enrollmentResponse.body?.message?.includes('already enrolled')))) {
      throw new Error(`Failed to ensure enrollment: ${enrollmentResponse.status} ${enrollmentResponse.text}`);
    }

    const sectionDetails = await request(app)
      .get(`/api/admin/sections/${TARGET_SECTION_ID}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(sectionDetails.status).toBe(200);
    courseId = sectionDetails.body.data?.course_id;
    expect(typeof courseId).toBe('number');
  });

  afterAll(async () => {
    for (const messageId of createdMessageIds) {
      await request(app)
        .delete(`/api/student/courses/${courseId}/chat/${messageId}`)
        .set('Authorization', `Bearer ${studentToken}`);
    }
  });

  it('should allow a student to access chat room history and exchange messages', async () => {
    const initialResponse = await request(app)
      .get(`/api/student/courses/${courseId}/chat`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(initialResponse.status).toBe(200);
    expect(initialResponse.body).toHaveProperty('success', true);

    const room = initialResponse.body.data?.room;
    expect(room).toBeDefined();
    expect(room.section_id).toBe(TARGET_SECTION_ID);
    expect(room.id).toBeDefined();

    const participants = initialResponse.body.data?.participants ?? [];
    const currentStudent = participants.find((participant: any) => participant.id === studentId);
    expect(currentStudent).toBeDefined();
    expect(currentStudent.isCurrentUser).toBe(true);

    const uniqueMessage = `Automated chat message ${Date.now()}`;

    const sendResponse = await request(app)
      .post(`/api/student/courses/${courseId}/chat`)
      .set('Authorization', `Bearer ${studentToken}`)
      .send({
        message: uniqueMessage
      });

    expect(sendResponse.status).toBe(201);
    expect(sendResponse.body).toHaveProperty('success', true);
    expect(sendResponse.body).toHaveProperty('message', 'Message sent successfully');

    const sentMessage = sendResponse.body.data;
    expect(sentMessage).toMatchObject({
      message: uniqueMessage,
      sender_id: studentId,
      isCurrentUser: true
    });

    const messageId: number = sentMessage.id;
    createdMessageIds.push(messageId);

    const historyResponse = await request(app)
      .get(`/api/student/courses/${courseId}/chat`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(historyResponse.status).toBe(200);
    expect(historyResponse.body).toHaveProperty('success', true);

    const historyMessages = historyResponse.body.data?.messages ?? [];
    const savedMessage = historyMessages.find((message: any) => message.id === messageId);
    expect(savedMessage).toBeDefined();
    expect(savedMessage.message).toBe(uniqueMessage);
    expect(savedMessage.isCurrentUser).toBe(true);

    const deleteResponse = await request(app)
      .delete(`/api/student/courses/${courseId}/chat/${messageId}`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(deleteResponse.status).toBe(200);
    expect(deleteResponse.body).toHaveProperty('success', true);

    const messageIndex = createdMessageIds.indexOf(messageId);
    if (messageIndex > -1) {
      createdMessageIds.splice(messageIndex, 1);
    }

    const postDeleteHistory = await request(app)
      .get(`/api/student/courses/${courseId}/chat`)
      .set('Authorization', `Bearer ${studentToken}`);

    expect(postDeleteHistory.status).toBe(200);
    const remainingMessages = postDeleteHistory.body.data?.messages ?? [];
    const existsAfterDelete = remainingMessages.some((message: any) => message.id === messageId);
    expect(existsAfterDelete).toBe(false);
  });
});
