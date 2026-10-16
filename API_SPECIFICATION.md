# FitMeister REST API Specification (v1)

Base URL: `https://fit-meister-backend.vercel.app/api/v1`

## Authentication

All protected endpoints require an `Authorization` header:
```http
Authorization: Bearer <token>
```

---

## Endpoints Summary

### Auth
- `POST /auth/register` - Create new customer account
- `POST /auth/login` - Authenticate with email/password
- `POST /auth/firebase` - Sync Google OAuth credentials
- `GET /auth/me` - Get profile of authenticated user

### Rooms & Classes
- `GET /rooms` - Query classes and rooms with filters
- `GET /rooms/:id` - Get room details and schedule
- `POST /rooms` - Publish class/room (HOST / ADMIN)

### Availability
- `GET /availability/:roomId` - Get real-time available time slots

### Bookings
- `POST /bookings` - Concurrency-safe slot reservation
- `GET /bookings/me` - Member booking history
- `PATCH /bookings/:id/cancel` - Cancel booking (12h policy)

### Dashboards
- `GET /dashboards/stats` - Platform stats and telemetry

### Reviews
- `GET /reviews/room/:roomId` - List reviews for a room
- `POST /reviews` - Submit review for completed booking

### Favorites
- `GET /favorites` - List user's bookmarked classes
- `POST /favorites/:roomId` - Toggle bookmark status

### Health
- `GET /health` - Service health diagnostic probe
