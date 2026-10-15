# Refined Wireframe: Project Planning Interactive Wizard

**Target Student Lead:** Brendan Hu  
**Original Wireframe:** `gdd-planning/wire_frames/Project Planning/` (`Frame 1.png`, `Frame 4.png`, `Frame 5.png`, `select options.png`)

---

## 🖼️ Refined Visual UI Mockup

![Project Planning Refined Wireframe](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/project_planning_refined.jpg)

---

## 📐 Layout & Structural Refinements

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Project Planning Framework & Wizard                                         │
│ Step 1: Framework Intro ───▶ Step 2: Select Tools ───▶ Step 3: Evaluation   │
├─────────────────────────────────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────────────────────────────────┐ │
│ │                      [ Video / Interactive Guide ]                      │ │
│ └─────────────────────────────────────────────────────────────────────────┘ │
│                                                                             │
│ Why Project Plan?                                                           │
│ ┌────────────────────────┐ ┌────────────────────────┐ ┌──────────────────┐ │
│ │ 📝 Define Goals        │ │ 📊 Measure Impact      │ │ 🔄 Iterate       │ │
│ │ Structured roadmap...  │ │ Quantifiable metrics.. │ │ Continuous loop. │ │
│ └────────────────────────┘ └────────────────────────┘ └──────────────────┘ │
├─────────────────────────────────────────────────────────────────────────────┤
│ Project Planning Tools Matrix                                               │
│ 🔍 [Search...]  Filter: [Keywords ▾]  [✨ AI Recommend Filter]               │
│                                                                             │
│ ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐            │
│ │ DMEDI Framework  │ │ Tool Name        │ │ Tool Name        │            │
│ │ [Circular Chart] │ │ [Circular Chart] │ │ [Circular Chart] │            │
│ │ Explore/Develop  │ │ Stage: Define    │ │ Stage: Measure   │            │
│ └──────────────────┘ └──────────────────┘ └──────────────────┘            │
│ Page [ < 1  2  3 > ]                                                        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## ✨ Design Enhancements

1. **Step-by-Step Progress Stepper**:
   - Added a clear multi-step progress bar (`Progress` / `Tabs`) at the top of the wizard page so users can track their project planning workflow.

2. **Interactive Tool Matrix Grid**:
   - Replaced flat static circular graphics with clean, vector-rendered methodology diagrams (using SVG / CSS canvas).
   - Added an **"AI Recommend Filter"** feature button allowing users to input project descriptions and automatically highlight matching planning tools.

3. **Evaluation Cards & Selection Component**:
   - Refined selector cards (`select options.png`) using Shadcn `RadioGroup` and `Card` components with active border highlights (`border-emerald-600 ring-2 ring-emerald-500`).

---

## 🛠️ Shadcn UI Component Mapping

- **Wizard Stepper**: `Tabs`, `Progress`, `Breadcrumb`.
- **Hero & Feature Cards**: `Card`, `Aspect Ratio` (for responsive video embed), `Button`.
- **Search & Filters**: `Input`, `Select`, `Toggle`, `Badge`.
- **Tool Cards & Diagrams**: `Card`, `CardHeader`, `CardContent`, `HoverCard`.
- **Form Controls**: `Form`, `RadioGroup`, `Label`, `Checkbox`.

---

## 📱 Mobile Responsiveness Strategy
- The 3-step progress header transforms into a compact step counter ("Step 2 of 3") on mobile (`< 640px`).
- Tool matrix grid scales from 3 columns down to a swipeable horizontal carousel or single column stack on mobile touchscreens.
