# Recorded fixtures

Responses recorded from the live APIs on 2026-11-05. The adapter tests replay
them, so they are also the record of what each API returned when the adapter
was verified.

## grants-gov/

- `search-facets.json`: `search2` with `{"rows":1,"oppStatuses":"posted|forecasted"}` (the agency facet).
- `search-agencies.json`: `search2` filtered by a few Southeast Asia mission codes.
- `search-categories.json`: `search2` filtered by the gate-1 categories, `rows: 2`.
- `detail-<id>.json`: `fetchOpportunity` for that id. 364047 is a posted opportunity,
  347707 and 355824 are stale forecasts, 363872 is a current forecast, 363786 has
  the placeholder closing date 2099-01-01.
- `detail-not-found.json`: `fetchOpportunity` for an id that does not exist.

Edited after recording: the per-response `token` is removed, officials' contact
fields are replaced with `"redacted"`, and attachment and history lists the
adapter never reads are dropped.

## eu-ft/

- `search-page.json`: one page assembled from recorded search results: current
  topics (single-stage, two-stage, fellowship, forthcoming, CERV, NDICI), two
  legacy records with past deadlines, and two external-action calls.

Edited after recording: bulky metadata the adapter never reads (`topicConditions`,
`sepTemplate`, `supportInfo`, `links`, `latestInfos`, tag-id lists) is dropped
and `totalResults` is set to the number of results kept.
