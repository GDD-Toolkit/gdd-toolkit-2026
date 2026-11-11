import { useEffect, useState } from "react";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";

import { getAITools } from "../../../api/strapi";

type EthicalConsideration = {
  viability?: number;
  bias_mitigation_score?: number;
  transparency_score?: number;
  control_oversight_score?: number;
  privacy_data_ethics_score?: number;
  localization_accessibility_score?: number;
  evidence_of_impact_score?: number;
  low_tech_compativility_score?: number;
  ethical_failsafes_score?: number;
  accountability_responsability_score?: number;
  documentation_support_score?: number;

  integration_description?: string;
  offline_capabilties_description?: string;
  sustainability_description?: string;
  bias_migration_description?: string;
  transparency_description?: string;
  control_oversight_description?: string;
  privacy_data_ethics_description?: string;
  localization_accessibility_description?: string;
  evidence_of_impact_description?: string;
  low_tech_compatbability_description?: string;
  ethical_failsafes_description?: string;
  accountability_responsability_description?: string;
  documentation_support_description?: string;
};

type StrapiAITool = {
  id: number;
  documentId?: string;
  name: string;
  about_section?: string;
  total_score: number;
  price?: {
    url?: string;
  };
  logo?: Array<{
    url: string;
    formats?: {
      thumbnail?: { url: string };
      small?: { url: string };
    };
  }>;
  ethical_consideration?: EthicalConsideration[];
};

const considerationFields: {
  label: string;
  scoreKey: keyof EthicalConsideration;
  descriptionKey: keyof EthicalConsideration;
}[] = [
  {
    label: "Viability",
    scoreKey: "viability",
    descriptionKey: "sustainability_description",
  },
  {
    label: "Bias Mitigation",
    scoreKey: "bias_mitigation_score",
    descriptionKey: "bias_migration_description",
  },
  {
    label: "Transparency",
    scoreKey: "transparency_score",
    descriptionKey: "transparency_description",
  },
  {
    label: "Control & Oversight",
    scoreKey: "control_oversight_score",
    descriptionKey: "control_oversight_description",
  },
  {
    label: "Privacy & Data Ethics",
    scoreKey: "privacy_data_ethics_score",
    descriptionKey: "privacy_data_ethics_description",
  },
  {
    label: "Localization & Accessibility",
    scoreKey: "localization_accessibility_score",
    descriptionKey: "localization_accessibility_description",
  },
  {
    label: "Evidence of Impact",
    scoreKey: "evidence_of_impact_score",
    descriptionKey: "evidence_of_impact_description",
  },
  {
    label: "Low-tech Compatibility",
    scoreKey: "low_tech_compativility_score",
    descriptionKey: "low_tech_compatbability_description",
  },
  {
    label: "Ethical Failsafes",
    scoreKey: "ethical_failsafes_score",
    descriptionKey: "ethical_failsafes_description",
  },
  {
    label: "Accountability & Responsibility",
    scoreKey: "accountability_responsability_score",
    descriptionKey: "accountability_responsability_description",
  },
  {
    label: "Documentation & Support",
    scoreKey: "documentation_support_score",
    descriptionKey: "documentation_support_description",
  },
];

export default function AIEthicsTool() {
  const [searchParams] = useSearchParams();
  const toolName = searchParams.get("name");

  const [tools, setTools] = useState<StrapiAITool[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchTools() {
      try {
        setLoading(true);
        setError("");

        const data = await getAITools();
        setTools(data as StrapiAITool[]);
      } catch (err) {
        console.error("Failed to fetch AI tools:", err);
        setError("Unable to load AI tool information. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchTools();
  }, []);

  const tool = tools.find((item) => item.name === toolName);

  if (loading) {
    return (
      <main className="min-h-screen bg-white text-black px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/ai-ethics-dashboard/tools"
            className="inline-flex items-center gap-2 text-lg"
          >
            <ArrowLeft size={20} />
            Back
          </Link>
          <p className="mt-16 text-center text-gray-600">
            Loading tool information...
          </p>
        </div>
      </main>
    );
  }

  if (error || !tool) {
    return (
      <main className="min-h-screen bg-white text-black px-6 py-8">
        <div className="max-w-7xl mx-auto">
          <Link
            to="/ai-ethics-dashboard/tools"
            className="inline-flex items-center gap-2 text-lg"
          >
            <ArrowLeft size={20} />
            Back
          </Link>

          <div className="mt-16 text-center">
            <h1 className="text-3xl font-normal">
              {error ? "Unable to Load Tool" : "Tool Not Found"}
            </h1>
            <p className="mt-4 text-gray-600">
              {error || "The selected AI tool could not be found."}
            </p>
          </div>
        </div>
      </main>
    );
  }

  const logoUrl = tool.logo?.[0]?.formats?.small?.url || tool.logo?.[0]?.url;

  const considerations = tool.ethical_consideration ?? [];

  const availableConsiderations = considerations.flatMap((item) =>
    considerationFields
      .filter((field) => typeof item[field.scoreKey] === "number")
      .map((field) => ({
        label: field.label,
        score: item[field.scoreKey] as number,
        description: item[field.descriptionKey] as string | undefined,
      })),
  );

  return (
    <main className="min-h-screen bg-white text-black px-6 py-8">
      <div className="max-w-7xl mx-auto">
        {/* Back */}
        <Link
          to="/ai-ethics-dashboard/tools"
          className="inline-flex items-center gap-2 text-lg"
        >
          <ArrowLeft size={20} />
          Back
        </Link>

        {/* Tool Header */}
        <div className="mt-10 text-center">
          <div className="mx-auto w-28 h-28 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${tool.name} logo`}
                className="w-full h-full object-contain"
              />
            ) : (
              <span className="text-gray-500">Logo</span>
            )}
          </div>

          <h1 className="mt-6 text-4xl font-normal">{tool.name}</h1>

          {/* Ethicality Score */}
          <div className="mt-6">
            <p className="text-lg">Ethicality Score</p>
            <p className="text-4xl font-semibold mt-1">{tool.total_score}/50</p>
          </div>

          {/* Pricing Link */}
          {tool.price?.url && (
            <a
              href={tool.price.url}
              target="_blank"
              rel="noreferrer"
              className="mt-5 border border-black rounded-md px-7 py-2 inline-flex items-center gap-2 mx-auto"
            >
              View Pricing
              <ExternalLink size={18} />
            </a>
          )}
        </div>

        {/* Description */}
        <section className="mt-12">
          <h2 className="text-2xl font-medium">Description</h2>

          <div className="mt-4 bg-gray-200 rounded-md p-6 min-h-32">
            <p className="text-gray-700 whitespace-pre-line">
              {tool.about_section || "No description available."}
            </p>
          </div>
        </section>

        {/* Tool Information */}
        <section className="mt-12">
          <h2 className="text-2xl font-medium">Tool Information</h2>

          <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-gray-200 rounded-md p-6">
              <h3 className="text-lg font-medium">Ethicality Score</h3>
              <p className="mt-2 text-gray-700">{tool.total_score}/50</p>
            </div>

            <div className="bg-gray-200 rounded-md p-6">
              <h3 className="text-lg font-medium">Pricing Information</h3>
              {tool.price?.url ? (
                <a
                  href={tool.price.url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 inline-flex items-center gap-2 text-blue-700 underline"
                >
                  View Pricing
                  <ExternalLink size={16} />
                </a>
              ) : (
                <p className="mt-2 text-gray-700">
                  No pricing information available.
                </p>
              )}
            </div>
          </div>
        </section>

        {/* Ethical Considerations */}
        <section className="mt-12">
          <h2 className="text-2xl font-medium">Ethical Considerations</h2>

          {availableConsiderations.length > 0 ? (
            <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {availableConsiderations.map((item) => (
                <div
                  key={item.label}
                  className="bg-gray-200 rounded-md p-6 min-h-36"
                >
                  <h3 className="text-lg font-medium">{item.label}</h3>

                  <p className="mt-3 text-2xl font-semibold">{item.score}</p>

                  {item.description && (
                    <p className="mt-3 text-sm text-gray-700 whitespace-pre-line">
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="mt-5 text-gray-600">
              No ethical consideration data available.
            </p>
          )}
        </section>

        {/* Additional Consideration Details */}
        {considerations.some(
          (item) =>
            item.integration_description ||
            item.offline_capabilties_description ||
            item.sustainability_description,
        ) && (
          <section className="mt-12">
            <h2 className="text-2xl font-medium">Additional Information</h2>

            <div className="mt-5 space-y-5">
              {considerations.map((item, index) => (
                <div key={index} className="space-y-5">
                  {[
                    {
                      label: "Integration",
                      description: item.integration_description,
                    },
                    {
                      label: "Offline Capabilities",
                      description: item.offline_capabilties_description,
                    },
                    {
                      label: "Sustainability",
                      description: item.sustainability_description,
                    },
                  ]
                    .filter((detail) => detail.description)
                    .map((detail) => (
                      <div
                        key={detail.label}
                        className="bg-gray-200 rounded-md p-6"
                      >
                        <h3 className="text-lg font-medium">{detail.label}</h3>
                        <p className="mt-2 text-gray-700 whitespace-pre-line">
                          {detail.description}
                        </p>
                      </div>
                    ))}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Overall Assessment */}
        <section className="mt-12 mb-16">
          <h2 className="text-2xl font-medium">Overall Assessment</h2>

          <div className="mt-5 bg-gray-200 rounded-md p-8">
            <p className="text-lg text-gray-700">
              {tool.name} received an overall Ethicality Score of{" "}
              <strong>{tool.total_score}/50</strong> based on its ethical
              evaluation. The individual criteria above provide more detail
              about its evaluation.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
