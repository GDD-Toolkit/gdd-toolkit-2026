import { useEffect, useState } from "react";
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
