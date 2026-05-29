import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mcpConfigPath = path.join(__dirname, 'mcp_config.json');
const stateFilePath = path.join(__dirname, 'monitor-state.json');

let vercelApiToken = process.env.VERCEL_API_TOKEN;
let alertWebhookUrl = process.env.ALERT_WEBHOOK_URL;

if (fs.existsSync(mcpConfigPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
    if (!vercelApiToken) {
      vercelApiToken = config.mcpServers?.['mcp-vercel']?.env?.VERCEL_API_TOKEN;
    }
    if (!alertWebhookUrl) {
      alertWebhookUrl = config.mcpServers?.['mcp-vercel']?.env?.ALERT_WEBHOOK_URL;
    }
  } catch (e) {
    console.error("Failed to read mcp_config.json:", e);
  }
}

if (!vercelApiToken) {
  console.error("VERCEL_API_TOKEN not found.");
  process.exit(1);
}

process.env.VERCEL_API_TOKEN = vercelApiToken;

const DEFAULT_PROJECT = 'testa-phaglp2';
const projectName = process.argv[2] || DEFAULT_PROJECT;

async function checkDeployment() {
  try {
    const { handleAllDeployments } = await import('../mcp-vercel/build/tools/deployments/handlers.js');
    const result = await handleAllDeployments({ projectId: projectName, limit: 1 });
    
    if (!result.content || !result.content[0]) {
      console.error("No deployments found.");
      return;
    }
    
    const deployments = JSON.parse(result.content[0].text);
    if (!deployments || deployments.length === 0) {
      console.error("No deployment entries found.");
      return;
    }
    
    const latest = deployments[0];
    const latestId = latest.uid || latest.id;
    const state = latest.state;
    
    console.log(`Latest deployment for ${projectName} is ${latestId} with state: ${state}`);
    
    // Read previous state
    let lastAlertedId = '';
    if (fs.existsSync(stateFilePath)) {
      try {
        const stateData = JSON.parse(fs.readFileSync(stateFilePath, 'utf8'));
        lastAlertedId = stateData.lastAlertedId;
      } catch (e) {
        console.error("Error reading monitor state file:", e);
      }
    }
    
    // If the state is ERROR and we haven't alerted for this ID yet
    if (state === 'ERROR') {
      if (latestId !== lastAlertedId) {
        console.warn(`\nALERT: Deployment ${latestId} has failed!`);
        
        // Retrieve full details to get inspector URL
        const { handleGetDeployment } = await import('../mcp-vercel/build/tools/deployments/handlers.js');
        const detailRes = await handleGetDeployment({ idOrUrl: latestId });
        const details = JSON.parse(detailRes.content[0].text);
        
        const alertMessage = {
          text: `🚨 *Vercel Deployment Failure Alert* 🚨\n\n*Project*: ${projectName}\n*Deployment ID*: ${latestId}\n*URL*: https://${details.url}\n*Inspector URL*: ${details.inspectorUrl}\n*Created At*: ${new Date(details.createdAt || details.created).toLocaleString()}`
        };
        
        if (alertWebhookUrl) {
          console.log(`Sending webhook alert to: ${alertWebhookUrl}`);
          await fetch(alertWebhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(alertMessage)
          });
        } else {
          console.log("No webhook URL configured. Printing alert detail to log/stdout.");
          console.log(JSON.stringify(alertMessage, null, 2));
        }
        
        // Save alert state
        fs.writeFileSync(stateFilePath, JSON.stringify({ lastAlertedId: latestId }, null, 2), 'utf8');
      } else {
        console.log(`Alert already sent for failed deployment ID ${latestId}.`);
      }
    } else {
      console.log(`Deployment status is healthy: ${state}`);
    }
  } catch (error) {
    console.error("Error during deployment monitor check:", error);
  }
}

checkDeployment();
