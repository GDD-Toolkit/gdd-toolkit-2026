# GDD Toolkit: User Authentication, Management & RBAC Architecture Plan (2026)

**Document Status:** Ready for Review / Validation  
**Target Reviewer:** Claude / System Architect  
**Author:** GDD Toolkit Architecture & Infrastructure Team (Issue #6)  
**Date:** October 2026  

---

## 1. Executive Summary & Purpose

This technical architecture plan defines the complete specification for **User Authentication, Profile Management, and Role-Based Access Control (RBAC)** for the **GDD Toolkit** web platform. 

The primary objectives are:
1. Provide a unified, secure authentication system supporting **Email/Password** and **Google SSO (OAuth 2.0)**.
2. Establish a clear **4-tier Role-Based Access Control (RBAC)** model (`Public`, `Student`, `Researcher`, `Admin`) across all toolkit modules.
3. Leverage **Strapi v5 CMS (Node.js/TypeScript) + AWS RDS PostgreSQL** as the single source of truth for both content and user credentials, avoiding unnecessary microservice overhead.
4. Deliver an accessible, responsive frontend UI using **React 19 + TypeScript + Shadcn UI** modals and user navigation controls.

---

## 2. Technical Stack & Architectural Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          Frontend (React 19 + Vite)                         │
│                                                                             │
│  [ Header Nav ] ──► [ AuthModal (Shadcn Dialog) ] ──► [ React AuthContext ] │
│         │                                                    │              │
│         └──► [ UserDropdown (Role Badge + Avatar) ]          │ REST API     │
└──────────────────────────────────────────────────────────────┼──────────────┘
                                                               │ (JWT Bearer)
                                                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                     Strapi v5 CMS (`backend/research-cms`)                  │
│                                                                             │
│  ├── /api/auth/local             (Login - Email/Password)                   │
│  ├── /api/auth/local/register    (Sign Up with custom fields)               │
│  ├── /api/connect/google         (Google OAuth 2.0 SSO)                     │
│  ├── /api/users/me?populate=*    (Hydrate user, role & bookmarks)           │
│  └── /api/user/bookmarks         (Custom Bookmark Controllers)              │
└──────────────────────────────────────────────────────────────┬──────────────┘
                                                               │ TLS / SSL
                                                               ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                       AWS RDS PostgreSQL Database                           │
│                                                                             │
│  ├── `up_users` (extended with institution, name, bookmarks)                │
│  ├── `up_roles` (Public, Student, Researcher, Admin)                        │
│  └── CMS Content Tables (tools, grants, case studies, evaluations)          │
└──────────────────────────────────────────────────────────────┘
```

---

## 3. Data Model: Extending Strapi `Users-Permissions`

Strapi's default `up_users` schema will be extended via `backend/research-cms/src/extensions/users-permissions/content-types/user/schema.json` to include GDD-specific academic and research metadata.

### 3.1 User Schema Fields & Data Types

| Field Name | Type | Required | Description |
| :--- | :--- | :---: | :--- |
| `username` | String (Unique) | Yes | Unique login handle / display name |
| `email` | Email (Unique) | Yes | Primary contact & login email |
| `password` | Password | Yes (Local) | Hashed via `bcrypt` (work factor 10+) |
| `role` | Relation (Many-to-One) | Yes | Links to `up_roles` (`Public`, `Student`, `Researcher`, `Admin`) |
| `firstName` | String | Yes | User's given name |
| `lastName` | String | Yes | User's family name |
| `institution` | String | Yes | Affiliated university or organization (e.g., *University of Maryland*) |
| `department` | String | No | Department or research faculty unit |
| `bio` | Text | No | Short professional biography |
| `avatar` | Media / Single Image | No | Uploaded profile picture (stored in AWS S3) |
| `bookmarkedTools` | Relation (Many-to-Many) | No | AI Ethics tools saved by the user |
| `savedGrants` | Relation (Many-to-Many) | No | Funding opportunities saved by the user |
| `projectEvaluations`| Relation (One-to-Many) | No | Saved Project Planning Wizard assessments |
| `caseStudySubmissions` | Relation (One-to-Many)| No | Community case study drafts submitted by researchers |

### 3.2 TypeScript Definition (`frontend/src/types/auth.ts`)

```typescript
export type UserRole = 'Public' | 'Student' | 'Researcher' | 'Admin';

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: {
    id: number;
    name: UserRole;
    type: string;
  };
  confirmed: boolean;
  blocked: boolean;
  firstName: string;
  lastName: string;
  institution: string;
  department?: string;
  bio?: string;
  avatar?: {
    id: number;
    url: string;
    alternativeText?: string;
  };
  bookmarkedTools?: number[];
  savedGrants?: number[];
  projectEvaluations?: number[];
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  jwt: string;
  user: UserProfile;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  institution: string;
  roleType: 'Student' | 'Researcher';
}

export interface LoginPayload {
  identifier: string; // Email or username
  password: string;
}
```

---

## 4. Role-Based Access Control (RBAC) Matrix

### 4.1 Role Definitions & Permissions

```
                ┌─────────────────────────────────────────────────────────┐
                │                       ROLES                             │
                └────────────────────────────┬────────────────────────────┘
                                             │
      ┌──────────────────┬───────────────────┼───────────────────┐
      ▼                  ▼                   ▼                   ▼
   [Public]          [Student]          [Researcher]          [Admin]
 (Read-Only)      (+ Save & Wizard)    (+ Submissions)     (Full Control)
```

| Module / Action | Public (Guest) | Student | Researcher | Admin |
| :--- | :---: | :---: | :---: | :---: |
| **View Published Tools & Case Studies** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Search & Filter Grants & Geopolitical Maps** | ✅ Allowed | ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Save / Bookmark Tools & Grants** | ❌ (Prompts Login)| ✅ Allowed | ✅ Allowed | ✅ Allowed |
| **Run Project Planning Interactive Wizard** | Preview Only | Run & Save | Run & Save | Run & Save |
| **Submit Community Case Study Drafts** | ❌ Denied | ❌ Denied | ✅ (Pending Review)| ✅ Direct Publish |
| **Submit New Grant / Funding Opportunities** | ❌ Denied | ❌ Denied | ✅ (Pending Review)| ✅ Direct Publish |
| **Moderate & Approve Draft Content** | ❌ Denied | ❌ Denied | ❌ Denied | ✅ Allowed |
| **Access Strapi CMS Admin Dashboard** | ❌ Denied | ❌ Denied | ❌ Denied | ✅ Allowed |
| **View Visitor Analytics & Telemetry** | ❌ Denied | ❌ Denied | ❌ Denied | ✅ Allowed |

---

## 5. Authentication Flows & Token Strategy

### 5.1 Registration Flow (Email + Password)
1. User clicks **"Sign Up"** in the top navigation.
2. User submits registration details (`firstName`, `lastName`, `email`, `password`, `institution`, `roleType`).
3. Frontend validates form via **Zod** schema.
4. Frontend issues `POST /api/auth/local/register`.
5. Strapi creates record in `up_users`, hashes password with `bcrypt`, assigns requested role (`Student` or `Researcher`), and sends email verification.
6. Returns `jwt` + populated `user` object.

### 5.2 Login Flow (Email + Password)
1. User submits identifier and password via `LoginForm`.
2. Frontend calls `POST /api/auth/local`.
3. Strapi checks password hash against PostgreSQL.
4. Returns signed JWT (HS256) valid for 30 days + user profile with role.
5. Frontend stores JWT in `localStorage` and hydrates React `AuthContext`.

### 5.3 Google SSO (OAuth 2.0)
1. User clicks **"Continue with Google"** in `AuthModal`.
2. Browser redirects to Strapi Google provider endpoint: `GET /api/connect/google`.
3. Google authenticates user and redirects back to Strapi callback route.
4. Strapi matches email or creates new user record with `Student` role default.
5. Strapi redirects to frontend URL with JWT token in URL query parameter (`/auth/callback?token=...`).
6. Frontend extracts token, stores it, fetches `/api/users/me`, and updates `AuthContext`.

### 5.4 Token Security & Session Hydration
* **Token Storage**: Stored in `localStorage` for SPA ease of integration, with Authorization Header: `Authorization: Bearer <jwt>`.
* **Session Hydration**: On app startup, if a token exists in storage, the app invokes `GET /api/users/me?populate=*` to verify token validity and refresh user permissions. If invalid (expired/revoked), the token is purged and user state is reset.

---

## 6. Frontend Component Architecture

### 6.1 File Tree Layout
```
frontend/src/
├── api/
│   └── auth.ts                 <-- API fetch helpers (login, register, getMe, toggleBookmark)
├── context/
│   └── AuthContext.tsx         <-- React Context provider holding user, token, isAuthenticated
├── hooks/
│   └── useAuth.ts              <-- Custom hook for consuming AuthContext
├── components/
│   ├── Header.tsx              <-- Global navigation header updated with Auth controls
│   └── auth/
│       ├── AuthModal.tsx       <-- Shadcn Dialog wrapping Login & Register tabs
│       ├── LoginForm.tsx       <-- Email + Password form with Zod validation
│       ├── RegisterForm.tsx    <-- Registration form with role selector & institution
│       ├── SocialAuthButtons.tsx <-- "Continue with Google" button
│       ├── UserDropdown.tsx    <-- Avatar, Role Badge, Bookmarks link, Logout
│       └── ProtectedRoute.tsx  <-- Role-based route guard wrapper
└── types/
    └── auth.ts                 <-- TypeScript interfaces
```

### 6.2 Route Protection Mechanism (`ProtectedRoute.tsx`)
```tsx
interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  children: React.ReactNode;
}

export function ProtectedRoute({ allowedRoles, children }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <LoadingSpinner />;
  if (!isAuthenticated) return <Navigate to="/" state={{ openAuthModal: true }} replace />;
  if (allowedRoles && user && !allowedRoles.includes(user.role.name)) {
    return <UnauthorizedNotice requiredRoles={allowedRoles} />;
  }

  return <>{children}</>;
}
```

---

## 7. Step-by-Step Implementation Roadmap

### Phase 1: Strapi Schema & Backend Configuration (`backend/research-cms`)
- [ ] Create Strapi extension for user schema adding `firstName`, `lastName`, `institution`, `department`, `bio`, `bookmarkedTools`, `savedGrants`.
- [ ] Configure Strapi `Users-Permissions` roles (`Public`, `Student`, `Researcher`, `Admin`) in the Strapi admin dashboard.
- [ ] Configure Google OAuth 2.0 credentials in `config/plugins.ts`.
- [ ] Create custom controller endpoints for saving/unsaving bookmarks (`/api/user/bookmarks/tools/:id`).

### Phase 2: Frontend State Management & API Layer (`frontend/`)
- [ ] Create `frontend/src/types/auth.ts`.
- [ ] Implement `frontend/src/api/auth.ts` with axios/fetch client.
- [ ] Implement `frontend/src/context/AuthContext.tsx` and `useAuth` hook with token persistence.

### Phase 3: UI Components & Modal Integration (`frontend/`)
- [ ] Add Shadcn UI components: `Dialog`, `Tabs`, `Form`, `Input`, `Avatar`, `DropdownMenu`, `Badge`.
- [ ] Build `AuthModal.tsx`, `LoginForm.tsx`, `RegisterForm.tsx`.
- [ ] Update `Header.tsx` to conditionally render "Sign In / Sign Up" buttons vs `<UserDropdown />`.

### Phase 4: Route Guards & Feature Gating (`frontend/`)
- [ ] Implement `ProtectedRoute.tsx`.
- [ ] Gate Project Planning Wizard save actions and submission forms.
- [ ] Add bookmark toggle buttons (`BookmarkIcon`) on AI Ethics Tool cards and Grants listings.

---

## 8. Specific Review Questions for Claude / Architecture Peer Review

Please review this plan and validate the following architectural decisions:

1. **Storage & Engine Design**:
   * Is extending Strapi v5's built-in `Users-Permissions` plugin on top of AWS RDS PostgreSQL the optimal design choice for a research toolkit of this scale, versus running a decoupled identity service (e.g., Supabase Auth or Clerk)?
2. **Token Strategy**:
   * For a Vite SPA, is `localStorage` JWT storage acceptable, or do you strongly recommend refactoring the backend to issue `httpOnly`, `SameSite=Strict` cookies to mitigate XSS risks?
3. **RBAC Granularity**:
   * Does the 4-tier role hierarchy (`Public`, `Student`, `Researcher`, `Admin`) sufficiently cover university student workflows, external researchers, and faculty administrators?
4. **Bookmark Data Schema**:
   * In Strapi, is managing bookmarks as direct `manyToMany` relations on the User schema performant, or should bookmarks be modeled as a dedicated join collection (e.g. `UserBookmark` with `userId`, `contentType`, `contentId`)?
5. **Edge Latency & CloudFront**:
   * Since our global deployment targets low latency in Asia, are there any caching implications for authenticated endpoints (`/api/users/me`) when routing traffic through AWS CloudFront CDN?
