export type ThemeAssetManifest = {
  css: string[];
  js: string[];
};

export const defaultThemeAssets: ThemeAssetManifest = {
  css: [],
  js: [],
};

export function getThemeAssets(id: string): ThemeAssetManifest {
  if (id === "custom") {
    return {
      css: ["/themes/admin/custom/build/assets/index.css"],
      js: ["/themes/admin/custom/build/assets/index.js"],
    };
  }
  return defaultThemeAssets;
}
