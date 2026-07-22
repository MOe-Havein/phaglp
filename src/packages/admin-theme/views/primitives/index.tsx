import { PageHeader } from "@/packages/admin-theme/views/primitives/page-header";
import { ActionBar } from "@/packages/admin-theme/views/primitives/action-bar";

export function PagePrimitivesDemo() {
  return (
    <div className="space-y-4">
      <PageHeader
        title="Shared Admin Primitives"
        description="Reusable header and action bar for control pages."
      />
      <ActionBar>
        <button className="rounded-md border px-3 py-2 text-sm">Cancel</button>
        <button className="rounded-md bg-blue-600 px-3 py-2 text-sm text-white">
          Save
        </button>
      </ActionBar>
    </div>
  );
}
