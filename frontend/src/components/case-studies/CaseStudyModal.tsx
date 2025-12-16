/**
 * CaseStudyModal - Modal component for displaying case study details
 * Reusable modal that can be opened from the case studies page
 */

import React from "react";
import type { CaseStudy } from "@/types/caseStudies";
import { s3UriToHttps } from "@/utils/s3";
import { X, MapPin, Star, Target, Key, Zap, HeartPulse, ShieldCheck, Palette, Scale, CheckCircle2, Leaf } from "lucide-react";

interface CaseStudyModalProps {
  caseStudy: CaseStudy | null;
  isOpen: boolean;
  onClose: () => void;
}

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

function extractUrl(text: string): string | null {
    const match = text.match(/https?:\/\/\S+/i);
    return match ? match[0] : null;
  }  
  
export default function CaseStudyModal({ caseStudy, isOpen, onClose }: CaseStudyModalProps) {
  if (!isOpen || !caseStudy) return null;

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
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Green Header */}
        <div className="bg-gradient-to-r from-[#A07CFF] to-[#6D83F2] text-white py-6 px-6 relative">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 text-white rounded-lg px-3 py-1.5 text-sm font-medium transition-colors flex items-center gap-1.5"
          >
            <X className="w-4 h-4" />
            Back
          </button>
          <h2 className="text-3xl font-bold text-center pr-12">{caseStudy.name}</h2>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-12rem)]">
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

            {caseStudy.lessons_learned && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Lessons Learned</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{caseStudy.lessons_learned}</p>
              </div>
            )}

            {caseStudy.summary && typeof caseStudy.summary === 'string' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Summary</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{caseStudy.summary}</p>
              </div>
            )}

            {caseStudy.issue && typeof caseStudy.issue === 'string' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Issue</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{caseStudy.issue}</p>
              </div>
            )}

            {caseStudy.introduction && typeof caseStudy.introduction === 'string' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Introduction</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{caseStudy.introduction}</p>
              </div>
            )}

            {caseStudy.goal && typeof caseStudy.goal === 'string' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Goal</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{caseStudy.goal}</p>
              </div>
            )}

            {caseStudy.findings_implications && typeof caseStudy.findings_implications === 'string' && (
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">Findings and Implications</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{caseStudy.findings_implications}</p>
              </div>
            )}

            {caseStudy.relation_sdgs_values && typeof caseStudy.relation_sdgs_values === 'string' && (
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
                                    <span className="text-[#6D83F2] mt-1">•</span>
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

            {Array.isArray(caseStudy.references) && caseStudy.references.length > 0 && (
            <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">References</h3>

                <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
                <ul className="space-y-2">
                    {caseStudy.references.map((ref, idx) => {
                    const url = extractUrl(ref);
                    const before = url ? ref.split(url)[0] : ref;
                    const after = url ? ref.split(url)[1] : "";

                    return (
                        <li
                        key={idx}
                        className="text-sm text-gray-700 leading-relaxed flex gap-2"
                        >
                        <span className="text-[#6D83F2] font-semibold">
                            [{idx + 1}]
                        </span>

                        <span>
                            {before}
                            {url && (
                            <a
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-emerald-700 underline hover:text-emerald-800 break-all"
                            >
                                {url}
                            </a>
                            )}
                            {after}
                        </span>
                        </li>
                    );
                    })}
                </ul>
                </div>
            </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


