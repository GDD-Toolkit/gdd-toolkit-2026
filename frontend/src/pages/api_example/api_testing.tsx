import { useEffect, useState } from "react";
import { getCohorts } from "../../api/strapi.ts";
import { getProjectPlannings} from "../../api/strapi.ts";

type CohortItem = {
  id?: number;
  year?: number;
  attributes?: { year?: number };
};

type ProjectPlanningItem = {
  id?: number;
  name?: string;
  key_words?: Array<string>;
  learning_objectives?: string;
  characteristics?: string;
  process?: string;
  benefits?: string;
  drawbacks?: string;
  example?: string;
  example_image_urls?: Array<string>;
  resources?: string;
  video_slideshow_url?: string;
  evaluation?: string;
  image_icon?: string;

};

/**
 * Example component for students:
 * - loads data from Strapi
 * - shows loading state
 * - shows error state
 * - shows empty state
 * - renders a list when data arrives
 */
export default function CohortsExample() {

  useEffect(() => {
    async function debugApi() {
      console.log(" Starting API Fetch...");
      try {
        const data = await getProjectPlannings();
        
        console.log("✅ Success! Data received:");
        console.table(data); // This creates a nice table in the console
        console.log("Full JSON structure:", data);

        if (data.length > 0) {
          console.log("First item keys:", Object.keys(data[0]));
        } else {
          console.warn("⚠️ Array is empty. Check if you have entries in Strapi.");
        }
      } catch (err) {
        console.error("❌ API Fetch Failed:", err);
      }
    }

    debugApi();
  }, []);

  // Store the list of cohorts from the API.
  const [cohorts, setCohorts] = useState<CohortItem[]>([]);

  // Track whether the request is still in progress.
  const [loading, setLoading] = useState(true);

  // Store any error message if the fetch fails.
  const [error, setError] = useState("");

  useEffect(() => {
    // Create an async function inside useEffect.
    async function loadCohorts() {
      try {
        // Clear old errors before starting a new request.
        setError("");

        // Ask our API helper for the data.
        const data = await getCohorts();
        console.log(data);
        // Save the results into component state.
        setCohorts(data as CohortItem[]);
      } catch (err: unknown) {
        // Save a readable error message.
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        // Stop the loading state whether success or failure.
        setLoading(false);
      }
    }

    // Run the fetch one time when the component mounts.
    loadCohorts();
  }, []);

  // Show loading text while the request is running.
  if (loading) {
    return <p>Loading cohorts...</p>;
  }

  // Show an error message if the request failed.
  if (error) {
    return <p>Error: {error}</p>;
  }

  // Show a friendly message if no records exist yet.
  if (cohorts.length === 0) {
    return <p>No cohorts found yet.</p>;
  }

  // Render the data once it exists.
  return (
    <div>
      <h1>Strapi API example: Cohorts</h1>
      <ul>
        {cohorts.map((c, idx) => {
          const year = c.attributes?.year ?? c.year;
          const key = c.id ?? `${idx}`;
          return <li key={key}>{year ?? "(missing year)"}</li>;
        })}
      </ul>
    </div>
  );
}

