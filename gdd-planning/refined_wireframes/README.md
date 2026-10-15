# Refined Wireframes & Design System (GDD Toolkit 2026)

Welcome to the refined wireframe specifications for the **GDD Toolkit 2026 Redesign**. This folder contains detailed structural, visual, and component specifications derived from inspecting the initial wireframes in `gdd-planning/wire_frames`.

Visual UI mockups have also been generated and compiled into the **[Visual Wireframe Gallery](file:///home/ssefa/.gemini/antigravity-ide/brain/3011e57e-b100-4a73-b12f-bbb0cca8c95e/refined_wireframe_gallery.md)**.

---

## 🎨 Global UI Design System & Component Library

All refined wireframes adopt **Shadcn UI** components built on **Tailwind CSS (v4)** and **Radix UI** primitives for accessibility, consistent spacing, and mobile responsiveness.

### Color Palette (Tailwind Design Tokens)
- **Primary / Brand Green**: `bg-emerald-800` / `text-emerald-950` / `border-emerald-700`
- **Secondary Accent**: `bg-amber-100` / `text-amber-900` (Warm gold highlight)
- **Neutral Background**: `bg-slate-50` (Light mode) / `bg-slate-900` (Dark mode support)
- **Card & Surface**: `bg-white dark:bg-slate-800` with `shadow-sm` and `border border-slate-200`
- **Text & Typography**: `font-sans` (Inter/Outfit), titles in serif or bold sans (`font-semibold`)

---

## 📁 Refined Modules Index

Each file in this folder maps directly to a student lead and wireframe module:

| Module File | Target Student | Wireframe Source | Key Improvements |
| :--- | :--- | :--- | :--- |
| [`ai_ethics_dashboard_refined.md`](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/ai_ethics_dashboard_refined.md) | **Cyncia Chen** | `AI Ethics Dashboard/` | Clean search & filter bar, standardized Ethicality Score meter, mobile-first card grid. |
| [`geopolitical_analysis_refined.md`](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/geopolitical_analysis_refined.md) | **Andrew Mei** | `Geopolitical Analysis/` | Interactive vector map container, popover country inspector, touch-friendly mobile list view. |
| [`grants_portal_refined.md`](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/grants_portal_refined.md) | **Ediale Odia** | `Grants/` | Dual metric stat badges, sticky desktop filter sidebar, mobile slide-out filter drawer (`Sheet`). |
| [`project_planning_refined.md`](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/project_planning_refined.md) | **Brendan Hu** | `Project Planning/` | Hero video integration, tool matrix grid with filter popovers, evaluation progress steppers. |
| [`public_policy_maldev_refined.md`](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/public_policy_maldev_refined.md) | **Dennis Huynh** | `Public Policy_Mal Dev/` | Hero banner with author metadata, standardized SDG color badges, sticky Table of Contents sidebar. |
| [`global_layout_rbac_refined.md`](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/global_layout_rbac_refined.md) | **Youssef Ali Ahmed** | Global Infrastructure | Responsive navbar with RBAC user menu, footer, Asia latency CDN caching, analytics telemetry. |
