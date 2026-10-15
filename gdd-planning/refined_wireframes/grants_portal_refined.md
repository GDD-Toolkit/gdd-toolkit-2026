# Refined Wireframe: Grants & Funding Opportunities Portal

**Target Student Lead:** Ediale Odia  
**Original Wireframe:** `gdd-planning/wire_frames/Grants/` (`Funding Sources Page.png`, `More info Pop-up.png`, `Audiences.png`, `Nationalities.png`, `Grant Amount.png`)

---

## 🖼️ Refined Visual UI Mockup

![Grants Portal Refined Wireframe](file:///home/ssefa/gdd/gdd-toolkit-2026/gdd-planning/refined_wireframes/grants_portal_refined.jpg)

---

## 📐 Layout & Structural Refinements

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ Funding Opportunities Portal                                                │
│ Browse external scholarships, fellowships, and grants for researchers.      │
│                                                                             │
│  ┌───────────────────────┐   ┌───────────────────────┐                      │
│  │ 33                    │   │ 4                     │                      │
│  │ Active Grants         │   │ Target Audiences      │                      │
│  └───────────────────────┘   └───────────────────────┘                      │
├─────────────────────────────────────────────────────────────────────────────┤
│ 🔍 Search grants by title, donor, or field... [Search Bar]                  │
├───────────────────────────────────────────────────────┬─────────────────────┤
│ Results (Showing 33 opportunities) Sort: [Name ▾]     │ Filter Grants       │
│                                                       │                     │
│ ┌──────────────────────────────────────────────────┐  │ Grant Amount        │
│ │ AAUW Career Development Grants          [Apply]  │  │ [$1,000  - $50,000] │
│ │ 🏷️ U.S. Students   🏷️ Graduate                   │  │ Range Slider        │
│ │ Supports women preparing to advance careers...   │  │                     │
│ └──────────────────────────────────────────────────┘  │ Target Audience     │
│ ┌──────────────────────────────────────────────────┐  │ ☑️ Undergraduate    │
│ │ Global Development Research Fellowship  [Apply]  │  │ ☑️ Graduate         │
│ │ 🏷️ International   🏷️ Postdoc                   │  │ ☐ Faculty           │
│ └──────────────────────────────────────────────────┘  │                     │
└───────────────────────────────────────────────────────┴─────────────────────┘
```

---

## ✨ Design Enhancements

1. **Header Metric Badges**:
   - Upgraded stat circles to sleek metric highlight cards (`Card` with `font-bold` numbers in brand emerald accent color).

2. **Dual-Column Desktop Layout**:
   - Primary column (Left 70% width): Search result grant cards with clean tag badges, deadline indicators, and "More Details" triggers.
   - Sticky Sidebar column (Right 30% width): Interactive Shadcn `Slider` for Grant Amount ($ Min / $ Max), checkbox groups for Target Audience, and tag selection for Nationalities.

3. **Grant Detail Popup Dialog**:
   - Clicking a grant card opens an accessible `Dialog` modal presenting:
     - Full grant overview, eligibility criteria, application deadline, and award amount.
     - Direct external link button (`Button` with `ExternalLink` icon).
     - Strapi CMS tag dynamic links.

---

## 🛠️ Shadcn UI Component Mapping

- **Metrics & Container**: `Card`, `Badge`, `Separator`.
- **Search & Filters**: `Input`, `Slider`, `Checkbox`, `ToggleGroup`, `Button`.
- **Grant Cards**: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardFooter`.
- **Modal Popup**: `Dialog`, `DialogContent`, `DialogHeader`, `DialogFooter`.
- **Mobile Filter Drawer**: `Sheet`, `SheetTrigger`, `SheetContent`.

---

## 📱 Mobile Responsiveness Strategy
- On screens `< 1024px`, the sticky right filter sidebar is hidden and replaced by a prominent **"Filters (3 active)"** button at the top of the search results.
- Tapping the button slides open a full-height `Sheet` drawer containing all range sliders and filter checkboxes.
