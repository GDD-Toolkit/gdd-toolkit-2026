import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  PAGE_SIZE_DEFAULT,
  grantQueryFromSearchParams,
  grantQueryToSearchParams,
  type GrantQuery,
  type GrantQueryInput,
} from "@shared/types/GrantsApi";

/** The dialog deep link shares the URL with the query; it is not a filter. */
const GRANT_PARAM = "grant";

/** Serialises a query without its defaults so the URL stays short. */
function toParams(query: GrantQueryInput, grantId: string | null): URLSearchParams {
  const trimmed: GrantQueryInput = { ...query };
  if (trimmed.page === 1) delete trimmed.page;
  if (trimmed.pageSize === PAGE_SIZE_DEFAULT) delete trimmed.pageSize;
  const params = grantQueryToSearchParams(trimmed);
  if (grantId) params.set(GRANT_PARAM, grantId);
  return params;
}

/**
 * Funding-page state lives in the URL: the list query (shared GrantQuery) and
 * the open grant id. Patches reset the page unless told otherwise.
 */
export function useGrantQuery() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = useMemo<GrantQuery>(() => grantQueryFromSearchParams(searchParams), [searchParams]);
  const grantId = searchParams.get(GRANT_PARAM);

  const setQuery = useCallback(
    (patch: Partial<GrantQueryInput>, options: { keepPage?: boolean } = {}) => {
      setSearchParams((current) => {
        const next: GrantQueryInput = { ...grantQueryFromSearchParams(current), ...patch };
        if (!options.keepPage) next.page = 1;
        return toParams(next, current.get(GRANT_PARAM));
      });
    },
    [setSearchParams],
  );

  const clearQuery = useCallback(() => {
    setSearchParams((current) => toParams({}, current.get(GRANT_PARAM)));
  }, [setSearchParams]);

  const setGrantId = useCallback(
    (id: string | null) => {
      setSearchParams((current) => toParams(grantQueryFromSearchParams(current), id), { replace: true });
    },
    [setSearchParams],
  );

  return { query, setQuery, clearQuery, grantId, setGrantId };
}

/** Number of active filter controls, for the "Filters (n)" button. */
export function countActiveFilters(query: GrantQuery): number {
  let count = 0;
  if (query.status) count += 1;
  if (query.geography) count += 1;
  if (query.sdg) count += 1;
  if (query.value) count += 1;
  if (query.source) count += 1;
  if (query.funding_type) count += 1;
  if (query.amount_min !== undefined || query.amount_max !== undefined) count += 1;
  if (query.deadline_before || query.deadline_after) count += 1;
  count += Object.keys(query.extras ?? {}).length;
  return count;
}
