# FitMeister Architecture & Engineering Specifications

This document outlines the architectural patterns, concurrency mechanisms, and data integrity guarantees implemented across the FitMeister platform.

## 1. System Topology

FitMeister follows a clean layered client-server architecture:

```
[Browser / Client (React 18 + Vite)]
           │ (HTTPS / Bearer Auth)
           ▼
[API Gateway (Express 4 + Helmet + Rate Limit)]
           │
     ┌─────┴──────────────┐
     │                    │
[REST Handlers]    [Socket.io Realtime]
     │                    │
[Prisma ORM (Tx)] ────────┘
     │
[PostgreSQL 16]
```

## 2. Concurrency Control Model

To eliminate the classic booking race condition:
- All slot reservation requests run inside `prisma.$transaction`.
- Overlapping active bookings are evaluated against hard studio room capacity.
- Violations trigger an immediate `ConflictError (409)`.
- Successful transactions emit a `ROOM_CAPACITY_UPDATED` WebSocket event to update all connected clients without polling.

## 3. Security Architecture

1. **Authentication**: Stateless JSON Web Tokens (JWT) signed with HMAC-SHA256.
2. **Authorization**: Route-level RBAC middleware enforcing roles (`CUSTOMER`, `HOST`, `ADMIN`).
3. **Data Sanitization**: Zod runtime schema validation on every inbound JSON payload.
4. **Rate Limiting**: IP-based rate limiting on sensitive authentication routes (`express-rate-limit`).
