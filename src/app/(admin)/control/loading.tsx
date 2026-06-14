// src/app/admin/loading.tsx
import { Spinner } from "@/components/ui/spinner";

export default function AdminLoading() {
  return (
    // Fill the administrative panel workspace container rather than full screen
    <div className="w-full min-h-[60vh] flex items-center justify-center p-12 bg-transparent">
      <Spinner showLogo variant="secondary">
        Fetching administrative controls...
      </Spinner>
    </div>
  );
}
