import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const [,, command, targetProject, targetEnv] = process.argv;

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mcpConfigPath = path.join(__dirname, 'mcp_config.json');
let vercelApiToken = process.env.VERCEL_API_TOKEN;

if (!vercelApiToken && fs.existsSync(mcpConfigPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
    vercelApiToken = config.mcpServers?.['mcp-vercel']?.env?.VERCEL_API_TOKEN;
  } catch (e) {
    console.error("Failed to read mcp_config.json:", e);
  }
}

if (!vercelApiToken) {
  console.error("VERCEL_API_TOKEN not found in env or mcp_config.json");
  process.exit(1);
}

process.env.VERCEL_API_TOKEN = vercelApiToken;

const DEFAULT_PROJECT = 'testa-phaglp2';

function showHelp() {
  console.log("Vercel Deployment Automation CLI");
  console.log("===============================");
  console.log("Usage: node deploy-automation.mjs <command> [project-name/id] [environment]");
  console.log("\nCommands:");
  console.log("  deploy     - Trigger a new deployment and track its progress in real-time");
  console.log("  status     - Get the status of the latest deployment");
  console.log("  redeploy   - Trigger a redeploy of the latest deployment and track progress");
  console.log("\nEnvironments (for 'deploy' command):");
  console.log("  production (default)");
  console.log("  preview");
  console.log("  development");
  console.log("\nExamples:");
  console.log("  node deploy-automation.mjs deploy");
  console.log("  node deploy-automation.mjs redeploy portfolio");
}

if (!command || ['deploy', 'status', 'redeploy', 'help'].indexOf(command) === -1) {
  showHelp();
  process.exit(1);
}

const projectName = targetProject || DEFAULT_PROJECT;
const environment = targetEnv || 'production';

// Helper to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function getLatestDeploymentId(projName) {
  const { handleAllDeployments } = await import('../mcp-vercel/build/tools/deployments/handlers.js');
  const result = await handleAllDeployments({ projectId: projName, limit: 1 });
  if (result.content && result.content[0]) {
    const deployments = JSON.parse(result.content[0].text);
    if (deployments && deployments.length > 0) {
      return deployments[0].uid;
    }
  }
  return null;
}

async function trackDeployment(deploymentId) {
  const { handleGetDeployment } = await import('../mcp-vercel/build/tools/deployments/handlers.js');
  console.log(`\nTracking deployment ${deploymentId}...`);
  
  let previousState = '';
  
  while (true) {
    const res = await handleGetDeployment({ idOrUrl: deploymentId });
    if (!res.content || !res.content[0]) {
      console.error("Failed to retrieve deployment state.");
      break;
    }
    
    const data = JSON.parse(res.content[0].text);
    const state = data.readyState || data.state;
    
    if (state !== previousState) {
      console.log(`[${new Date().toLocaleTimeString()}] Status changed: ${state}`);
      previousState = state;
    }
    
    if (state === 'READY') {
      console.log(`\n🎉 Deployment completed successfully!`);
      console.log(`Project:      ${data.name}`);
      console.log(`URL:          https://${data.url}`);
      console.log(`Inspector:    ${data.inspectorUrl}`);
      console.log(`Environment:  ${data.target || 'production'}`);
      break;
    } else if (state === 'ERROR') {
      console.error(`\n❌ Deployment failed with status ERROR.`);
      console.error(`Inspector URL for build logs: ${data.inspectorUrl}`);
      break;
    } else if (state === 'CANCELED') {
      console.warn(`\n⚠️ Deployment was canceled.`);
      break;
    }
    
    await delay(5000);
  }
}

async function run() {
  try {
    switch (command) {
      case 'status': {
        const depId = await getLatestDeploymentId(projectName);
        if (!depId) {
          console.error(`No deployments found for project ${projectName}`);
          return;
        }
        const { handleGetDeployment } = await import('../mcp-vercel/build/tools/deployments/handlers.js');
        const res = await handleGetDeployment({ idOrUrl: depId });
        const data = JSON.parse(res.content[0].text);
        console.log("Latest Deployment Details:");
        console.log(`Project Name:   ${data.name}`);
        console.log(`Deployment ID:  ${data.id || data.uid}`);
        console.log(`URL:            https://${data.url}`);
        console.log(`State:          ${data.readyState || data.state}`);
        console.log(`Created At:     ${new Date(data.createdAt || data.created).toLocaleString()}`);
        console.log(`Inspector URL:  ${data.inspectorUrl}`);
        break;
      }
      
      case 'redeploy': {
        const latestId = await getLatestDeploymentId(projectName);
        if (!latestId) {
          console.error(`Could not find latest deployment to redeploy for project ${projectName}`);
          return;
        }
        
        console.log(`Initiating redeploy of latest deployment ID: ${latestId} for project ${projectName}...`);
        const { handleCreateDeployment } = await import('../mcp-vercel/build/tools/deployments/handlers.js');
        const res = await handleCreateDeployment({
          deploymentId: latestId,
          target: environment
        });
        
        if (res.content && res.content[1]) {
          const data = JSON.parse(res.content[1].text);
          console.log(`Deployment triggered successfully.`);
          await trackDeployment(data.id || data.uid);
        } else {
          console.error("Redeploy trigger failed:", res.content?.[0]?.text || "Unknown error");
        }
        break;
      }
      
      case 'deploy': {
        console.log(`Initiating standard deploy for project ${projectName} under environment: ${environment}...`);
        const { handleCreateDeployment } = await import('../mcp-vercel/build/tools/deployments/handlers.js');
        
        // This triggers a deploy of the project using its linked Git repository
        const res = await handleCreateDeployment({
          project: projectName,
          target: environment
        });
        
        if (res.content && res.content[1]) {
          const data = JSON.parse(res.content[1].text);
          console.log(`Deployment triggered successfully.`);
          await trackDeployment(data.id || data.uid);
        } else {
          console.error("Deploy trigger failed:", res.content?.[0]?.text || "Unknown error");
        }
        break;
      }
      
      default:
        showHelp();
    }
  } catch (error) {
    console.error("Error executing deployment command:", error);
  }
}

run();
