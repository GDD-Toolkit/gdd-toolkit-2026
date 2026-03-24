import { createBrowserRouter } from "react-router-dom";
import { lazy } from "react";
import RootLayout from "@/app/layout/RootLayout";

const HomePage = lazy(() => import("@/pages/home"));
const AboutPage = lazy(() => import("@/pages/about/About"));
const WorthwhileDevelopmentPage = lazy(() => import("@/pages/worthwhile-development/WorthwhileDevelopment"));
const CapabilityApproachPage = lazy(() => import("@/pages/capability-approach/CapabilityApproach"));
const DevelopmentEthics = lazy(() => import("@/pages/development-ethics/DevelopmentEthics"));
const EthicsOfInnovation = lazy(() => import ("@/pages/tools/ethics-of-innovation/EthicsOfInnovation"));
const DesignUser = lazy(() => import("@/pages/tools/ethics-of-innovation/DesignUser"));
const ExistingEcosystems = lazy(() => import("@/pages/tools/ethics-of-innovation/ExistingEcosystems"));
const Scale = lazy(() => import("@/pages/tools/ethics-of-innovation/Scale"));
const Sustainability = lazy(() => import("@/pages/tools/ethics-of-innovation/Sustainability"));
const DataDriven = lazy(() => import("@/pages/tools/ethics-of-innovation/DataDriven"));
const OpenStandards = lazy(() => import("@/pages/tools/ethics-of-innovation/OpenStandards"));
const ReuseImprove = lazy(() => import("@/pages/tools/ethics-of-innovation/ReuseImprove"));
const AddressSecurity = lazy(() => import("@/pages/tools/ethics-of-innovation/AddressSecurity"));
const Collaborative = lazy(() => import("@/pages/tools/ethics-of-innovation/Collaborative"));
const HumanCenteredDesign = lazy(() => import("@/pages/tools-remaining/HumanCenteredDesign"));
const ProjectPlanning = lazy(() => import("@/pages/project-planning/ProjectPlanning"));
const ProjectEvaluation = lazy(() => import("@/pages/tools/ProjectEvaluation"));
const CaseStudies = lazy(() => import ("@/pages/case-studies/CaseStudies"));
const CaseStudyDetail = lazy(() => import("@/pages/case-studies/CaseStudyDetail"));
const FundingSources = lazy(() => import ("@/pages/resources/FundingSources"));
const Podcast = lazy(() => import ("@/pages/resources/Podcast"));
const Acknowledgements = lazy(() => import ("@/pages/resources/Acknowledgements"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "about", element: <AboutPage /> },
      { path: "development-ethics", element: <DevelopmentEthics /> },
      { path: "worthwhile-development", element: <WorthwhileDevelopmentPage /> },
      { path: "capability-approach", element: <CapabilityApproachPage />},
      { path: "ethics-of-innovation", element: <EthicsOfInnovation />},
      { path: "ethics-of-innovation/user", element: <DesignUser />},
      { path: "ethics-of-innovation/ecosystem", element: <ExistingEcosystems />},
      { path: "ethics-of-innovation/scale", element: <Scale />},
      { path: "ethics-of-innovation/sustainability", element: <Sustainability />},
      { path: "ethics-of-innovation/data", element: <DataDriven />},
      { path: "ethics-of-innovation/standards", element: <OpenStandards />},
      { path: "ethics-of-innovation/reuse", element: <ReuseImprove />},
      { path: "ethics-of-innovation/privacy", element: <AddressSecurity />},
      { path: "ethics-of-innovation/collaboration", element: <Collaborative />},
      { path: "human-centered-design", element: <HumanCenteredDesign />},
      { path: "project-planning", element: <ProjectPlanning />},
      { path: "project-evaluation", element: <ProjectEvaluation />},
      { path: "case-studies", element: <CaseStudies />},
      { path: "case-studies/:id", element: <CaseStudyDetail />},
      { path: "funding-sources", element: <FundingSources />},
      { path: "podcast", element: <Podcast />},
      { path: "acknowledgements", element: <Acknowledgements />},
    ],
  },
]);

export default router;