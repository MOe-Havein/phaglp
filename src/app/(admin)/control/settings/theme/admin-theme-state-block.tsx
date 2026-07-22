import { getSiteSettings } from "@/lib/server/site-settings";

export async function AdminThemeStateBlock() {
  const s = await getSiteSettings();
  const themeId = s.adminTheme ?? "default";
  const shell = themeId === "custom" ? "CustomAdminShell" : "DefaultAdminShell";

  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 shadow-sm">
      <h2 className="text-sm font-semibold text-gray-900 dark:text-white">
        Active Admin Theme State
      </h2>
      <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs">
        <div>
          <div className="text-gray-500 dark:text-gray-400">Selected theme</div>
          <div className="font-mono text-gray-900 dark:text-white">
            {themeId}
          </div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">Shell mapping</div>
          <div className="font-mono text-gray-900 dark:text-white">{shell}</div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">
            Enable admin theme
          </div>
          <div className="font-mono text-gray-900 dark:text-white">
            {typeof s.enableAdminTheme === "boolean"
              ? String(s.enableAdminTheme)
              : "false"}
          </div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">
            Admin primary color
          </div>
          <div className="font-mono text-gray-900 dark:text-white">
            {s.adminPrimaryColor ?? "null"}
          </div>
        </div>
      </div>
    </div>
  );
}
