# Module: Feature Flags (Vercel Flags + Statsig)

Leverages the Statsig SDK via Vercel Flags for experimentation, gating, and rollout control.

## Requirements

- **SDK**: `@statsig/react-bindings` for client-side evaluation.
- **Provider**: `MyStatsig` wrapper in `app/layout.tsx`.
- **Logic**: No local database schema used for flags; management is offloaded to the Statsig Console.

## Usage

- Use the `useGate("gate_name")` hook in client components.
- Secure server-side checks via `STATSIG_SERVER_API_KEY`.
- Built-in analytics with session replay and web analytics.

## Admin Integration

- Admins can view active experiments and feature gates within the `/admin/settings` dashboard.
- Real-time toggle status is fetched via Statsig's REST API to ensure the UI reflects the current production state.

## Best Practices

- **Naming Conventions**: Use `snake_case` for gate names (e.g., `enable_beta_dashboard`).
- **Fallback Values**: Always provide a sensible default value in the `useGate` hook to handle network failures or initialization delays.
- **Cleanup**: Remove feature flags from the codebase once a feature is 100% rolled out to keep the logic clean.
