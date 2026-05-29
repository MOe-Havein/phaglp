import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const mcpConfigPath = path.join(__dirname, 'mcp_config.json');

const [,, targetDeployment, targetProject] = process.argv;

let vercelApiToken = process.env.VERCEL_API_TOKEN;

if (fs.existsSync(mcpConfigPath)) {
  try {
    const config = JSON.parse(fs.readFileSync(mcpConfigPath, 'utf8'));
    if (!vercelApiToken) {
      vercelApiToken = config.mcpServers?.['mcp-vercel']?.env?.VERCEL_API_TOKEN;
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
const projectName = targetProject || DEFAULT_PROJECT;

async function getLatestDeploymentId(projName) {
  const { handleAllDeployments } = await import('../mcp-vercel/build/tools/deployments/handlers.js');
  const result = await handleAllDeployments({ projectId: projName, limit: 1 });
  if (result.content && result.content[0]) {
    const deployments = JSON.parse(result.content[0].text);
    if (deployments && deployments.length > 0) {
      return deployments[0].uid || deployments[0].id;
    }
  }
  return null;
}

async function fetchLogs() {
  try {
    let deploymentId = targetDeployment;
    
    if (!deploymentId) {
      console.log(`No deployment ID specified. Fetching latest deployment for project "${projectName}"...`);
      deploymentId = await getLatestDeploymentId(projectName);
      if (!deploymentId) {
        console.error(`Could not find latest deployment for project ${projectName}`);
        process.exit(1);
      }
    }
    
    console.log(`Fetching logs for deployment: ${deploymentId}...`);
    
    const url = `https://api.vercel.com/v3/deployments/${deploymentId}/events`;
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${vercelApiToken}`
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to fetch logs from Vercel API. Status: ${response.status}`);
      process.exit(1);
    }
    
    const events = await response.json();
    console.log(`Retrieved ${events.length} log events.`);
    
    if (events.length === 0) {
      console.log("No log events found.");
      return;
    }
    
    // Save raw logs to file
    const logDir = path.join(__dirname, 'logs');
    if (!fs.existsSync(logDir)) {
      fs.mkdirSync(logDir);
    }
    const logFilePath = path.join(logDir, `${deploymentId}_logs.txt`);
    
    let fullTextLog = '';
    const errors = [];
    
    for (const ev of events) {
      if (!ev.text) continue;
      
      const timeString = new Date(ev.created || ev.date).toLocaleTimeString();
      const line = `[${timeString}] [${ev.type || 'stdout'}] ${ev.text}\n`;
      fullTextLog += line;
      
      // Analyze for failures/errors
      const hasError = /error|fail|exception|failed|typeerror|rejected/i.test(ev.text) || ev.type === 'stderr';
      if (hasError) {
        errors.push({
          time: timeString,
          type: ev.type || 'stdout',
          text: ev.text
        });
      }
    }
    
    fs.writeFileSync(logFilePath, fullTextLog, 'utf8');
    console.log(`Raw log file saved to: ${logFilePath}`);
    
    // Output Log Summary and Analysis
    console.log("\n==============================================");
    console.log("             LOG ANALYSIS SUMMARY             ");
    console.log("==============================================");
    console.log(`Total Log Events Analyzed:  ${events.length}`);
    console.log(`Potential Issues Detected:  ${errors.length}`);
    console.log("==============================================");
    
    if (errors.length > 0) {
      console.warn("\nDetected Errors / Warnings:");
      errors.slice(-10).forEach(err => {
        console.warn(`- [${err.time}] [${err.type.toUpperCase()}] ${err.text}`);
      });
      if (errors.length > 10) {
        console.warn(`... and ${errors.length - 10} more potential issues (check the log file for full details).`);
      }
    } else {
      console.log("\nNo major errors or stderr output detected in these logs.");
    }
    
  } catch (error) {
    console.error("Error retrieving or analyzing logs:", error);
  }
}

fetchLogs();
