"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { saveTheme } from "@/lib/theme-actions";

const colorPattern = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/;

const themeFormSchema = z.object({
  primaryColor: z
    .union([z.string().regex(colorPattern), z.literal("")])
    .optional(),
  secondaryColor: z
    .union([z.string().regex(colorPattern), z.literal("")])
    .optional(),
  backgroundColor: z
    .union([z.string().regex(colorPattern), z.literal("")])
    .optional(),
  textColor: z
    .union([z.string().regex(colorPattern), z.literal("")])
    .optional(),
  enableAdminTheme: z.boolean().optional().nullable(),
  adminPrimaryColor: z
    .union([z.string().regex(colorPattern), z.literal("")])
    .optional(),
  adminSecondaryColor: z
    .union([z.string().regex(colorPattern), z.literal("")])
    .optional(),
  adminBackgroundColor: z
    .union([z.string().regex(colorPattern), z.literal("")])
    .optional(),
  adminTextColor: z
    .union([z.string().regex(colorPattern), z.literal("")])
    .optional(),
  adminTheme: z.string().optional().nullable(),
});

export function ThemeSettingsForm({
  initialData,
}: {
  initialData: {
    primaryColor?: string | null;
    secondaryColor?: string | null;
    backgroundColor?: string | null;
    textColor?: string | null;
    enableAdminTheme?: boolean | null;
    adminPrimaryColor?: string | null;
    adminSecondaryColor?: string | null;
    adminBackgroundColor?: string | null;
    adminTextColor?: string | null;
    adminTheme?: string | null;
  };
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(themeFormSchema),
    defaultValues: {
      primaryColor: initialData.primaryColor || "",
      secondaryColor: initialData.secondaryColor || "",
      backgroundColor: initialData.backgroundColor || "",
      textColor: initialData.textColor || "",
      enableAdminTheme: initialData.enableAdminTheme ?? null,
      adminPrimaryColor: initialData.adminPrimaryColor || "",
      adminSecondaryColor: initialData.adminSecondaryColor || "",
      adminBackgroundColor: initialData.adminBackgroundColor || "",
      adminTextColor: initialData.adminTextColor || "",
      adminTheme: initialData.adminTheme || "default",
    },
  });

  async function onSubmit(values: any) {
    setLoading(true);
    try {
      const result = await saveTheme(values);
      if (
        result &&
        typeof result === "object" &&
        "success" in result &&
        !result.success
      ) {
        toast.error(
          (result as { error?: string }).error || "Failed to update theme",
        );
        return;
      }
      toast.success("Theme updated successfully");
    } catch (error: any) {
      toast.error(error?.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4 pt-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Public Theme Colors
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Primary Color</FormLabel>
                  <FormControl>
                    <Input placeholder="#0040a1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secondaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Secondary Color</FormLabel>
                  <FormControl>
                    <Input placeholder="#565e71" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="backgroundColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Background Color</FormLabel>
                  <FormControl>
                    <Input placeholder="#f8f9ff" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="textColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Text Color</FormLabel>
                  <FormControl>
                    <Input placeholder="#181c22" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Admin Theme
          </h3>
          <p className="text-xs text-muted-foreground">
            Choose which admin shell to use for the control panel.
          </p>
          <FormField
            control={form.control}
            name="adminTheme"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Active Admin Theme</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? "default"}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select admin theme" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="default">Default</SelectItem>
                    <SelectItem value="custom">Custom</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Admin Theme Override
          </h3>
          <p className="text-xs text-muted-foreground">
            Enable this to allow the admin panel to use its own colors instead
            of inheriting the public theme.
          </p>
          <FormField
            control={form.control}
            name="enableAdminTheme"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-white/40 dark:bg-slate-900/10">
                <div className="space-y-0.5">
                  <FormLabel>Enable independent admin theme</FormLabel>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value ?? false}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Admin Theme Colors
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="adminPrimaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Primary Color</FormLabel>
                  <FormControl>
                    <Input placeholder="#0040a1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adminSecondaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Secondary Color</FormLabel>
                  <FormControl>
                    <Input placeholder="#565e71" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adminBackgroundColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Background Color</FormLabel>
                  <FormControl>
                    <Input placeholder="#f8f9ff" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adminTextColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Admin Text Color</FormLabel>
                  <FormControl>
                    <Input placeholder="#181c22" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Live Theme Preview
          </h3>
          <div
            className="rounded-lg border p-4 space-y-3"
            style={{
              backgroundColor: form.watch("backgroundColor") || "#f8f9ff",
              color: form.watch("textColor") || "#181c22",
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-semibold">PHAGLP</span>
            </div>
            <button
              type="button"
              className="rounded-md px-3 py-2 text-white"
              style={{
                backgroundColor: form.watch("primaryColor") || "#0040a1",
              }}
              onClick={(e) => e.preventDefault()}
            >
              Primary Action
            </button>
            <p className="text-xs opacity-80">
              This preview shows your selected theme tokens.
            </p>
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Theme
        </Button>
      </form>
    </Form>
  );
}
