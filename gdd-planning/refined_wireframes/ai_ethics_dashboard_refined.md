# Refined Wireframe: AI Ethics Dashboard

**Target Student Lead:** Cyncia Chen  
**Original Wireframe:** `gdd-planning/wire_frames/AI Ethics Dashboard/` (`dashboard all tools.png`, `individual tool.png`, `tool grouping.png`)

---

## 🖼️ Refined Visual UI Mockup

![AI Ethics Dashboard Refined Wireframe](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/ai_ethics_dashboard_refined.jpg)

---

## 📐 Layout & Structural Refinements

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ [Nav] Home  AI Ethics Dashboard  Methodology  Infographics  [Sign In] [Up]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🔍 Search AI Ethics Tools... [Input]                                        │
│ Filter by: [Tool Type ▾] [Research ▾] [Project Stage ▾] [Price ▾] [Score ▾]  │
├─────────────────────────────────────────────────────────────────────────────┤
│ General Purpose Tools (12)                                                  │
│ ┌──────────────────────┐ ┌──────────────────────┐ ┌──────────────────────┐ │
│ │ Tool Name        🔖 │ │ Tool Name        🔖 │ │ Tool Name        🔖 │ │
│ │ Score: [88/100  ████]│ │ Score: [94/100  ████]│ │ Score: [72/100  ████]│ │
│ │ Category Badge       │ │ Category Badge       │ │ Category Badge       │ │
│ │ Brief description... │ │ Brief description... │ │ Brief description... │ │
│ └──────────────────────┘ └──────────────────────┘ └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Design Enhancements

1. **Standardized Ethicality Score Meter**:
   - Replaced plain horizontal slider graphic with a Shadcn `Progress` bar featuring dynamic color coding:
     - `Score >= 80`: Green (`bg-emerald-500`)
     - `50 <= Score < 80`: Yellow (`bg-amber-500`)
     - `Score < 50`: Red (`bg-red-500`)
   - Added numerical score badge (`88/100`) for accessibility and immediate clarity.

2. **Unified Filter Control Bar**:
   - Replaced scattered plain text links with a Shadcn `Select` and `ToggleGroup` bar.
   - Includes real-time search input (`Input` with magnifying glass icon).

3. **Bookmark & Modal Details**:
   - Added interactive Bookmark button (`Bookmark` icon from Lucide) with toast notifications when saving.
   - Clicking a tool card opens a detailed view modal (`Dialog` component) displaying:
     - Ethical evaluation dimensions (Fairness, Transparency, Privacy, Accountability).
     - Strapi CMS dynamic tool documentation & external link.

---

## 🛠️ Shadcn UI Component Mapping

- **Header / Actions**: `Button` (`variant="outline"`), `Breadcrumb`.
- **Search & Filters**: `Input`, `Select`, `DropdownMenu`, `Badge`.
- **Tool Cards**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
- **Ethicality Meter**: `Progress` bar + `Badge`.
- **Tool Modal**: `Dialog`, `DialogTrigger`, `DialogContent`, `DialogHeader`.

---

## 📱 Mobile Responsiveness Strategy
- On screens `< 768px`, the horizontal filter bar transforms into a sticky "Filter Tools" trigger button opening a slide-out drawer (`Sheet`).
- Tool grid adjusts automatically from `grid-cols-4` (Desktop) to `grid-cols-2` (Tablet) and `grid-cols-1` (Mobile).
