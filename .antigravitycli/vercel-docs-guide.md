# Vercel API & Configuration Reference Guide
---

This guide contains curated reference schemas, REST API endpoints, and configuration parameters for Vercel. It enables developer assistants and AI agents to instantly resolve configuration issues, reference endpoint specifications, and construct valid Vercel payloads.

---

## 1. Vercel Configuration (`vercel.json`)
The `vercel.json` file is a configuration manifest placed in the root of your project to customize deployment behavior.

### Essential Configuration Schema
```json
{
  "version": 2,
  "public": false,
  "cleanUrls": true,
  "trailingSlash": false,
  "framework": "nextjs",
  "regions": ["iad1", "sfo1"],
  "redirects": [
    {
      "source": "/old-path",
      "destination": "/new-path",
      "statusCode": 308
    }
  ],
  "rewrites": [
    {
      "source": "/api/v1/:path*",
      "destination": "https://api.external-service.com/:path*"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ]
}
```

### Key Parameters Definition
*   **`cleanUrls`**: (boolean) When true, automatically strips `.html` from paths and redirects.
*   **`trailingSlash`**: (boolean) Enforces or removes trailing slashes from URLs.
*   **`redirects`**: (array) Configures HTTP redirects with status codes (`301`, `302`, `307`, `308`).
*   **`rewrites`**: (array) Route masking or proxying to external endpoints without changing the URL.
*   **`headers`**: (array) Custom HTTP response headers for specific routing paths.

---

## 2. Vercel REST API Specifications
All requests require authentication via the Authorization header:
`Authorization: Bearer <VERCEL_API_TOKEN>`

### Deployments API
*   **Create a Deployment**
    *   **Method / Path**: `POST https://api.vercel.com/v13/deployments`
    *   **Payload Example**:
        ```json
        {
          "name": "my-project",
          "project": "prj_Sqsvp...",
          "target": "production",
          "gitSource": {
            "type": "github",
            "repoId": 1253537088,
            "ref": "main"
          }
        }
        ```
*   **List Deployments**
    *   **Method / Path**: `GET https://api.vercel.com/v6/deployments?projectId=<id>&limit=20`
*   **Get Deployment Details**
    *   **Method / Path**: `GET https://api.vercel.com/v13/deployments/<idOrUrl>`
*   **Retrieve Deployment Logs (SSE)**
    *   **Method / Path**: `GET https://api.vercel.com/v1/projects/<projectId>/deployments/<deploymentId>/runtime-logs`

### Projects API
*   **List Projects**
    *   **Method / Path**: `GET https://api.vercel.com/v9/projects`
*   **Create a Project**
    *   **Method / Path**: `POST https://api.vercel.com/v9/projects`
*   **Delete a Project**
    *   **Method / Path**: `DELETE https://api.vercel.com/v9/projects/<projectId>`
*   **Add Environment Variables**
    *   **Method / Path**: `POST https://api.vercel.com/v10/projects/<projectId>/env`
    *   **Payload**:
        ```json
        {
          "key": "DATABASE_URL",
          "value": "postgresql://...",
          "type": "secret",
          "target": ["production", "preview"]
        }
        ```

---

## 3. Vercel System Environment Variables
These environment variables are populated automatically by Vercel inside Serverless and Edge Functions:

| Variable Name | Description | Example Value |
| :--- | :--- | :--- |
| `VERCEL` | Indicates the code is running on Vercel | `1` |
| `VERCEL_ENV` | Target environment of the deployment | `production`, `preview`, `development` |
| `VERCEL_URL` | The domain name of the deployment | `project-git-branch-team.vercel.app` |
| `VERCEL_REGION` | The Vercel region code that handled the request | `iad1` (Washington, D.C.) |
| `VERCEL_GIT_COMMIT_REF` | The git branch that was deployed | `main` |
| `VERCEL_GIT_COMMIT_SHA` | The git commit hash of the build | `1f31538fc12...` |

---

## 4. Live Documentation Search Tips for AI Assistants
When performing search operations via standard web search engines (`search_web`), structure queries with strict parameters to prioritize Vercel's official documentation indexes.

### Query Patterns

1.  **Search `vercel.json` Configurations**:
    ```text
    "site:vercel.com/docs vercel.json configuration headers"
    "site:vercel.com/docs redirects rewrites syntax"
    ```

2.  **Search REST API Specifications**:
    ```text
    "site:vercel.com/docs/rest-api deployments endpoint parameters"
    "site:vercel.com/docs/rest-api project environment variables POST"
    ```

3.  **Search Performance & Caching Guides**:
    ```text
    "site:vercel.com/docs edge caching headers stale-while-revalidate"
    "site:vercel.com/docs serverless function execution limits timeout"
    ```
