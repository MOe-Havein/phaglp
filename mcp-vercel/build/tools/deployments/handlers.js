import { vercelFetch } from "../../utils/api.js";
import {
  ListDeploymentsArgumentsSchema,
  GetDeploymentArgumentsSchema,
  CreateDeploymentArgumentsSchema,
  ListDeploymentFilesArgumentsSchema,
} from "./schema.js";
export async function handleGetDeployment(params = {}) {
  try {
    const { idOrUrl, teamId } = GetDeploymentArgumentsSchema.parse(params);
    let url = `v13/deployments/${encodeURIComponent(idOrUrl)}`;
    if (teamId) url += `?teamId=${teamId}`;
    const data = await vercelFetch(url);
    if (!data) {
      return {
        content: [{ type: "text", text: "Failed to retrieve deployment" }],
      };
    }
    return {
      content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error}` }],
    };
  }
}
/**
 * Creates a new deployment
 * @param params The parameters for creating a deployment
 * @returns Deployment details
 */
/**
 * Create a new Vercel deployment using the v13/deployments API
 * @param params The parameters for creating a deployment
 * @returns The details of the created deployment
 */
export async function handleCreateDeployment(params = {}) {
  try {
    // Log the received parameters for debugging (noted in the server logs)
    console.error("Received deployment params:", JSON.stringify(params));
    // Validation and cleaning of parameters
    const validatedParams = CreateDeploymentArgumentsSchema.parse(params);
    console.error("Validated params:", JSON.stringify(validatedParams));
    // Extraction of URL parameters (teamId is a URL parameter, not a body parameter)
    let endpoint = "v13/deployments";
    const queryParams = new URLSearchParams();
    // Handling of the teamId parameter
    if (validatedParams.teamId) {
      queryParams.append("teamId", validatedParams.teamId);
      // Remove teamId from the body request
      delete validatedParams.teamId;
    }
    // Construction of the URL with parameters
    if (queryParams.toString()) {
      endpoint += `?${queryParams.toString()}`;
    }
    // Preparation of the body request by removing undefined/null values
    const deploymentData = {};
    Object.entries(validatedParams).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        deploymentData[key] = value;
      }
    });
    // Make the API request
    const data = await vercelFetch(endpoint, {
      method: "POST",
      body: JSON.stringify(deploymentData),
    });
    if (!data) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to create deployment",
            isError: true,
          },
        ],
      };
    }
    // Return successful deployment response
    return {
      content: [
        {
          type: "text",
          text: `Deployment created successfully: ${data.url}`,
        },
        {
          type: "text",
          text: JSON.stringify(data, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error creating deployment: ${error instanceof Error ? error.message : String(error)}`,
          isError: true,
        },
      ],
    };
  }
}
export async function handleAllDeployments(params = {}) {
  try {
    const { app, projectId, state, target, teamId, limit } =
      ListDeploymentsArgumentsSchema.parse(params);
    let url = limit
      ? `v6/deployments?limit=${limit}`
      : "v6/deployments?limit=50";
    if (app) url += `&app=${app}`;
    if (projectId) url += `&projectId=${projectId}`;
    if (state) url += `&state=${state}`;
    if (target) url += `&target=${target}`;
    if (teamId) url += `&teamId=${teamId}`;
    const data = await vercelFetch(url);
    if (!data) {
      return {
        content: [{ type: "text", text: "Failed to retrieve deployments" }],
      };
    }
    return {
      content: [
        { type: "text", text: JSON.stringify(data.deployments, null, 2) },
      ],
    };
  } catch (error) {
    return {
      content: [{ type: "text", text: `Error: ${error}` }],
    };
  }
}
/**
 * List all files of a deployment
 * @param params Parameters including deployment ID and optional team identifier
 * @returns List of files in the deployment
 */
export async function handleListDeploymentFiles(params = {}) {
  try {
    const { id, teamId, slug } =
      ListDeploymentFilesArgumentsSchema.parse(params);
    // Build the URL with optional query parameters
    let url = `v6/deployments/${encodeURIComponent(id)}/files`;
    const queryParams = new URLSearchParams();
    if (teamId) queryParams.append("teamId", teamId);
    if (slug) queryParams.append("slug", slug);
    if (queryParams.toString()) {
      url += `?${queryParams.toString()}`;
    }
    const data = await vercelFetch(url);
    if (!data || !data.files) {
      return {
        content: [
          {
            type: "text",
            text: "Failed to retrieve deployment files or no files found",
            isError: true,
          },
        ],
      };
    }
    // Return the files with formatting to make them easier to read
    return {
      content: [
        {
          type: "text",
          text: `Found ${data.files.length} files in deployment ${id}`,
        },
        {
          type: "text",
          text: JSON.stringify(data.files, null, 2),
        },
      ],
    };
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error listing deployment files: ${error instanceof Error ? error.message : String(error)}`,
          isError: true,
        },
      ],
    };
  }
}
