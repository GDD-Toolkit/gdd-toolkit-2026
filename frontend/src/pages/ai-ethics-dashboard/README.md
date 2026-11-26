# AI Ethics Dashboard - Developer Handoff

## Project Overview

The AI Ethics Dashboard was developed by the Infrastructure
and Interface module in collaboration with the AI Ethics module.

The dashboard consists of three main pages:

- Dashboard homepage
- AI tools listing page
- Individual AI tool details page

The frontend uses React, TypeScript, and Tailwind CSS.
Tool information is retrieved from Strapi.

## Backend Information

CMS:
https://cms.devethicstoolkit.umd.edu/admin

API endpoint:
https://cms.devethicstoolkit.umd.edu/api/ai-tools

Production website:
https://devethicstoolkit.umd.edu

The API returned 41 AI tools as of November 2026.

The number of tools may change as the AI Ethics team
continues updating the CMS.

## Current Implementation

- Three dashboard pages and navigation
- Strapi API integration
- Dynamic tool names, logos, and descriptions
- Ethicality scores and individual evaluation criteria
- Pricing information
- Search interface and category navigation
- Filter dropdown interface
- FAQ accordion and resource modals

Code changes for API pagination, score filtering,
live homepage search, price matrix links, and similar
tools should be verified before deployment.

## Known Limitations and Missing Data

### 1. Tool Categories and Filters

The Strapi AI Tool content type currently lacks the
classification fields required by the frontend.

Suggested fields to add:

- category
- tool_type
- research_type
- project_development_type
- pricing_type

These field names are suggestions and have not been
implemented in the CMS.

The filter dropdowns can update their selected states,
but most filters cannot filter real tool data until
the corresponding CMS fields are available.

The homepage category cards also navigate to the tools
page without actually filtering tools by category.

Coordinate with the AI Ethics module to confirm the
classification system before implementing these fields.

Do not assign categories or pricing types without
confirmation from the AI Ethics team.

### 2. Bookmarks

The bookmark icon is currently a UI element.

Next steps:

- Implement bookmark selection and removal.
- Store bookmarked tool IDs.
- Add a bookmarked tools view.
- Consider localStorage for browser-based bookmarks
  or backend storage for account-based bookmarks.

### 3. Methodology and Infographics

The resource buttons currently open placeholder modals.

The AI Ethics module needs to provide:

- Final methodology document
- Infographics
- Supporting resource links or files

Replace the placeholder content in DashboardResources.tsx
once these materials are available.

### 4. FAQ

The FAQ currently contains temporary frontend content.

Confirm the final questions and answers with the
AI Ethics module before replacing the existing content.

### 5. Data Quality

Some tools may have missing pricing links, similar tools,
descriptions, or other evaluation information.

The frontend should handle missing data gracefully.

Some Strapi field names contain spelling errors.
Do not rename them in the frontend without coordinating
the corresponding backend changes.

## Important Files

- index.tsx
  Dashboard homepage and search interface.

- tools/index.tsx
  Tools listing, search, and filtering logic.

- tool/index.tsx
  Individual tool details and ethical evaluations.

- DashboardResources.tsx
  Methodology and infographics modals.

- data/searchTools.ts
  Dashboard search logic.

- data/toolFilters.ts
  Available filter options.

- data/aiTools.ts
  Legacy mock data. Do not use this as the source
  of real tool classifications.

- ../../components/ai-ethics-dashboard/
  Reusable dashboard components.

- ../../api/strapi.ts
  Strapi API integration, including getAITools().

## Recommended Next Steps

1. Verify the existing API integration and pagination.
2. Test search, score filtering, and tool detail navigation.
3. Coordinate missing CMS fields with the AI Ethics module.
4. Implement category-based filtering using real CMS data.
5. Complete the bookmark functionality.
6. Replace placeholder resources and FAQ content.
7. Test responsive layouts and error handling.
8. Submit changes through a pull request.

## Development Notes

- Ethicality scores are currently displayed out of 50.
- Do not hardcode the number of available AI tools.
- Do not use legacy mock data as production data.
- Do not hardcode API credentials.
- Do not modify the production CMS schema without
  coordinating with the Infrastructure and Interface lead.
- Verify all functionality locally before deployment.

Last updated: November 2026.
