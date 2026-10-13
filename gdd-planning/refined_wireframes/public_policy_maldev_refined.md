# Refined Wireframe: Public Policy & Maldevelopment Case Studies

**Target Student Lead:** Dennis Huynh  
**Original Wireframe:** `gdd-planning/wire_frames/Public Policy_Mal Dev/` (`Body.png`, `CaseStudyDetails.png`)

---

## 🖼️ Refined Visual UI Mockup

![Public Policy Case Studies Refined Wireframe](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/public_policy_maldev_refined.jpg)

---

## 📐 Layout & Structural Refinements

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ ← Back to Case Studies                                                     │
│ Health Professionals Education and Training                                 │
│ 🔗 Read Original Publication ↗ | 📅 Updated Sept 2026 | 👤 By Research Team │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │                         [ Hero Banner Image ]                           │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ Metadata Indicator Cards:                                                   │
│ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ ┌────────────────┐ │
│ │ 🌍 Region      │ │ 💡 Values      │ │ 🎯 SDGs        │ │ 🏷️ Keywords    │ │
│ │ East Asia &    │ │ • Empowerment  │ │ • SDG 3: Health│ │ well-being,    │ │
│ │ Pacific        │ │ • Equity       │ │ • SDG 4: Educ. │ │ digital, infra │ │
│ └────────────────┘ └────────────────┘ └────────────────┘ └────────────────┘ │
├───────────────────────────────────────┬─────────────────────────────────────┤
│ Case Study Content & Analysis         │ Table of Contents (Sticky)          │
│                                       │ • Introduction & Context            │
│ 1. Executive Summary                  │ • Policy Framework & Methods        │
│ Description of health training...     │ • SDG & Values Evaluation           │
│                                       │ • Findings & Implications           │
│ 2. SDG & Values Alignment             │ • Academic References               │
│ Analysis of indicator scores...       │                                     │
└───────────────────────────────────────┴─────────────────────────────────────┘
```

---

## ✨ Design Enhancements

1. **Official SDG Color Badge System**:
   - Replaced basic orange text labels with official UN SDG color-coded badges (`SDG 3: Good Health` in `#4C9F38`, `SDG 4: Quality Education` in `#C5192D`).

2. **Metadata Card Grid**:
   - Refined 4 indicator cards with clean rounded corners (`rounded-xl`), subtle hover elevation, and distinct pastel border accents (Purple for Region, Blue for Values, Orange for SDGs, Gray for Keywords).

3. **Sticky Sidebar Table of Contents**:
   - Added a desktop sticky sidebar (`sticky top-20`) that highlights the active section as the user scrolls through long case studies.

4. **Automated Content Sync from Strapi CMS**:
   - Structured content layout to automatically render rich markdown/HTML payloads fetched directly from the Strapi CMS `case-studies` collection endpoint.

---

## 🛠️ Shadcn UI Component Mapping

- **Header & Nav**: `Button` (ghost style with `ArrowLeft`), `Breadcrumb`.
- **Hero & Banner**: `Aspect Ratio`, `Avatar` (author profile), `Badge`.
- **Indicator Cards**: `Card`, `CardContent`, `Badge`.
- **Content Article**: `Typography` prose styles, `Separator`, `Accordion` (for expandable references).
- **Sticky Navigation**: `ScrollArea`, `Nav`.

---

## 📱 Mobile Responsiveness Strategy
- On mobile (`< 1024px`), the sticky right Table of Contents transforms into a top collapsible `Accordion` menu.
- Metadata indicator cards grid scales from 4 columns to 2x2 grid on tablet and single column stack on mobile.
