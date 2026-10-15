import { useEffect, useState } from "react";
import { getCohorts, getPodcasts, getTeams } from "../../api/strapi";

type CohortItem = {
  id?: number;
  year?: number;
  attributes?: { year?: number };
};

type PodcastItem = {
  id?: number;
  documentId: string;
  createdAt: string;
  description: string;
  publishedAt: string;
  release_date: string;
  title: string;
  updatedAt: string;
};

/**
 * Example component for students:
 * - loads data from Strapi
 * - shows loading state
 * - shows error state
 * - shows empty state
 * - renders a list when data arrives
 */
function CohortsExample() {
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

  useEffect(() => {
    // Create an async function inside useEffect.
    async function loadTeams() {
      try {
        // Ask our API helper for the data.
        const data = await getTeams();
        console.log(data);
      } catch (err: unknown) {
        console.log(err);
      }
    }

    // Run the fetch one time when the component mounts.
    loadTeams();
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

/**
 * Same example, against the Podcasts collection.
 */
function PodcastsExample() {
  // Store the list of podcasts from the API.
  const [podcasts, setPodcasts] = useState<PodcastItem[]>([]);

  // Track whether the request is still in progress.
  const [loading, setLoading] = useState(true);

  // Store any error message if the fetch fails.
  const [error, setError] = useState("");

  useEffect(() => {
    // Create an async function inside useEffect.
    async function loadPodcasts() {
      try {
        // Clear old errors before starting a new request.
        setError("");

        // Ask our API helper for the data.
        const data = await getPodcasts();
        console.log(data);

        // Save the results into component state.
        setPodcasts(data as PodcastItem[]);
      } catch (err: unknown) {
        // Save a readable error message.
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        // Stop the loading state whether success or failure.
        setLoading(false);
      }
    }

    // Run the fetch one time when the component mounts.
    loadPodcasts();
  }, []);

  // Show loading text while the request is running.
  if (loading) {
    return <p>Loading podcasts...</p>;
  }

  // Show an error message if the request failed.
  if (error) {
    return <p>Error: {error}</p>;
  }

  // Show a friendly message if no records exist yet.
  if (podcasts.length === 0) {
    return <p>No podcasts found yet.</p>;
  }

  // Render the data once it exists.
  return (
    <div>
      <h1>Strapi API example: Podcasts</h1>
      <h2>FORMAT: Title, description, created at</h2>
      <ul>
        {podcasts.map((c, idx) => {
          const key = c.id ?? `${idx}`;
          return <li key={key}>{[c?.title, ", ", c?.description, ", ", c?.createdAt]}</li>;
        })}
      </ul>
    </div>
  );
}

export default function ApiTestingExamples() {
  return (
    <div>
      <CohortsExample />
      <PodcastsExample />
    </div>
  );
}
