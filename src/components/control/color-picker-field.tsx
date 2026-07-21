"use client";

import { Input } from "@/components/ui/input";

type ColorPickerFieldProps = {
  label: string;
  description?: string;
  value?: string | null | undefined;
  onChange: (value: string) => void;
};

export function ColorPickerField({
  label,
  description,
  value,
  onChange,
}: ColorPickerFieldProps) {
  const hex = value || "#000000";

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <input
          type="color"
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded-md border border-input bg-transparent p-0.5"
        />
        <Input
          value={hex}
          onChange={(e) => onChange(e.target.value)}
          className="w-28 font-mono"
          placeholder="#000000"
        />
      </div>
      <div>
        <p className="text-sm font-medium">{label}</p>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div
        className="h-10 w-full rounded-md border"
        style={{ backgroundColor: hex }}
      />
    </div>
  );
}
