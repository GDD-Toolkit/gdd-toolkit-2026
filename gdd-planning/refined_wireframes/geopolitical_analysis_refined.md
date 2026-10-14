# Refined Wireframe: Geopolitical Analysis

**Target Student Lead:** Andrew Mei  
**Original Wireframe:** `gdd-planning/wire_frames/Geopolitical Analysis/` (`Map.png`, `Map Dropdown.png`, `Country/`, `Description.png`)

---

## 🖼️ Refined Visual UI Mockup

![Geopolitical Analysis Refined Wireframe](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/geopolitical_analysis_refined.jpg)

---

## 📐 Layout & Structural Refinements

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Geopolitical Analysis Dashboard                                             │
│ Selectors: [Select Country ▾]  [Select Region ▾]  [Select Indicator ▾]       │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────┐ ┌────────────────────────┐ │
│ │                                              │ │ Country Inspector      │ │
│ │           [ Interactive World Map ]          │ │ 🏳️ Japan               │ │
│ │                                              │ │ Region: East Asia      │ │
│ │ 🔍 [+] [-]                                    │ │ Score: 8.8 / 10        │ │
│ │ Legend:                                      │ │ Key Indicators:        │ │
│ │ 🟢 East Asia  🟣 Mid East  🟠 South Asia    │ │ - Governance: High     │ │
│ │ 🔴 Europe     🟡 Africa    🔵 N. America     │ │ - Development: High    │ │
│ └──────────────────────────────────────────────┘ └────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Design Enhancements

1. **Interactive Vector Map Container**:
   - Replaced static low-resolution image with a clean, vector-based interactive map renderer (SVG / D3 / React-Simple-Maps).
   - Hover effects highlight country boundaries with sleek tooltips showing regional groupings and key policy metrics.

2. **Side-by-Side Country Inspector Card**:
   - When a country is selected via the map or dropdown, a responsive Shadcn `Card` slides in on the right pane displaying:
     - Flag, Country Name, and Sub-region.
     - Development Scorecard & Sustainable Development Goal (SDG) alignment.
     - Linked Case Studies fetched from Strapi CMS.

3. **Zoom & Inset Controls**:
   - Refined map navigation controls using Shadcn `Button` components with `Plus`, `Minus`, and `Maximize` icons from Lucide.
   - Clean popover drawer for Caribbean and Europe region insets.

---

## 🛠️ Shadcn UI Component Mapping

- **Top Control Bar**: `Select`, `Combobox` (Searchable country dropdown), `Popover`.
- **Map Viewport Card**: `Card`, `Tooltip`, `Badge`.
- **Country Inspector Drawer**: `Sheet` (Mobile) / `Card` (Desktop side panel), `Accordion` (Metric details), `Tabs`.
- **Actions**: `Button`, `DropdownMenu`.

---

## 📱 Mobile Responsiveness Strategy
- Interactive SVG maps can be tricky on small touchscreens. On mobile (`< 768px`), the page provides a **Toggle Switch**:
  - **Map View**: Full-screen interactive map with touch pinch-to-zoom.
  - **List View**: Accessible searchable accordion list of countries grouped by region.
