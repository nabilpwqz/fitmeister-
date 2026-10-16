# Changelog

All notable changes to the **FitMeister** platform will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-10-16

### Added
- Enterprise full-stack architecture migration to decoupled monorepo (`Backend` and `Frontend`).
- PostgreSQL relational schema with Prisma ORM 5.19, indexed composite queries, and atomic concurrency transactions.
- Dual-role authentication gateways (`/trainer/login` and `/admin/login`).
- Dedicated Trainer Management Portal (`/trainer`) with live athlete attendance rosters.
- Executive Admin Governance Console (`/admin`) with user soft-blocking and accreditation queue.
- Real-time WebSockets integration via Socket.io for immediate capacity updates.
- Complete legal and trust suite (`/privacy`, `/terms`, `/refund-policy`).
- Full Docker Compose local development orchestration.
- Vitest automated concurrency simulation tests proving zero double-booking on final seats.
- Next-level interactive documentation suite with Mermaid sequence diagrams and OpenAPI 3.0 Swagger.

### Changed
- Refactored frontend styling system to clean Tailwind CSS tokens with OLED Dark and Light mode.
- Hardened authentication with IP-scoped rate limiting (20 req / 15m).
- Migrated client state to modular Context API (`AuthContext`, `ThemeContext`, `ToastContext`).

### Security
- Mitigated unverified social authentication account takeover vulnerabilities.
- Applied Helmet security headers and strict CORS origin whitelisting.

## [1.0.0] - 2026-09-01
- Initial prototype release of basic class booking interface.
