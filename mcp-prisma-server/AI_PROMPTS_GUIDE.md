# AI Prompts & Usage Guide for Prisma SQLite MCP Server

This guide contains system instructions and prompt patterns for AI agents (including yourself in future sessions) to interact with the database using the custom **`prisma-mcp-server`** tools.

---

## 🛠️ MCP Tools Overview

When registered, the server exposes the following tools to the LLM context:

1. **`prisma_generate`**: Regenerates the Prisma Client.
2. **`prisma_db_push`**: Syncs `schema.prisma` modifications directly with `dev.db`.
3. **`prisma_db_seed`**: Runs seeds (`seed`, `seedAdmin`, `seedAll`).
4. **`prisma_run_custom_script`**: Runs migrations (`exportToSqlite`, `injectRawSql`).
5. **`prisma_format_schema`**: Formats and validates the Prisma schema.
6. **`prisma_sqlite_list_tables`**: Lists all database tables and current row counts.
7. **`prisma_sqlite_describe_table`**: Describes columns, indexes, and keys for a specific table.
8. **`prisma_sqlite_query`**: Safe read-only SQL queries (`SELECT`, `PRAGMA`, `EXPLAIN`).
9. **`prisma_sqlite_mutation`**: Custom write operations (`INSERT`, `UPDATE`, `DELETE`).

---

## 🧠 System Instructions for the AI

When this server is active, you should instruct any AI agent with the following rules:

> ### AI Database Operator Guidelines
> - **Examine Structure First**: Do not guess database columns. Before querying, run `prisma_sqlite_list_tables` to identify available tables, followed by `prisma_sqlite_describe_table` on target tables to get column names and types.
> - **Prefer Safe Queries**: Always use `prisma_sqlite_query` for viewing data. Do not execute write mutations unless explicitly asked to modify records.
> - **Use Upserts for Seeding**: When creating custom seeds or inserting records, use `INSERT INTO ... ON CONFLICT(...) DO UPDATE SET ...` to avoid unique key crashes.
> - **Regenerate Client on Schema Change**: If you modify `schema.prisma` and push it using `prisma_db_push`, always run `prisma_generate` immediately afterwards to ensure the local Next.js client matches the new database structures.

---

## 💬 Prompts and Expected Actions

Here are standard prompts you can give to the AI and how they map to the MCP tools:

### 1. Database Inspection & Verification

*   **Prompt**: *"Check if the local SQLite database has any users and list the table counts."*
    *   **Action**: Call `prisma_sqlite_list_tables` to inspect row counts across all tables.
*   **Prompt**: *"Describe the User table schema so I can see what profile fields we have."*
    *   **Action**: Call `prisma_sqlite_describe_table` with `{"table": "User"}`.

### 2. Running Queries

*   **Prompt**: *"Retrieve all admin users registered in our local database."*
    *   **Action**: Call `prisma_sqlite_query` with `{"sql": "SELECT * FROM User WHERE role = 'ADMIN'"}`.
*   **Prompt**: *"Show the active site settings configurations."*
    *   **Action**: Call `prisma_sqlite_query` with `{"sql": "SELECT * FROM SiteSettings LIMIT 1"}`.

### 3. Modifying Schema and Data

*   **Prompt**: *"Push the latest Prisma schema changes and regenerate the client."*
    *   **Action**: 
        1. Call `prisma_db_push` with `{"acceptDataLoss": true}`.
        2. Call `prisma_generate` to keep the client updated.
*   **Prompt**: *"Synchronize our local SQLite with Neon database tables."*
    *   **Action**: Call `prisma_run_custom_script` with `{"script": "exportToSqlite"}`.
*   **Prompt**: *"Seed all baseline data configurations."*
    *   **Action**: Call `prisma_db_seed` with `{"script": "seedAll"}`.

---

## 🔒 Safety and Formatting Guidelines

- **Quotes in SQL**: SQLite is case-sensitive with respect to double quotes for identifiers and single quotes for literal strings.
  * *Correct*: `SELECT * FROM "User" WHERE email = 'admin@example.com'`
  * *Incorrect*: `SELECT * FROM User WHERE email = "admin@example.com"`
- **Read-Only Enforcements**: The `prisma_sqlite_query` tool strictly rejects any write command like `INSERT`, `DELETE`, or `UPDATE`. If database modification is needed, you must explicitly use `prisma_sqlite_mutation`.
