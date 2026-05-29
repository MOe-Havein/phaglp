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

async function getLatestDeployment(projName) {
  const { handleAllDeployments } = await import('../mcp-vercel/build/tools/deployments/handlers.js');
  const result = await handleAllDeployments({ projectId: projName, limit: 1 });
  if (result.content && result.content[0]) {
    const deployments = JSON.parse(result.content[0].text);
    if (deployments && deployments.length > 0) {
      return deployments[0];
    }
  }
  return null;
}

async function streamRuntimeLogs() {
  try {
    let deploymentId = targetDeployment;
    let projectId = '';
    
    if (!deploymentId) {
      console.log(`No deployment ID specified. Fetching latest deployment info for project "${projectName}"...`);
      const latest = await getLatestDeployment(projectName);
      if (!latest) {
        console.error(`Could not find latest deployment for project ${projectName}`);
        process.exit(1);
      }
      deploymentId = latest.uid || latest.id;
      projectId = latest.projectId;
    }
    
    if (!projectId) {
      // If we don't have projectId, retrieve it from projects list
      const { handleListProjects } = await import('../mcp-vercel/build/tools/projects/handlers.js');
      const projRes = await handleListProjects({});
      if (projRes.content && projRes.content[0]) {
        const data = JSON.parse(projRes.content[0].text);
        const matched = data.projects?.find(p => p.name === projectName || p.id === projectName);
        if (matched) {
          projectId = matched.id;
        }
      }
    }
    
    if (!projectId) {
      // Fallback
      projectId = 'prj_SqsvpOFq9JfsWAyLpQhd3wIL9hNY';
    }
    
    console.log(`\nConnecting to Vercel Runtime Logs Stream...`);
    console.log(`Project ID:    ${projectId}`);
    console.log(`Deployment ID: ${deploymentId}`);
    console.log(`Timeout:       Streams logs for 5 seconds, then closes automatically.`);
    console.log(`====================================================================\n`);
    
    const url = `https://api.vercel.com/v1/projects/${projectId}/deployments/${deploymentId}/runtime-logs`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.log(`\n====================================================================`);
      console.log(`[TIMEOUT] Automatically disconnecting from logs stream after 5s.`);
      controller.abort();
    }, 5000);
    
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Authorization: `Bearer ${vercelApiToken}`
      }
    });
    
    if (!response.ok) {
      console.error(`Failed to connect to stream. Status: ${response.status}`);
      clearTimeout(timeoutId);
      process.exit(1);
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep last incomplete line in buffer
      
      for (const line of lines) {
        if (!line.trim()) continue;
        
        // SSE lines start with "data: "
        if (line.startsWith('data: ')) {
          try {
            const rawData = line.slice(6);
            const logObj = JSON.parse(rawData);
            
            // Format log entry
            // Vercel runtime logs usually contain proxy, lambda, or build execution details
            const timestamp = new Date(logObj.created || logObj.timestamp || Date.now()).toLocaleTimeString();
            const logType = logObj.type || 'INFO';
            
            // Extract the message or request info
            let message = logObj.message || '';
            if (logObj.proxy) {
              const req = logObj.proxy;
              message = `[REQUEST] ${req.method} ${req.path} -> Status ${req.statusCode} (${req.duration}ms)`;
            } else if (logObj.lambda) {
              message = `[LAMBDA] ${logObj.lambda.entrypoint} - ${logObj.lambda.output || ''}`;
            }
            
            if (message) {
              console.log(`[${timestamp}] [${logType.toUpperCase()}] ${message}`);
            }
          } catch (e) {
            // If it's not JSON, print line
            console.log(line);
          }
        }
      }
    }
    
    clearTimeout(timeoutId);
  } catch (error) {
    if (error.name === 'AbortError') {
      // Handled timeout abort
      return;
    }
    console.error("Stream error:", error);
  }
}

streamRuntimeLogs();
