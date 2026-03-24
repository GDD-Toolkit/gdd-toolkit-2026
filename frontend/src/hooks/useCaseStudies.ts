/**
 * Custom hook for fetching and filtering case studies
 * Manages loading, error, and data states
 * Provides search filtering functionality
 */

import { useState, useEffect } from "react";
import { fetchProjects } from "@/api/caseStudies";
import type { CaseStudy } from "@/types/caseStudies";

export function useCaseStudies() {
  const [data, setData] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const caseStudies = await fetchProjects();
        setData(caseStudies);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load case studies";
        setError(errorMessage);
        console.error("Error fetching case studies:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  /**
   * Filters case studies based on a search query
   * Searches in: name, description, keywords, regions, values
   * @param searchQuery - The search term (case-insensitive)
   * @returns Filtered array of case studies
   */
  const filterBySearch = (searchQuery: string): CaseStudy[] => {
    if (!searchQuery.trim()) {
      return data;
    }

    const query = searchQuery.toLowerCase();

    return data.filter((study) => {
      // Search in name
      if (study.name?.toLowerCase().includes(query)) {
        return true;
      }

      // Search in description
      if (study.description?.toLowerCase().includes(query)) {
        return true;
      }

      // Search in keywords
      if (study.keywords?.some((keyword) => keyword.toLowerCase().includes(query))) {
        return true;
      }

      // Search in regions
      if (study.regions?.some((region) => region.toLowerCase().includes(query))) {
        return true;
      }

      // Search in values
      if (study.values?.some((value) => value.toLowerCase().includes(query))) {
        return true;
      }

      return false;
    });
  };

  return {
    data,
    loading,
    error,
    filterBySearch,
  };
}

