import { useEffect, useState } from "react";
import { getCohorts } from "../../api/strapi.ts";

type CohortItem = {
  id?: number;
  year?: number;
  attributes?: { year?: number };
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
