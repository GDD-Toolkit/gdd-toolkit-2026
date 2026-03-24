/**
 * CaseStudyDetail - Page component for displaying a single case study
 * Shows full details of a case study based on the ID from the URL
 */

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { fetchWorthwhile, fetchMaldevelopment } from "@/api/caseStudies";
import type { CaseStudy } from "@/types/caseStudies";
import { s3UriToHttps } from "@/utils/s3";
import { X, MapPin, Star, Target, Key, Zap, HeartPulse, ShieldCheck, Palette, Scale, CheckCircle2, Leaf } from "lucide-react";
import React from "react";

// Helper component for info sections
function InfoSection({ 
  icon, 
  title, 
  items 
}: { 
  icon: React.ReactNode; 
  title: string; 
  items: string[] 
}) {
  if (!items || items.length === 0) return null;
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
      </div>
      <div className="space-y-1">
        {items.map((item, idx) => (
          <p key={idx} className="text-sm text-gray-700">{item}</p>
        ))}
      </div>
    </div>
  );
}

export default function CaseStudyDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [caseStudy, setCaseStudy] = useState<CaseStudy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCaseStudy() {
      if (!id) {
        setError("No case study ID provided");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        // Fetch from both sources to find the case study
        const [worthwhile, maldevelopment] = await Promise.all([
          fetchWorthwhile().catch(() => []),
          fetchMaldevelopment().catch(() => []),
        ]);

        const allCaseStudies = [...worthwhile, ...maldevelopment];
        const found = allCaseStudies.find((cs) => cs.id === id);

        if (found) {
          setCaseStudy(found);
        } else {
          setError("Case study not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load case study");
      } finally {
        setLoading(false);
      }
    }

    loadCaseStudy();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-sky-600"></div>
          <p className="mt-4 text-gray-600">Loading case study...</p>
        </div>
      </div>
    );
  }

  if (error || !caseStudy) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || "Case study not found"}</p>
          <button
            onClick={() => navigate("/case-studies")}
            className="px-4 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
          >
            Back to Case Studies
          </button>
        </div>
      </div>
    );
  }

  // Convert S3 URI to HTTPS URL if needed
  const rawImage = caseStudy.image;
  const hasValidImage = rawImage && typeof rawImage === 'string' && rawImage.trim().length > 0;
  const imgUrl = hasValidImage ? (s3UriToHttps(rawImage) || rawImage) : null;

  // Score color mapping
  const getScoreColor = (score: string) => {
    switch (score.toUpperCase()) {
      case 'A': return 'bg-green-100 text-green-800 border-green-300';
      case 'B': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'C': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'F': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Get icon for each value type
  const getIcon = (key: string) => {
    const iconClass = "w-5 h-5";
    switch (key.toLowerCase()) {
      case 'empowerment': return <Zap className={`${iconClass} text-yellow-500`} />;
      case 'well-being': case 'wellbeing': return <HeartPulse className={`${iconClass} text-red-500`} />;
      case 'responsibility': return <CheckCircle2 className={`${iconClass} text-blue-500`} />;
      case 'human rights': case 'human_rights': return <ShieldCheck className={`${iconClass} text-indigo-500`} />;
      case 'cultural freedom': case 'cultural_freedom': return <Palette className={`${iconClass} text-purple-500`} />;
      case 'equality': return <Scale className={`${iconClass} text-teal-500`} />;
      case 'sustainability': return <Leaf className={`${iconClass} text-green-500`} />;
      default: return <Star className={`${iconClass} text-gray-500`} />;
    }
  };

  // Format key name (capitalize and add spaces)
  const formatKey = (k: string) => {
    return k
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Green Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white py-6 px-6 relative">
        <button
          onClick={() => navigate("/case-studies")}
          className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white rounded-lg px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5"
        >
          <X className="w-4 h-4" />
          Back
        </button>
        <h2 className="text-3xl font-bold text-center pr-12">{caseStudy.name}</h2>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="overflow-y-auto">
          {/* Main Image */}
          <div className="w-full bg-gray-100">
            {imgUrl ? (
              <img
                src={imgUrl}
                alt={caseStudy.name}
                className="w-full h-80 object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-80 bg-gradient-to-br from-sky-400 to-sky-600 flex items-center justify-center">
                <div className="text-white text-6xl font-bold">
                  {caseStudy.name
                    ?.split(" ")
                    .map((w) => w[0])
                    .join("")
                    .slice(0, 3)
                    .toUpperCase() || "CS"}
                </div>
              </div>
            )}
          </div>

          {/* Info Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 bg-gray-50 border-b">
            {Array.isArray(caseStudy.regions) && caseStudy.regions.length > 0 && (
              <InfoSection
                icon={<MapPin className="w-5 h-5 text-emerald-600" />}
                title="Region"
                items={caseStudy.regions as string[]}
              />
            )}
            {Array.isArray(caseStudy.values) && caseStudy.values.length > 0 && (
              <InfoSection
                icon={<Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                title="Values of Worthwhile Development"
                items={caseStudy.values as string[]}
              />
            )}
            {Array.isArray(caseStudy.sdgs) && caseStudy.sdgs.length > 0 && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-5 h-5 text-red-500" />
                  <h3 className="font-semibold text-gray-900 text-sm">Sustainable Development Goals</h3>
                </div>
                <div className="space-y-1">
                  {(caseStudy.sdgs as (string | number)[]).map((sdg, idx) => (
                    <p key={idx} className="text-sm text-gray-700">SDG {sdg}</p>
                  ))}
                </div>
              </div>
            )}
            {Array.isArray(caseStudy.keywords) && caseStudy.keywords.length > 0 && (
              <InfoSection
                icon={<Key className="w-5 h-5 text-yellow-500" />}
                title="Keywords"
                items={caseStudy.keywords as string[]}
              />
            )}
          </div>

          {/* Description and Lessons Learned */}
          <div className="p-6 space-y-6">
            {caseStudy.description && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Description</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{caseStudy.description}</p>
              </div>
            )}

            {caseStudy.summary && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Summary</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{caseStudy.summary}</p>
              </div>
            )}

            {caseStudy.lessons_learned && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Lessons Learned</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{caseStudy.lessons_learned}</p>
              </div>
            )}

            {/* {caseStudy.relation_sdgs_values && (() => {
              const relationText = caseStudy.relation_sdgs_values;
              if (!relationText || typeof relationText !== 'string') return null as React.ReactNode;
              return (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">Relation to SDGs & Values</h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{relationText}</p>
                </div>
              ) as React.ReactNode;
            })()} */}

            {caseStudy.relation_sdgs_values && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Relation to SDGs and Values</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{caseStudy.relation_sdgs_values}</p>
              </div>
            )}

            {caseStudy.evaluation && typeof caseStudy.evaluation === 'object' && (() => {
              const entries = Object.entries(caseStudy.evaluation as Record<string, any>)
                .filter(([_, value]) => value && typeof value === 'object')
                .map(([key, value]) => ({ key, value }));
              
              const totalEntries = entries.length;
              const lastEntry = entries[totalEntries - 1];
              const isLastSustainability = lastEntry && lastEntry.key.toLowerCase() === 'sustainability';
              const shouldCenterLast = isLastSustainability && totalEntries % 2 === 1;

              return (
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Evaluation</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {entries.map(({ key, value }, index) => {
                      const evaluationItem = value as { summary?: string; score?: string; indicators_checked?: string[] };
                      const score = evaluationItem.score || 'N/A';
                      const summary = evaluationItem.summary || '';
                      const indicators = Array.isArray(evaluationItem.indicators_checked) ? evaluationItem.indicators_checked : [];
                      const isLast = index === entries.length - 1;
                      const shouldCenter = shouldCenterLast && isLast;

                      return (
                        <div
                          key={key}
                          className={`bg-white border border-gray-200 rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow ${
                            shouldCenter ? 'md:col-span-2 md:max-w-2xl md:mx-auto' : ''
                          }`}
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                              {getIcon(key)}
                              <h4 className="text-lg font-semibold text-gray-900">
                                {formatKey(key)}
                              </h4>
                            </div>
                            <span
                              className={`px-3 py-1 rounded-full text-sm font-bold border ${getScoreColor(score)}`}
                            >
                              {score}
                            </span>
                          </div>
                          
                          {summary && (
                            <p className="text-sm text-gray-700 mb-3 leading-relaxed">
                              {summary}
                            </p>
                          )}
                          
                          {indicators.length > 0 && (
                            <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs font-semibold text-gray-600 mb-2 uppercase tracking-wide">
                                Indicators Checked:
                              </p>
                              <ul className="space-y-1.5">
                                {indicators.map((indicator, idx) => (
                                  <li key={idx} className="text-xs text-gray-600 flex items-start gap-2">
                                    <span className="text-emerald-600 mt-1">•</span>
                                    <span>{indicator}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}

            {caseStudy.evaluation && typeof caseStudy.evaluation === 'string' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Evaluation</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{caseStudy.evaluation}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


