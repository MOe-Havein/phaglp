"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getPublicModelOptions } from "@/lib/ai-models";
import { Loader2, Cpu } from "lucide-react";

interface ModelSelectorProps {
  /** Current selected model id (controlled from parent). */
  value: string;
  /** Called with the new model id when the user picks one. */
  onChange: (modelId: string) => void;
  /** Persist the selection to the user profile automatically. */
  persist?: boolean;
  className?: string;
  label?: string;
}

/**
 * Dropdown that lets a user pick which AI model powers generative features.
 * Options come from the shared registry (src/lib/ai-models.ts) so the list
 * stays in sync with what the server dispatcher supports.
 */
export function ModelSelector({
  value,
  onChange,
  persist = true,
  className,
  label = "AI Model",
}: ModelSelectorProps) {
  const options = getPublicModelOptions();
  const [saving, setSaving] = useState(false);

  async function handleSelect(modelId: string) {
    onChange(modelId);
    if (!persist) return;

    setSaving(true);
    try {
      const res = await fetch("/api/user/preferences", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aiModel: modelId }),
      });
      if (!res.ok) throw new Error("Failed to save model preference");
      toast.success("Default AI model updated");
    } catch {
      toast.error("Could not save model preference");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={className}>
      <label className="text-xs font-bold text-foreground mb-2 flex items-center gap-1.5">
        <Cpu className="w-3.5 h-3.5 text-indigo-500" />
        {label}
      </label>
      <div className="flex items-center gap-2">
        <Select value={value} onValueChange={handleSelect}>
          <SelectTrigger className="w-full rounded-xl text-xs h-9 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800">
            <SelectValue placeholder="Select AI model" />
          </SelectTrigger>
          <SelectContent>
            {options.map((opt) => (
              <SelectItem key={opt.id} value={opt.id}>
                <div className="flex flex-col">
                  <span className="text-sm">{opt.label}</span>
                  <span className="text-[10px] text-muted-foreground">
                    {opt.description}
                  </span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {saving && <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />}
      </div>
    </div>
  );
}

/**
 * Hook that loads the user's persisted default model once, and exposes the
 * current selection plus a setter that also persists it.
 */
export function useDefaultAIModel() {
  const [model, setModel] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/user/preferences")
      .then((r) => r.json())
      .then((data) => {
        if (active && data.aiModel) setModel(data.aiModel);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { model, setModel, loading };
}
