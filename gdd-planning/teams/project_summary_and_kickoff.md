# GDD Toolkit 2026: Executive Summary & Team Kickoff Guide

## 📌 Executive Summary & Project Status

### 1. Project Goal & Tech Stack
The **GDD Toolkit 2026** project is undergoing a strategic UI redesign, wireframe refinement, and backend infrastructure migration:
- **Frontend**: Vite + React 19 + TypeScript + Tailwind CSS (v4) + Framer Motion + **Shadcn UI** components.
- **Backend Framework & CMS**: **Strapi v5 CMS** hosted on AWS (App Runner / EC2) with an **AWS RDS PostgreSQL** database.
- **Global & Asia Latency Strategy**: **AWS CloudFront CDN** edge-caching static assets and API responses across 400+ global locations (delivering sub-30ms latency for Asian users, avoiding expensive Kubernetes overhead).

---

## 🏗️ Architecture & Authentication Decisions

### A. Backend & CMS Role
- **Single Backend Architecture**: **Strapi v5 *is* your backend server**. It provides the CMS admin interface for researchers, generates REST/GraphQL endpoints for all 8 database entities (`ai_tools`, `worthwhile_development`, `funding_sources`, etc.), and manages user sessions directly. No extra custom server (Express/Nest) is needed in front of Strapi.

### B. Authentication & Sign-Up Flow
- **Multi-Method Authentication**: Supports both standard **Email + Password** and **Google SSO (OAuth 2.0)** ("Continue with Google").
- **Mandatory Email Verification**: Newly registered Email + Password accounts receive a verification token link (`/auth/email-verification`) to confirm their inbox before gaining elevated privileges.
- **Role-Based Access Control (RBAC)**: Enforces a 4-tier permission matrix (`Public`, `Student`, `Researcher`, `Admin`) via JWT tokens and React `ProtectedRoute` wrappers.

---

## 👥 Student Team Assignments & Kickoff Tasks

Each team member has a dedicated task assignment; most have detailed wireframe specifications in `gdd-planning/refined_wireframes/`:

| Student | Assigned Module | Wireframe Spec & Sprint 1 Focus |
| :--- | :--- | :--- |
| **Youssef Ali Ahmed** | **Public Policy, Auth & Global Layout** | Set up Shadcn UI, build global `Header`/`Footer`, implement `AuthModal` (Email + Google SSO dialog), and setup `AuthContext` shell. ([`global_layout_rbac_refined.md`](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/global_layout_rbac_refined.md)) Public Policy scope TBD. |
| **Cyncia Chen** | **AI Ethics Dashboard** | Construct tool cards grid, category tabs, and search bar using Shadcn UI (`Card`, `Badge`, `Tabs`). ([`ai_ethics_dashboard_refined.md`](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/ai_ethics_dashboard_refined.md)) |
| **Andrew Mei** | **Geopolitical Analysis** | Build interactive vector map container, country metric overlay popovers, and country selector. ([`geopolitical_analysis_refined.md`](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/geopolitical_analysis_refined.md)) |
| **Ediale Odia** | **Grants & Funding Portal** | Build funding opportunity cards grid, grant amount sliders, and mobile slide-out filter drawer (`Sheet`). ([`grants_portal_refined.md`](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/grants_portal_refined.md)) |
| **Brendan Hu** | **Project Planning Wizard** | Build multi-step project evaluation stepper form (`Progress`, `RadioGroup`, `Form`) and indicator score calculator. ([`project_planning_refined.md`](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/project_planning_refined.md)) |
| **Dennis Huynh** | **Maldevelopment Case Studies Reader** | Build long-form research reading layout, sticky Table of Contents, SDG color badges, and indicator scorecards. ([`public_policy_maldev_refined.md`](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/public_policy_maldev_refined.md)) |
| **Ian Panait** | **Podcasts** | Bind the existing Podcasts page to the Strapi `podcast` collection. No refined wireframe yet. |

---

## 🚀 Sprint Strategy for Students

1. **Phase 1 (Days 1–3)**: Build responsive React page layouts using **Shadcn UI** components and static mock JSON data (matching entity schemas in [`database_tables.txt`](file:///home/ssefa/gdd/gdd-toolkit-2026/database_tables.txt)).
2. **Phase 2 (Days 4–7)**: Connect pages to Youssef's unified `Header`/`Footer` and `AuthContext` to test user sign-up and role badges.
3. **Phase 3 (Week 2)**: Bind static components to dynamic Strapi v5 CMS API endpoints.

---

## 📁 Key Documentation Links

- **Repository Implementation Plan**: [`gdd-planning/plans/implementation_plan.md`](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/plans/implementation_plan.md)
- **Refined Wireframes Overview**: [`gdd-planning/refined_wireframes/README.md`](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/README.md)
- **Database Tables List**: [`database_tables.txt`](file:///home/ssefa/gdd/gdd-toolkit-2026/database_tables.txt)
