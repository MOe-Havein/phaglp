export type AdminTheme = {
  id: string;
  name: string;
  viewsRoot: string;
  assets?: { css?: string[]; js?: string[] };
};

export const defaultAdminTheme: AdminTheme = {
  id: "default",
  name: "Default",
  viewsRoot: "default",
  assets: { css: [], js: [] },
};
