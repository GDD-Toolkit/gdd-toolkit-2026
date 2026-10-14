# GDD Toolkit Redesign & Infrastructure Migration Plan (2026)

## Overview

This implementation plan outlines the strategic redesign, infrastructure architecture, wireframe refinement, and student task distribution for the **GDD Toolkit** website. 

The primary goals for this semester are:
1. **Adopting and Refining Wireframes**: Converting wireframe mockups (`gdd-planning/wire_frames`) into clean, responsive React pages powered by **Shadcn UI** components.
2. **Backend Infrastructure & Strapi CMS Migration**: Setting up a dedicated backend infrastructure (Strapi v5 CMS + AWS Lambda + AWS RDS PostgreSQL) to replace legacy Amplify for user authentication, role management, and dynamic content updates.
3. **Role-Based Access Control (RBAC) & Multi-Method Auth Flow**: Implementing user roles (Public, Student, Researcher, Admin), Email + Password registration, Google SSO (OAuth 2.0), mandatory Email Verification, Sign Up / Sign In modal dialogs, and protected route access.
4. **Asia Latency & Global Infrastructure Decision**: Evaluating deployment strategy (CloudFront CDN + Multi-Region vs Kubernetes) for high performance overseas in Asia.
5. **Student Issue Distribution**: Structuring clear, actionable tasks for the 7 team members: Cyncia, Andrew, Ediale, Dennis, Ian, Brendan, and Youssef.

---

## Infrastructure Architecture & Evaluation

### Architecture Overview

```
[ Asian & Global Users ]
         │
         ▼
[ AWS CloudFront CDN ] ── (Edge Caching HTML/JS/Assets < 30ms latency)
         │
         ├───▶ [ S3 / CloudFront Static Hosting ] (Vite + React Frontend)
         │
         └───▶ [ AWS API Gateway + Lambda Proxy ]
                     │
                     ├───► /api/auth/register          (Email + Password registration)
                     ├───► /api/auth/email-confirmation (Email verification token verification)
                     ├───► /api/connect/google         (Google OAuth 2.0 SSO endpoint)
                     ├───► /api/auth/local             (JWT Authentication login)
                     └───► [ Strapi v5 CMS (AWS EC2 / App Runner + PostgreSQL) ]
```

### Recommendation: CloudFront CDN + Multi-Instance EC2/App Runner vs. Kubernetes (EKS)

> [!IMPORTANT]
> **Decision: Recommend CloudFront CDN + App Runner / EC2 over Kubernetes (EKS).**

* **Why NOT Kubernetes (EKS)?**
  - **Latency Issue**: A Kubernetes cluster hosted in US-East will still suffer from ~200ms–300ms trans-Pacific latency for users in Asia if traffic has to travel to the origin server. K8s does not solve edge latency on its own.
  - **Operational Overhead**: EKS adds high complexity (ingress rules, helm charts, pod autoscaling, node group upgrades) that diverts student focus from UI/UX and feature delivery.
  - **Cost**: Running an EKS control plane costs $72/month minimum just for the cluster plane, plus node costs.

* **Why CloudFront CDN + Strapi Backend (Lambda/EC2)?**
  - **Ultra-low Latency for Asia**: AWS CloudFront has over 400+ Edge Locations globally (including Tokyo, Osaka, Seoul, Taipei, Hong Kong, Singapore). Static web assets and cached Strapi API responses are served locally within 15–30ms.
  - **Strapi Auto-Sync**: When other research teams update case studies or content in Strapi CMS, cache invalidations or standard TTLs allow instant global availability.
  - **Simplicity & Reliability**: Easy CI/CD deployment via GitHub Actions for students.

---

## Technical Stack & UI Guidelines

1. **Frontend**: Vite + React 19 + TypeScript + Tailwind CSS (v4) + Framer Motion + Lucide Icons.
2. **UI Library**: **Shadcn UI** (accessible Radix primitives with customized Tailwind styles).
3. **Backend Infrastructure**: Strapi v5 CMS + AWS Lambda API Proxy + PostgreSQL RDS.
4. **Auth & State**: JWT Tokens + React Auth Context + Email Verification + Google OAuth 2.0 SSO + Shadcn Auth Dialog Modals.

---

## Student Task Breakdown & Issue Registry

Below are the 8 detailed issues ready to be assigned on GitHub/GitLab:

---

### Issue 1: AI Ethics Dashboard & Tools System Integration
**Assignee:** Cyncia Chen  
**Module:** `gdd-planning/wire_frames/AI Ethics Dashboard`

#### Responsibilities:
1. **Wireframe Refinement & Component Implementation**:
   - Refine and construct the **AI Ethics Dashboard** layout (`dashboard all tools.png`, `individual tool.png`, `tool grouping.png`).
   - Implement filterable categories, search bar, tool cards, and individual tool detail views using Shadcn UI (`Card`, `Badge`, `Tabs`, `Dialog`, `Input`).
2. **Strapi CMS Data Binding**:
   - Connect page components to Strapi CMS API to dynamically pull AI Ethics tools.
   - Implement loading skeletons and error boundary handling.
3. **Mobile Optimization**:
   - Ensure the multi-column tool grid seamlessly collapses into a single-column card feed on mobile devices (`< 768px`).

---

### Issue 2: Geopolitical Analysis & Interactive Map Visualization
**Assignee:** Andrew Mei  
**Module:** `gdd-planning/wire_frames/Geopolitical Analysis`

#### Responsibilities:
1. **Wireframe Refinement & Component Implementation**:
   - Build the **Geopolitical Analysis** dashboard (`Map.png`, `Description.png`, `Map Dropdown.png`, `Country/`).
   - Implement interactive country selector, indicator filters, and geopolitical metric overlays using Shadcn UI (`Select`, `Popover`, `Accordion`, `Tooltip`).
2. **Interactive Map Component**:
   - Refine the map interaction (using Leaflet / SVG map renderer) to display country-specific research metadata and indicator scores upon selection.
3. **Mobile & Touch Optimization**:
   - Adapt map controls and dropdown drawers to be thumb-friendly on mobile screens.

---

### Issue 3: Grants & Funding Opportunities Portal
**Assignee:** Ediale Odia  
**Module:** `gdd-planning/wire_frames/Grants`

#### Responsibilities:
1. **Wireframe Refinement & Component Implementation**:
   - Build the **Grants Portal** (`Funding Sources Page.png`, `More info Pop-up.png`, `Audiences.png`, `Nationalities.png`, `Grant Amount.png`).
   - Create multi-faceted filter bars (Grant Amount slider, Target Audience badges, Nationality dropdowns) and detail modal popups using Shadcn UI (`Slider`, `Checkbox`, `Dialog`, `Sheet`).
2. **Strapi Integration**:
   - Define data contract and fetch active grants dynamically from Strapi CMS.
   - Implement client-side filtering and search indexing.
3. **Mobile Optimization**:
   - Implement a responsive filter drawer (`Sheet` component) for mobile filter operations.

---

### Issue 4: Project Planning Interactive Wizard
**Assignee:** Brendan Hu  
**Module:** `gdd-planning/wire_frames/Project Planning`

#### Responsibilities:
1. **Wireframe Refinement & Component Implementation**:
   - Implement the step-by-step **Project Planning Wizard** (`Frame 1.png`, `Frame 4.png`, `Frame 5.png`, `select options.png`).
   - Create progress indicators, interactive forms, and project evaluation steps using Shadcn UI (`Form`, `RadioGroup`, `Progress`, `Stepper`).
2. **Form State Management**:
   - Manage multi-step form state and evaluation score calculations (Well-Being, Equality, Sustainability, etc.).
3. **Mobile Optimization**:
   - Ensure step progress indicators collapse to a compact mobile stepper.

---

### Issue 5: Maldevelopment Case Studies Reader
**Assignee:** Dennis Huynh  
**Module:** `gdd-planning/wire_frames/Public Policy_Mal Dev`

#### Responsibilities:
1. **Wireframe Refinement & Component Implementation**:
   - Implement the **Case Studies list and detail reader** (`Body.png`, `CaseStudyDetails.png`).
   - Build clean typography layouts, structured indicator scorecards, SDG badges, and reference sections using Shadcn UI (`Card`, `Badge`, `Separator`, `Table`).
2. **Automated Content Sync via Strapi**:
   - Connect components to Strapi CMS API to automatically populate new case studies and policy papers uploaded by external research teams.
3. **Mobile Optimization**:
   - Optimize long-form research reading experience with mobile table-of-contents and responsive image containers.

---

### Issue 6: Backend Infrastructure, RBAC, Multi-Method Auth & Global Layout
**Assignee:** Youssef Ali Ahmed  
**Module:** System Infrastructure & Global Design System

#### Responsibilities:
1. **Backend Infrastructure Setup**:
   - Provision and configure **Strapi v5 CMS** on AWS (EC2 / App Runner) connected to AWS RDS PostgreSQL.
   - Expose authentication endpoints (`/api/auth/register`, `/api/auth/local`, `/api/connect/google`, `/api/auth/email-confirmation`).
2. **Role-Based Access Control (RBAC)**:
   - Implement role-based user context (`Public`, `Student`, `Researcher`, `Admin`) linked with JWT tokens.
   - Gate administrative features/views based on authenticated user roles and build protected route wrappers.
3. **Multi-Method Sign-Up & Sign-In Auth Flow**:
   - Build navbar CTA buttons ("Sign In" / "Sign Up") and tabbed Shadcn `Dialog` modal with Email + Password forms and "Continue with Google" OAuth SSO.
   - Implement mandatory Email Verification workflow (sending verification email token & callback route).
   - Implement User Avatar dropdown menu with active role badge and logout action.
4. **Analytics & User Telemetry**:
   - Integrate lightweight analytics (e.g. AWS Lambda logger / Plausible / PostHog) to track visitor demographics (focusing on Asian region access), top-visited case studies, and user retention.
5. **Global Responsive Header & Shadcn Layout**:
   - Refine unified top navbar, footer, and mobile slide-out navigation (`Drawer`/`Sheet`).
   - Enforce global Shadcn design tokens across all 5 student module pages.

---

### Issue 7: Podcasts
**Assignee:** Ian Panait  
**Module:** Existing Podcasts page (`frontend/src/pages/resources/Podcast.tsx`) — no refined wireframe yet

#### Responsibilities:
1. **Strapi Integration**:
   - Bind the Podcasts page to the Strapi `podcast` collection.

---

### Issue 8: Public Policy
**Assignee:** Youssef Ali Ahmed  
**Module:** No wireframe yet

#### Responsibilities:
1. Scope TBD.

---

## Verification & Deployment Roadmap

1. **Phase 1: Wireframe & Design System Sync**
   - Install and configure Shadcn UI components in `frontend/src/components/ui`.
   - Align color palette, typography, and mobile breakpoints.
2. **Phase 2: Backend & Strapi Binding**
   - Verify AWS Lambda function endpoint against Strapi v5 API endpoints (`/api/coherts`, `/api/case-studies`, `/api/grants`).
3. **Phase 3: Performance & Mobile Testing**
   - Run Lighthouse performance audits and test latency routing through AWS CloudFront.
