// src/app/loading.tsx
import { Spinner } from "@/components/ui/spinner";

export default function RootLoading() {
  return (
    // Fixed viewport overlay styled to match your theme palette background
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0F1D45] text-white">
      <div className="p-8 bg-[#16275B] border border-perfectsky-200/10 rounded-2xl shadow-2xl flex flex-col items-center gap-4">
        {/* Render your upgraded master variant spinner */}
        <Spinner showLogo variant="primary">
          Loading platform assets...
        </Spinner>
      </div>
    </div>
  );
}
