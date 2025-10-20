import path from 'path';
import fs from 'fs/promises';
import request from 'supertest';
import app from '../../src/app';

describe('Teacher Material Upload', () => {
  let teacherToken: string;
  const createdMaterialIds: number[] = [];
  const createdMaterialFiles: string[] = [];

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
    for (const materialId of createdMaterialIds) {
      await request(app)
        .delete(`/api/teacher/materials/${materialId}`)
        .set('Authorization', `Bearer ${teacherToken}`);
    }

    for (const filePath of createdMaterialFiles) {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        // File already removed or never created
      }
    }
  });

  it('should allow a teacher to upload course material for section 10', async () => {
    const payload = {
      section_id: 10,
      title: `Automation Material ${Date.now()}`,
      type: 'pdf'
    };

    const fixturePath = path.join(__dirname, '../fixtures/test-submission.pdf');

    const uploadResponse = await request(app)
      .post('/api/teacher/materials/upload')
      .set('Authorization', `Bearer ${teacherToken}`)
      .field('section_id', payload.section_id.toString())
      .field('title', payload.title)
      .field('type', payload.type)
      .attach('material', fixturePath);

    expect(uploadResponse.status).toBe(201);
    expect(uploadResponse.body).toHaveProperty('success', true);
    expect(uploadResponse.body).toHaveProperty('message', 'Material uploaded successfully');

    const materialData = uploadResponse.body.data;
    expect(materialData).toMatchObject({
      title: payload.title,
      type: payload.type
    });

    const materialId: number = materialData.id;
    expect(typeof materialId).toBe('number');
    expect(materialId).toBeGreaterThan(0);
    createdMaterialIds.push(materialId);

    if (materialData.file_path) {
      createdMaterialFiles.push(materialData.file_path);
      await expect(fs.stat(materialData.file_path)).resolves.toBeDefined();
    }

    const listResponse = await request(app)
      .get('/api/teacher/materials')
      .set('Authorization', `Bearer ${teacherToken}`)
      .query({ section_id: payload.section_id.toString() });

    expect(listResponse.status).toBe(200);
    expect(listResponse.body).toHaveProperty('success', true);

    const materials = listResponse.body.data?.materials ?? [];
    const uploaded = materials.find((material: any) => material.id === materialId);

    expect(uploaded).toBeDefined();
    expect(uploaded.title).toBe(payload.title);
    expect(uploaded.type).toBe(payload.type);
    expect(uploaded.section_name).toBeDefined();
    expect(uploaded.course_name).toBeDefined();
  });
});
