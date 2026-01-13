# Secure Video Course Platform

## Overview

A secure video course learning platform where authenticated users access modules with protected video content, track their learning progress, and purchase course access via Stripe. The platform focuses on content security (no video downloads) and educational progress tracking. Marketing and external sales happen outside this app - this is purely the post-login learning experience.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack Query for server state, minimal client state
- **UI Components**: shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite with React plugin

The frontend follows a page-based structure under `client/src/pages/` with reusable components in `client/src/components/`. The design follows Apple HIG-inspired minimalist principles with emphasis on content hierarchy and educational focus.

### Backend Architecture
- **Runtime**: Node.js with Express
- **Language**: TypeScript with ESM modules
- **API Pattern**: RESTful JSON APIs under `/api/` prefix
- **Authentication**: Replit Auth integration using OpenID Connect with Passport.js
- **Session Management**: PostgreSQL-backed sessions via connect-pg-simple

The server uses a modular structure with routes registered in `server/routes.ts` and authentication handled through `server/replit_integrations/auth/`.

### Database Layer
- **Database**: PostgreSQL
- **ORM**: Drizzle ORM with drizzle-zod for validation
- **Schema Location**: `shared/schema.ts` for shared types between frontend and backend
- **Migrations**: Drizzle Kit with push-based migrations (`db:push` script)

Core tables:
- `courses`, `modules`, `lessons` - Course content structure
- `user_progress` - Lesson completion tracking per user
- `user_access` - Payment/access control per user
- `users`, `sessions` - Authentication (required for Replit Auth)

### Video Security
- Videos hosted on Vimeo with embed-only access
- No direct video URLs exposed in frontend
- Videos only loaded after authentication check
- Vimeo player configured with `dnt=1` and no download options

### Payment Flow
- **Provider**: Stripe (one-time payment, no subscriptions)
- **Integration**: stripe-replit-sync for webhook handling and schema management
- **Flow**: Checkout session → Stripe hosted page → Webhook grants access → User redirected to success page

## External Dependencies

### Third-Party Services
- **Stripe**: Payment processing with webhook integration for access control
- **Vimeo**: Video hosting with domain-protected embeds
- **Replit Auth**: OpenID Connect authentication service

### Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Session encryption secret
- `ISSUER_URL` - Replit OIDC issuer (defaults to https://replit.com/oidc)
- Stripe credentials managed via Replit Connectors

### Key NPM Packages
- `drizzle-orm` / `drizzle-kit` - Database ORM and migrations
- `express-session` / `connect-pg-simple` - Session management
- `passport` / `openid-client` - Authentication
- `stripe` / `stripe-replit-sync` - Payment processing
- `@tanstack/react-query` - Server state management
- `@radix-ui/*` - Accessible UI primitives