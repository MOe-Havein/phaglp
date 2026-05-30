import fs from "fs"
import path from "path"
import { fileURLToPath } from "url"

// Parse command line arguments
const [, , toolName, argsString] = process.argv

if (!toolName) {
  console.log("Usage: node run-tool.mjs <tool-name> [args-json-string]")
  console.log("Available tools:")
  console.log("  vercel-list-all-deployments")
  console.log("  vercel-get-deployment")
  console.log("  vercel-list-deployment-files")
  console.log("  vercel-create-deployment")
  console.log("  vercel-create-project")
  console.log("  vercel-list-projects")
  console.log("  vercel-find-project")
  console.log("  vercel-create-environment-variables")
  console.log("  vercel-get-project-domain")
  console.log("  vercel-get-environments")
  console.log("  vercel-create-custom-environment")
  console.log("  vercel-list-all-teams")
  console.log("  vercel-create-team")
  console.log("  vercel-delete-project")
  console.log("  vercel-remove-environment-variable")
  process.exit(1)
}

// Load env variables
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const mcpConfigPath = path.join(__dirname, "mcp_config.json")
let vercelApiToken = process.env.VERCEL_API_TOKEN

if (!vercelApiToken && fs.existsSync(mcpConfigPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(mcpConfigPath, "utf8"))
    vercelApiToken = config.mcpServers?.["mcp-vercel"]?.env?.VERCEL_API_TOKEN
  } catch (e) {
    console.error("Failed to read mcp_config.json:", e)
  }
}

if (!vercelApiToken) {
  console.error("VERCEL_API_TOKEN not found in env or mcp_config.json")
  process.exit(1)
}

process.env.VERCEL_API_TOKEN = vercelApiToken

const args = argsString ? JSON.parse(argsString) : {}

async function execute() {
  try {
    let result
    switch (toolName) {
      case "vercel-list-all-deployments": {
        const { handleAllDeployments } =
          await import("../mcp-vercel/build/tools/deployments/handlers.js")
        result = await handleAllDeployments(args)
        break
      }
      case "vercel-get-deployment": {
        const { handleGetDeployment } =
          await import("../mcp-vercel/build/tools/deployments/handlers.js")
        result = await handleGetDeployment(args)
        break
      }
      case "vercel-list-deployment-files": {
        const { handleListDeploymentFiles } =
          await import("../mcp-vercel/build/tools/deployments/handlers.js")
        result = await handleListDeploymentFiles(args)
        break
      }
      case "vercel-create-deployment": {
        const { handleCreateDeployment } =
          await import("../mcp-vercel/build/tools/deployments/handlers.js")
        result = await handleCreateDeployment(args)
        break
      }
      case "vercel-create-project": {
        const { handleCreateProject } =
          await import("../mcp-vercel/build/tools/projects/handlers.js")
        result = await handleCreateProject(args)
        break
      }
      case "vercel-list-projects": {
        const { handleListProjects } =
          await import("../mcp-vercel/build/tools/projects/handlers.js")
        result = await handleListProjects(args)
        break
      }
      case "vercel-find-project": {
        const { handleFindProject } = await import("../mcp-vercel/build/tools/projects/handlers.js")
        result = await handleFindProject(args)
        break
      }
      case "vercel-create-environment-variables": {
        const { handleCreateEnvironmentVariables } =
          await import("../mcp-vercel/build/tools/projects/handlers.js")
        result = await handleCreateEnvironmentVariables(args)
        break
      }
      case "vercel-get-project-domain": {
        const { handleGetProjectDomain } =
          await import("../mcp-vercel/build/tools/projects/handlers.js")
        result = await handleGetProjectDomain(args)
        break
      }
      case "vercel-delete-project": {
        const { handleDeleteProject } =
          await import("../mcp-vercel/build/tools/projects/handlers.js")
        result = await handleDeleteProject(args)
        break
      }
      case "vercel-remove-environment-variable": {
        const { handleRemoveEnvironmentVariable } =
          await import("../mcp-vercel/build/tools/projects/handlers.js")
        result = await handleRemoveEnvironmentVariable(args)
        break
      }
      case "vercel-get-environments": {
        const { handleGetEnvironments } =
          await import("../mcp-vercel/build/tools/environments/handlers.js")
        result = await handleGetEnvironments({ params: args })
        break
      }
      case "vercel-create-custom-environment": {
        const { handleCreateCustomEnvironment } =
          await import("../mcp-vercel/build/tools/environments/handlers.js")
        result = await handleCreateCustomEnvironment(args)
        break
      }
      case "vercel-list-all-teams": {
        const { handleListTeams } = await import("../mcp-vercel/build/tools/teams/handlers.js")
        result = await handleListTeams(args)
        break
      }
      case "vercel-create-team": {
        const { handleCreateTeam } = await import("../mcp-vercel/build/tools/teams/handlers.js")
        result = await handleCreateTeam(args)
        break
      }
      default:
        console.error(`Unknown tool: ${toolName}`)
        process.exit(1)
    }

    console.log(JSON.stringify(result, null, 2))
  } catch (error) {
    console.error("Execution failed:", error)
    process.exit(1)
  }
}

execute()
