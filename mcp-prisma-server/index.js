#!/usr/bin/env node
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { exec } from "node:child_process";
import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const workspaceRoot = path.resolve(__dirname, "..");
const dbPath = path.resolve(workspaceRoot, "prisma/dev.db");

// Initialize MCP Server
const server = new McpServer({
  name: "prisma-mcp-server",
  version: "1.0.0",
});

// Helper to execute commands in workspace root
function runCommand(command) {
  return new Promise((resolve) => {
    exec(command, { cwd: workspaceRoot }, (error, stdout, stderr) => {
      resolve({
        success: !error,
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        code: error ? error.code : 0,
      });
    });
  });
}

// Helper to open SQLite DB connection
function getDb() {
  if (!fs.existsSync(dbPath)) {
    throw new Error(`SQLite database not found at ${dbPath}`);
  }
  return new DatabaseSync(dbPath);
}

// Register Tool: prisma_generate
server.tool(
  "prisma_generate",
  "Regenerate the Prisma Client matching schema.prisma",
  {},
  async () => {
    const result = await runCommand("npx prisma generate");
    return {
      content: [
        {
          type: "text",
          text: `Command: npx prisma generate\nSuccess: ${result.success}\nExit Code: ${result.code}\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
        },
      ],
    };
  }
);

// Register Tool: prisma_db_push
server.tool(
  "prisma_db_push",
  "Push schema.prisma changes directly to the SQLite dev.db (accepts data loss for dev prototyping)",
  {
    acceptDataLoss: z
      .boolean()
      .optional()
      .default(true)
      .describe("Accept schema transformations that might result in data loss"),
  },
  async ({ acceptDataLoss }) => {
    const cmd = `npx prisma db push ${acceptDataLoss ? "--accept-data-loss" : ""}`;
    const result = await runCommand(cmd);
    return {
      content: [
        {
          type: "text",
          text: `Command: ${cmd}\nSuccess: ${result.success}\nExit Code: ${result.code}\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
        },
      ],
    };
  }
);

// Register Tool: prisma_db_seed
server.tool(
  "prisma_db_seed",
  "Run a specific database seed script from the prisma/ folder",
  {
    script: z
      .enum(["seed", "seedAdmin", "seedAll"])
      .describe("The seed script to run: 'seed' (basic user), 'seedAdmin' (initial admin), 'seedAll' (full configurations)"),
  },
  async ({ script }) => {
    const cmd = `npx tsx prisma/${script}.ts`;
    const result = await runCommand(cmd);
    return {
      content: [
        {
          type: "text",
          text: `Command: ${cmd}\nSuccess: ${result.success}\nExit Code: ${result.code}\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
        },
      ],
    };
  }
);

// Register Tool: prisma_run_custom_script
server.tool(
  "prisma_run_custom_script",
  "Run a special developer utility script in the prisma folder (exportToSqlite or injectRawSql)",
  {
    script: z
      .enum(["exportToSqlite", "injectRawSql"])
      .describe("The script to execute: 'exportToSqlite' (syncs remote Neon DB to local SQLite), 'injectRawSql' (directly injects homepage/lectures via raw SQLite SQL)"),
  },
  async ({ script }) => {
    const cmd = `npx tsx prisma/${script}.ts`;
    const result = await runCommand(cmd);
    return {
      content: [
        {
          type: "text",
          text: `Command: ${cmd}\nSuccess: ${result.success}\nExit Code: ${result.code}\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
        },
      ],
    };
  }
);

// Register Tool: prisma_format_schema
server.tool(
  "prisma_format_schema",
  "Format and validate the schema.prisma file contents",
  {},
  async () => {
    const result = await runCommand("npx prisma format");
    return {
      content: [
        {
          type: "text",
          text: `Command: npx prisma format\nSuccess: ${result.success}\nExit Code: ${result.code}\n\nSTDOUT:\n${result.stdout}\n\nSTDERR:\n${result.stderr}`,
        },
      ],
    };
  }
);

// Register Tool: prisma_sqlite_list_tables
server.tool(
  "prisma_sqlite_list_tables",
  "List all tables and row counts directly in the SQLite dev.db using high-speed native node:sqlite engine",
  {},
  async () => {
    let db;
    try {
      db = getDb();
      const tables = db
        .prepare("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'")
        .all();

      const results = [];
      for (const table of tables) {
        try {
          const countRes = db.prepare(`SELECT count(*) as count FROM "${table.name}"`).all();
          results.push({ table: table.name, rows: countRes[0].count });
        } catch (e) {
          results.push({ table: table.name, rows: "Error counting rows", error: e.message });
        }
      }

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(results, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to inspect SQLite database: ${error.message}`,
          },
        ],
      };
    } finally {
      if (db) db.close();
    }
  }
);

// Register Tool: prisma_sqlite_describe_table
server.tool(
  "prisma_sqlite_describe_table",
  "Describe columns, key indexes, and foreign keys of a specific table in SQLite",
  {
    table: z.string().describe("The name of the table to describe"),
  },
  async ({ table }) => {
    let db;
    try {
      db = getDb();
      const columns = db.prepare(`PRAGMA table_info("${table}")`).all();
      const indexes = db.prepare(`PRAGMA index_list("${table}")`).all();
      const foreignKeys = db.prepare(`PRAGMA foreign_key_list("${table}")`).all();

      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({ table, columns, indexes, foreignKeys }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Failed to describe table "${table}": ${error.message}`,
          },
        ],
      };
    } finally {
      if (db) db.close();
    }
  }
);

// Register Tool: prisma_sqlite_query
server.tool(
  "prisma_sqlite_query",
  "Execute a read-only SQL query (SELECT) directly against the local SQLite dev.db",
  {
    sql: z.string().describe("The SELECT SQL query statement to run"),
  },
  async ({ sql }) => {
    const trimmed = sql.trim().toLowerCase();
    if (!trimmed.startsWith("select") && !trimmed.startsWith("pragma") && !trimmed.startsWith("explain")) {
      return {
        content: [
          {
            type: "text",
            text: "Error: Only read-only queries (SELECT, PRAGMA, EXPLAIN) are allowed through the prisma_sqlite_query tool. For modifications, please use the prisma_sqlite_mutation tool.",
          },
        ],
      };
    }

    let db;
    try {
      db = getDb();
      const rows = db.prepare(sql).all();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(rows, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Query execution failed:\nQuery: ${sql}\nError: ${error.message}`,
          },
        ],
      };
    } finally {
      if (db) db.close();
    }
  }
);

// Register Tool: prisma_sqlite_mutation
server.tool(
  "prisma_sqlite_mutation",
  "Execute a write/mutation SQL statement (INSERT, UPDATE, DELETE) directly against the local SQLite dev.db",
  {
    sql: z.string().describe("The mutation SQL statement to run"),
  },
  async ({ sql }) => {
    let db;
    try {
      db = getDb();
      const statement = db.prepare(sql);
      const result = statement.run();
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify({
              success: true,
              statement: sql,
              changes: result.changes,
              lastInsertRowid: result.lastInsertRowid ? String(result.lastInsertRowid) : null,
            }, null, 2),
          },
        ],
      };
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Mutation failed:\nStatement: ${sql}\nError: ${error.message}`,
          },
        ],
      };
    } finally {
      if (db) db.close();
    }
  }
);

// Connect to stdio transport
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error starting prisma-mcp-server:", error);
  process.exit(1);
});
