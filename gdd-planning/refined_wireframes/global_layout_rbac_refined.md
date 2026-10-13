# Refined Wireframe: Global Infrastructure, Backend, RBAC & Sign-Up Auth Flow

**Target Student Lead:** Youssef Ali Ahmed  
**Original Specification:** Overall App Layout, Backend Infrastructure, Role-Based Access Control (RBAC), Sign Up / Auth Flow, Mobile Responsiveness & Telemetry

---

## 📐 Layout & Structural Refinements

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Logo] GDD Toolkit   [Home] [AI Ethics] [Geopolitical] [Grants] [Planning]   │
│                                           [🔍 Search] [Sign In] [Sign Up]   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│                        [ Main Module Page Content ]                         │
│                                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│ Footer: GDD Cohort 2026 | UMD Infrastructure & Interface | Privacy | Contact│
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🏗️ Backend Infrastructure & Auth Architecture

```
[ Frontend: React + Shadcn Auth UI ]
          │
          ├───► Sign Up / Login Forms (JWT Auth Context)
          │
          ▼
[ AWS API Gateway + Lambda Proxy ]
          │
          ├───► /api/auth/register (Strapi Users-Permissions)
          ├───► /api/auth/login    (Returns JWT + User Role)
          └───► /api/telemetry     (Logs Asia vs Global User Analytics)
          │
          ▼
[ Backend: Strapi v5 CMS + PostgreSQL ]
  Roles: [Public] [Student] [Researcher] [Admin]
```

---

## ✨ Key Backend & Auth Enhancements

1. **Sign Up & Sign In Modal Workflow**:
   - Navbar features a prominent **"Sign In"** button and **"Sign Up"** CTA button (`Button` component with `variant="default"`).
   - Clicking opens an accessible modal dialog (`Dialog` component) featuring tabbed forms:
     - **Sign Up Form**: Name, Email, Role (Student / Researcher / Faculty), Password, Institution.
     - **Sign In Form**: Email, Password, "Remember Me", "Forgot Password?".
   - Upon successful authentication, the header replaces "Sign In / Sign Up" with a User Profile Avatar dropdown menu displaying the logged-in user's role badge (e.g. `[Researcher]`).

2. **Role-Based Access Control (RBAC)**:
   - **Public Role (Unauthenticated)**: Read-only access to published case studies, tools, and grant opportunities.
   - **Student / Researcher Role**: Ability to bookmark tools, save grant alerts, submit community case study drafts, and participate in project planning evaluations.
   - **Admin Role**: Full access to Strapi CMS admin dashboard, content approval workflows, and analytics telemetry logs.

3. **Backend Infrastructure Setup**:
   - **Strapi v5 CMS**: Hosted on AWS App Runner / EC2 with PostgreSQL (AWS RDS).
   - **AWS Lambda Authentication Proxy**: Handles JWT validation, password hashing security, and CORS headers.
   - **User Analytics Telemetry**: Lambda endpoint logging visitor location (detecting Asian region traffic), device type (mobile vs desktop), and active feature usage.

---

## 🛠️ Shadcn UI Component Mapping

- **Header Controls**: `Button`, `NavigationMenu`, `Avatar`, `DropdownMenu` (User profile & RBAC menu).
- **Auth Modals**: `Dialog`, `DialogContent`, `Tabs`, `Form`, `FormField`, `FormItem`, `FormLabel`, `Input`, `Checkbox`.
- **RBAC Badges**: `Badge` (`variant="outline"` / `variant="secondary"`).
- **Notifications**: `Toaster`, `toast` (Sonner) for login success / error messages.

---

## 📱 Mobile Responsiveness Strategy
- Mobile header (`< 768px`) displays the Sign In / Sign Up buttons directly inside the slide-out navigation `Sheet` drawer.
- User profile menu collapses into a clean mobile user tile with quick logout actions.
