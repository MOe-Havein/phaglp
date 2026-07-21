export interface ThemeFileScanEntry {
  path: string;
  status: "existing" | "modified" | "new" | "planned";
  summary?: string;
  opportunities?: string[];
  requiredModifications?: string[];
  reusableArchitecture?: string[];
}

export interface ThemeSchemaField {
  name: string;
  status: "new" | "modified" | "unchanged";
  notes?: string;
}

export interface ThemeSchemaDiff {
  model: string;
  fields: ThemeSchemaField[];
}

export interface ThemeAdminTab {
  name: string;
  controls: string[];
  previewBehavior: string;
  affectedComponents: string[];
}

export interface ThemeServerStep {
  label: string;
  description: string;
  codeSnippet?: string;
}

export interface ThemePhase {
  id: number;
  title: string;
  objective: string;
  tasks: string[];
  dependencies?: string[];
  checklist: string[];
  status: "complete" | "in-progress" | "pending";
}

export interface ThemeDashboardData {
  repoRoot: string;
  analyzed: ThemeFileScanEntry[];
  architecture: { from: string; to: string; label: string }[];
  schemaDiffs: ThemeSchemaDiff[];
  fileStructure: ThemeFileScanEntry[];
  adminTabs: ThemeAdminTab[];
  serverActionFlow: ThemeServerStep[];
  themeTokens: Record<string, unknown>;
  implementationPhases: ThemePhase[];
  overallProgress: number;
}
