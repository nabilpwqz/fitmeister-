export const openApiSpec = {
  openapi: '3.0.3',
  info: {
    title: 'FitMeister Platform REST API',
    version: '1.0.0',
    description:
      'Production-grade Gym & Fitness Discovery and Reservation API with database concurrency locks, RBAC, and real-time class booking availability.',
    contact: {
      name: 'FitMeister Engineering Support',
      email: 'support@fitmeister.com',
    },
  },
  servers: [
    {
      url: '/api/v1',
      description: 'API v1 Gateway',
    },
  ],
  paths: {
    '/auth/register': {
      post: {
        summary: 'Create learner or host account',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['name', 'email', 'password'],
                properties: {
                  name: { type: 'string', example: 'Alex Mercer' },
                  email: { type: 'string', format: 'email', example: 'alex@dev.com' },
                  password: { type: 'string', minLength: 6, example: 'Password123' },
                  role: { type: 'string', enum: ['CUSTOMER', 'HOST'], default: 'CUSTOMER' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Registration successful' },
          409: { description: 'Email already registered' },
        },
      },
    },
    '/auth/login': {
      post: {
        summary: 'Authenticate and receive secure HTTP-only session cookie',
        tags: ['Authentication'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['email', 'password'],
                properties: {
                  email: { type: 'string', format: 'email', example: 'alex@dev.com' },
                  password: { type: 'string', example: 'Password123' },
                },
              },
            },
          },
        },
        responses: {
          200: { description: 'Authentication successful' },
          401: { description: 'Invalid credentials' },
        },
      },
    },
    '/auth/me': {
      get: {
        summary: 'Get currently authenticated user identity and statistics',
        tags: ['Authentication'],
        responses: {
          200: { description: 'Current profile' },
        },
      },
    },
    '/rooms': {
      get: {
        summary: 'Discover study spaces with filters, capacity, amenities, and sorting',
        tags: ['Rooms'],
        parameters: [
          { name: 'search', in: 'query', schema: { type: 'string' } },
          { name: 'city', in: 'query', schema: { type: 'string' } },
          { name: 'minCapacity', in: 'query', schema: { type: 'integer' } },
          { name: 'maxRate', in: 'query', schema: { type: 'number' } },
          { name: 'sortBy', in: 'query', schema: { type: 'string', enum: ['newest', 'price_asc', 'price_desc', 'capacity_asc', 'capacity_desc'] } },
          { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
          { name: 'limit', in: 'query', schema: { type: 'integer', default: 12 } },
        ],
        responses: {
          200: { description: 'Paginated list of rooms' },
        },
      },
      post: {
        summary: 'Publish a new room listing (Host or Admin only)',
        tags: ['Rooms'],
        security: [{ BearerAuth: [] }],
        responses: {
          201: { description: 'Room created' },
          403: { description: 'Forbidden' },
        },
      },
    },
    '/rooms/{id}': {
      get: {
        summary: 'Retrieve detailed room profile including operating schedule and verified reviews',
        tags: ['Rooms'],
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: {
          200: { description: 'Room details' },
          404: { description: 'Room not found' },
        },
      },
    },
    '/availability/{roomId}': {
      get: {
        summary: 'Query live bookable hourly intervals for a specific calendar date',
        tags: ['Availability'],
        parameters: [
          { name: 'roomId', in: 'path', required: true, schema: { type: 'string' } },
          { name: 'date', in: 'query', required: true, schema: { type: 'string', example: '2026-10-15' } },
        ],
        responses: {
          200: { description: 'Room schedule and available bookable slots' },
        },
      },
    },
    '/bookings': {
      post: {
        summary: 'Reserve a study room slot with database-level conflict prevention',
        tags: ['Bookings'],
        security: [{ BearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                required: ['roomId', 'date', 'startTime', 'endTime'],
                properties: {
                  roomId: { type: 'string', format: 'uuid' },
                  date: { type: 'string', example: '2026-10-15' },
                  startTime: { type: 'string', format: 'date-time' },
                  endTime: { type: 'string', format: 'date-time' },
                  attendeeCount: { type: 'integer', default: 1 },
                  notes: { type: 'string' },
                  idempotencyKey: { type: 'string' },
                },
              },
            },
          },
        },
        responses: {
          201: { description: 'Booking confirmed' },
          409: { description: 'Conflict: Slot already booked' },
        },
      },
    },
    '/bookings/my': {
      get: {
        summary: 'List personal reservations with upcoming/past status and cancellation eligibility',
        tags: ['Bookings'],
        security: [{ BearerAuth: [] }],
        responses: {
          200: { description: 'List of reservations' },
        },
      },
    },
    '/dashboards/customer': {
      get: {
        summary: 'Customer dashboard metrics, active reservations, and saved spaces',
        tags: ['Dashboards'],
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Customer overview' } },
      },
    },
    '/dashboards/host': {
      get: {
        summary: 'Host dashboard metrics, listings, revenue, and incoming reservations',
        tags: ['Dashboards'],
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Host overview' } },
      },
    },
    '/dashboards/admin': {
      get: {
        summary: 'Admin platform metrics, user management, moderation, and audit logs',
        tags: ['Dashboards'],
        security: [{ BearerAuth: [] }],
        responses: { 200: { description: 'Admin overview' } },
      },
    },
  },
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
  },
};
