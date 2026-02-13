# Real Data + Actions Implementation Plan

## Context
The widget currently renders static UI from DSL or demo templates. Generated UI does not read or mutate real application data. This plan defines how to wire live data and actions without adding persistence for generated UIs.

## Goals
- Render live data in generated components using existing app APIs.
- Support real actions for forms and buttons using existing app APIs.
- Enforce capability-map-based safety so the LLM can only call known endpoints.
- Keep the widget client generic and framework-agnostic.

## Non-Goals
- Persistence of generated UI layouts.
- Arbitrary code execution or custom scripts from the LLM.
- Full workflow orchestration or multi-step transactions.

## Current State
- DSL schema supports only static data (`rows`, `fields`, `items`, `datasets`).
- Widget components render static data and prevent form submission.
- LLM server only returns DSL; it does not resolve or validate endpoint references.
- Capability map contains endpoints and entity metadata but is not used at runtime for data binding.

## Proposed Architecture
1. Extend the DSL to support data binding and action execution via capability references.
2. Validate and resolve capability references on the server before returning DSL.
3. Add a widget data client that can execute queries and actions using resolved endpoints.
4. Update widget components to fetch data and wire actions to real API calls.

## DSL Extensions
Add optional `query` or `action` metadata to relevant components.

### Query binding
- `data-table`, `list`, `detail-view`, `summary-cards`, `chart` can include `query`.
- `query` references a capability-map query by name and may include params and response mapping.

Example:
```json
{
  "type": "data-table",
  "title": "Overdue Tasks",
  "columns": [{ "key": "title", "label": "Title" }],
  "query": {
    "ref": "listTasks",
    "params": { "status": "overdue" },
    "responsePath": "items"
  }
}
```

### Action binding
- `form` and any component that exposes actions can include `action`.
- `action` references a capability-map action by name and defines payload mapping.

Example:
```json
{
  "type": "form",
  "title": "Create Task",
  "fields": [{ "name": "title", "label": "Title", "type": "text", "required": true }],
  "submitLabel": "Create",
  "action": {
    "ref": "createTask",
    "bodyFrom": "form",
    "responsePath": "task"
  }
}
```

### Schema updates
- Update `/Users/dgyk/Dev/n.codes/shared/dsl-schema.json` and `/Users/dgyk/Dev/n.codes/shared/dsl-types.js` to validate:
  - `query.ref`, `query.params`, `query.responsePath`
  - `action.ref`, `action.bodyFrom`, `action.responsePath`
- Keep fields optional so existing DSL remains valid.

## Server Changes
Update the LLM server to resolve capability references and validate them before returning DSL.

### Resolution flow
1. Parse the DSL from the LLM.
2. Validate DSL shape.
3. For each `query.ref` or `action.ref`, look it up in the capability map.
4. If missing or mismatched, return a validation error.
5. Attach a resolved endpoint to the DSL node:
   - `resolved.endpoint.method`
   - `resolved.endpoint.path`
   - `resolved.endpoint.auth` if present

### Recommended implementation
- Add a new step in `/Users/dgyk/Dev/n.codes/server/api/generate.js` after `parseDSLResponse`.
- Add a helper in `/Users/dgyk/Dev/n.codes/server/lib/` for capability lookup and DSL mutation.
- Return errors as `422` with validation details.

## Widget Changes
Add a data client and update renderers to fetch data and call actions.

### Data client
- New module in `/Users/dgyk/Dev/n.codes/widget/src/data-client.js`.
- Executes `fetch` with:
  - `credentials: 'include'`
  - `Content-Type: application/json` for non-GET
  - Query params for GET
- Returns JSON and supports `responsePath` extraction.

### Component updates
- `data-table`:
  - If `query` exists, fetch rows on render.
  - Show loading, error, and empty states.
- `detail-view`, `summary-cards`, `chart`, `list`:
  - Support `query` with response mapping into component props.
- `form`:
  - Remove the prevent-only submit behavior.
  - On submit, call `action` and show success or error feedback.
  - If `responsePath` is provided, optionally show the result in-place.

### UI state
- Add per-component state for `loading`, `error`, and `data`.
- Use small inline spinners and error callouts to avoid large UI changes.

## Capability Map Enhancements
To make data binding reliable, the capability map should include:
- Input parameters for queries and actions.
- Response shape hints for common endpoints.
- Auth or role hints when available.

This can be added in `/Users/dgyk/Dev/n.codes/cli/lib/capability-map.js` or via LLM enrichment.

## Security and RBAC
- Only allow capability references that exist in the map.
- If the capability map includes roles, enforce them on the server before returning DSL.
- The widget should never include raw URLs that are not present in the map.
- All network calls should be same-origin unless explicitly configured.

## Error Handling
- If a query or action fails, show an inline error and keep the UI usable.
- If DSL validation fails, fall back to simulation mode with a clear error message.

## Testing Plan
1. Unit tests
   - Validate new DSL fields in `/Users/dgyk/Dev/n.codes/shared/dsl-types.js`.
   - Data client request building and responsePath extraction.
2. Integration tests
   - Mock server responses in widget tests.
   - Ensure query and action refs are rejected when missing in capability map.
3. E2E tests
   - Use `express-tasks` to verify a table query and a form submission.
   - Confirm loading and error states render correctly.

## Rollout Steps
1. Extend DSL schema and validators.
2. Add server-side capability resolution and validation.
3. Add widget data client.
4. Update DSL component renderers.
5. Add tests for each layer.

