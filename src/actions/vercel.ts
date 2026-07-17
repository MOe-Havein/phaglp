"use server";

import { logger } from "@/lib/server/logger";

const VERCEL_API = "https://api.vercel.com";
const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;

async function vercelFetch<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T | null> {
  if (!VERCEL_API_TOKEN) {
    logger.error("VERCEL_API_TOKEN is not configured");
    throw new Error("VERCEL_API_TOKEN is not configured in env variables");
  }

  try {
    const headers = {
      Authorization: `Bearer ${VERCEL_API_TOKEN}`,
      "Content-Type": "application/json",
      ...options.headers,
    };

    const response = await fetch(`${VERCEL_API}/${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(`Vercel API error details: ${errorText}`);
      throw new Error(
        `Vercel API error: ${response.status} - ${response.statusText}`,
      );
    }

    return (await response.json()) as T;
  } catch (error) {
    logger.error("Vercel API request failed", error);
    return null;
  }
}

export interface VercelProject {
  id: string;
  name: string;
  accountId: string;
  createdAt: number;
  framework: string | null;
  link?: {
    type: string;
    repo: string;
    org: string;
  };
}

export interface VercelDeployment {
  uid: string;
  name: string;
  projectId: string;
  url: string;
  created: number;
  state:
    "BUILDING" | "ERROR" | "INITIALIZING" | "QUEUED" | "READY" | "CANCELED";
  readyState:
    "BUILDING" | "ERROR" | "INITIALIZING" | "QUEUED" | "READY" | "CANCELED";
  readySubstate?: string;
  type: string;
  creator: {
    uid: string;
    email: string;
    username: string;
  };
  inspectorUrl: string;
  target: "production" | "preview" | null;
  createdAt: number;
  buildingAt?: number;
  ready?: number;
  meta?: {
    githubCommitAuthorName?: string;
    githubCommitAuthorEmail?: string;
    githubCommitMessage?: string;
    githubCommitOrg?: string;
    githubCommitRef?: string;
    githubCommitRepo?: string;
    githubCommitSha?: string;
    githubDeployment?: string;
    githubOrg?: string;
    githubRepo?: string;
    actor?: string;
  };
}

export async function getVercelProjects() {
  try {
    const data = await vercelFetch<{ projects: VercelProject[] }>(
      "v9/projects?limit=100",
    );
    if (!data) {
      return {
        success: false,
        error: "Failed to fetch Vercel projects",
        projects: [],
      };
    }
    return { success: true, projects: data.projects };
  } catch (error: any) {
    logger.error("Failed to list Vercel projects", error);
    return {
      success: false,
      error: error.message || "Failed to list projects",
      projects: [],
    };
  }
}

export async function getVercelDeployments(filters: {
  projectId?: string;
  state?: string;
  target?: string;
  limit?: number;
}) {
  try {
    const limit = filters.limit ?? 20;
    let url = `v6/deployments?limit=${limit}`;

    if (filters.projectId && filters.projectId !== "all") {
      url += `&projectId=${filters.projectId}`;
    }
    if (filters.state && filters.state !== "all") {
      url += `&state=${filters.state}`;
    }
    if (filters.target && filters.target !== "all") {
      url += `&target=${filters.target}`;
    }

    const data = await vercelFetch<{ deployments: VercelDeployment[] }>(url);
    if (!data) {
      return {
        success: false,
        error: "Failed to fetch Vercel deployments",
        deployments: [],
      };
    }
    return { success: true, deployments: data.deployments };
  } catch (error: any) {
    logger.error("Failed to list Vercel deployments", error);
    return {
      success: false,
      error: error.message || "Failed to list deployments",
      deployments: [],
    };
  }
}
