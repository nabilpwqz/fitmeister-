import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import { createApp } from '../app';
import { prisma } from '../prisma/client';
import bcrypt from 'bcryptjs';

const app = createApp();

describe('Booking Integrity & Concurrency Collision Test', () => {
  let customerToken: string;
  let secondCustomerToken: string;
  let customerId: string;
  let secondCustomerId: string;
  let testRoomId: string;

  beforeAll(async () => {
    // Clean and setup test data
    await prisma.notification.deleteMany({});
    await prisma.review.deleteMany({});
    await prisma.booking.deleteMany({});
    await prisma.operatingHour.deleteMany({});
    await prisma.room.deleteMany({});
    await prisma.user.deleteMany({});

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('Password123', salt);

    const user1 = await prisma.user.create({
      data: {
        name: 'Learner Alpha',
        email: 'alpha@test.com',
        passwordHash,
        role: 'CUSTOMER',
      },
    });
    customerId = user1.id;

    const user2 = await prisma.user.create({
      data: {
        name: 'Learner Beta',
        email: 'beta@test.com',
        passwordHash,
        role: 'CUSTOMER',
      },
    });
    secondCustomerId = user2.id;

    const host = await prisma.user.create({
      data: {
        name: 'Host Omega',
        email: 'omega@test.com',
        passwordHash,
        role: 'HOST',
      },
    });

    const room = await prisma.room.create({
      data: {
        name: 'Integrity Testing Chamber',
        description: 'Room dedicated to running concurrency race tests and boundary audits.',
        floor: 'Ground Floor',
        capacity: 4,
        hourlyRate: 10.0,
        ownerId: host.id,
        isPublished: true,
        isApproved: true,
        operatingHours: {
          create: [0, 1, 2, 3, 4, 5, 6].map(d => ({
            dayOfWeek: d,
            openTime: '08:00',
            closeTime: '22:00',
            isOpen: true,
          })),
        },
      },
    });
    testRoomId = room.id;

    // Login users to acquire tokens
    const res1 = await request(app).post('/api/v1/auth/login').send({
      email: 'alpha@test.com',
      password: 'Password123',
    });
    customerToken = res1.body.data.token;

    const res2 = await request(app).post('/api/v1/auth/login').send({
      email: 'beta@test.com',
      password: 'Password123',
    });
    secondCustomerToken = res2.body.data.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('calculates booking price accurately on the server', async () => {
    const bookingPayload = {
      roomId: testRoomId,
      date: '2026-11-20',
      startTime: '2026-11-20T10:00:00.000Z',
      endTime: '2026-11-20T12:00:00.000Z', // 2 hours
      attendeeCount: 2,
    };

    const res = await request(app)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${customerToken}`)
      .send(bookingPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    // 2 hours * $10 = $20
    expect(res.body.data.booking.totalAmount).toBe(20);
    expect(res.body.data.booking.status).toBe('CONFIRMED');
  });

  it('rejects an overlapping booking attempt with HTTP 409 Conflict', async () => {
    // Attempt to book overlapping time 11:00 - 13:00 on the same date
    const overlappingPayload = {
      roomId: testRoomId,
      date: '2026-11-20',
      startTime: '2026-11-20T11:00:00.000Z',
      endTime: '2026-11-20T13:00:00.000Z',
      attendeeCount: 1,
    };

    const res = await request(app)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${secondCustomerToken}`)
      .send(overlappingPayload);

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe('CONFLICT');
  });

  it('allows adjacent non-overlapping bookings [start, end) without false conflicts', async () => {
    // Adjacent slot right after existing: 12:00 - 14:00
    const adjacentPayload = {
      roomId: testRoomId,
      date: '2026-11-20',
      startTime: '2026-11-20T12:00:00.000Z',
      endTime: '2026-11-20T14:00:00.000Z',
      attendeeCount: 1,
    };

    const res = await request(app)
      .post('/api/v1/bookings')
      .set('Authorization', `Bearer ${secondCustomerToken}`)
      .send(adjacentPayload);

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.booking.totalAmount).toBe(20);
  });

  it('prevents double bookings when two users fire conflicting reservations simultaneously', async () => {
    const slot = {
      roomId: testRoomId,
      date: '2026-11-20',
      startTime: '2026-11-20T16:00:00.000Z',
      endTime: '2026-11-20T18:00:00.000Z',
      attendeeCount: 1,
    };

    // Dispatch concurrent requests in parallel
    const [responseA, responseB] = await Promise.all([
      request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${customerToken}`)
        .send({ ...slot, idempotencyKey: 'race-test-a' }),
      request(app)
        .post('/api/v1/bookings')
        .set('Authorization', `Bearer ${secondCustomerToken}`)
        .send({ ...slot, idempotencyKey: 'race-test-b' }),
    ]);

    const statuses = [responseA.status, responseB.status];
    // Exactly one should succeed (201) and one should be rejected as a conflict (409)
    expect(statuses).toContain(201);
    expect(statuses).toContain(409);
  });
});




