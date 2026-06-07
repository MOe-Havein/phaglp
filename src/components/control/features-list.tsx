"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { toggleFeatureFlag } from "@/lib/control-actions";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface FeatureFlag {
  key: string;
  description: string | null;
  isEnabled: boolean;
}

export function FeaturesList({
  initialFlags,
}: {
  initialFlags: FeatureFlag[];
}) {
  const [flags, setFlags] = useState(initialFlags);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleToggle = async (key: string, currentStatus: boolean) => {
    setUpdating(key);
    try {
      await toggleFeatureFlag(key, !currentStatus);
      setFlags(
        flags.map((f) =>
          f.key === key ? { ...f, isEnabled: !currentStatus } : f,
        ),
      );
      toast.success(`Feature ${!currentStatus ? "enabled" : "disabled"}`);
    } catch (error) {
      toast.error("Failed to update feature flag");
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-4">
      {flags.length === 0 && (
        <div className="text-center py-4 text-muted-foreground text-sm">
          No feature flags defined in database.
        </div>
      )}
      {flags.map((flag) => (
        <div
          key={flag.key}
          className="flex items-center justify-between p-3 rounded-lg border bg-background hover:bg-accent/50 transition-colors"
        >
          <div className="space-y-0.5">
            <div className="font-medium text-sm">{flag.key}</div>
            {flag.description && (
              <div className="text-xs text-muted-foreground">
                {flag.description}
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {updating === flag.key && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            <Switch
              checked={flag.isEnabled}
              onCheckedChange={() => handleToggle(flag.key, flag.isEnabled)}
              disabled={updating === flag.key}
            />
          </div>
        </div>
      ))}
    </div>
  );
}
