import request from 'supertest';
import app from '../../src/app';

describe('Admin Calendar University Event Creation', () => {
  let adminToken: string;
  const createdEventIds: number[] = [];

  beforeAll(async () => {
    const loginResponse = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin.aminul@uiu.ac.bd',
        password: 'password123',
        role: 'admin'
      });

    expect(loginResponse.status).toBe(200);
    adminToken = loginResponse.body.data.token;

  });

  afterAll(async () => {
    for (const eventId of createdEventIds) {
      await request(app)
        .delete(`/api/admin/calendar/university-events/${eventId}`)
        .set('Authorization', `Bearer ${adminToken}`);
    }
  });

  it('should create a high priority university event and notify users', async () => {
    const payload = {
      title: 'Eid e Miladunnabi',
      description: 'Holiday',
      date: '2025-10-20',
      type: 'event',
      priority: 'high'
    };

    const response = await request(app)
      .post('/api/admin/calendar/university-events')
      .set('Authorization', `Bearer ${adminToken}`)
      .send(payload);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('success', true);
    expect(response.body).toHaveProperty('message', 'University event created successfully');
    expect(response.body.data).toMatchObject({
      title: payload.title,
      description: payload.description,
      date: payload.date,
      type: payload.type,
      priority: payload.priority
    });

    const eventId: number = response.body.data.id;
    expect(typeof eventId).toBe('number');
    expect(eventId).toBeGreaterThan(0);
    createdEventIds.push(eventId);

    const calendarResponse = await request(app)
      .get('/api/admin/calendar')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(calendarResponse.status).toBe(200);
    expect(calendarResponse.body).toHaveProperty('success', true);
    const events = calendarResponse.body.data?.events || [];
    const createdEvent = events.find((event: any) => event.type === 'university_event' && event.id === eventId);

    expect(createdEvent).toBeDefined();
    expect(createdEvent.title).toBe(payload.title);
    expect(createdEvent.description).toBe(payload.description);
  const createdDate = new Date(createdEvent.date).toDateString();
  const expectedDate = new Date(payload.date).toDateString();
  expect(createdDate).toBe(expectedDate);
    expect(createdEvent.status).toBe(payload.type);
  });
});
