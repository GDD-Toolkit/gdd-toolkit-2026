import { useEffect, useState } from "react";
import { getCohorts, getCohorts2 } from "../../api/strapi";
import { getTeams } from "../../api/strapi.ts";

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

        getCohorts2().then((data) => {
          console.log("COHORTS2:", data);
        });

        // Save the results into component state.
        setCohorts(data as CohortItem[]);
      } catch (err: unknown) {
        // Save a readable error message.
        setError(err instanceof Error ? err.message : "Something went wrong.");
      } finally {
        // Stop the loading state whether success or failure.
        setLoading(false);
    useEffect(() => {
      // Create an async function inside useEffect.
      async function loadCohorts() {
        try {
          // Clear old errors before starting a new request.

          // Ask our API helper for the data.
          const data = await getTeams();
          console.log(data);
          // Save the results into component state.
        } catch (err: unknown) {
        console.log(err)
        }
      }

      // Run the fetch one time when the component mounts.
      loadCohorts();
    }, []);

  return(
    <></>
  )
}
