"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { updateSiteSettings } from "@/lib/control-actions";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import { CloudinaryUploadButton } from "@/components/cloudinary-upload-button";
import { ColorPickerField } from "@/components/control/color-picker-field";

const formSchema = z.object({
  siteName: z.string().min(2).max(50),
  siteUrl: z.string().url(),
  description: z.string().min(10).max(500),
  maintenanceMode: z.boolean(),
  allowRegistration: z.boolean(),
  enableGoogleAnalytics: z.boolean(),
  enableAdminTheme: z.boolean(),
  googleAnalyticsId: z.string().optional().nullable(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  primaryColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .optional(),
  secondaryColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .optional(),
  backgroundColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .optional(),
  textColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .optional(),
  adminPrimaryColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .optional(),
  adminSecondaryColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .optional(),
  adminBackgroundColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .optional(),
  adminTextColor: z
    .string()
    .regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/)
    .optional(),
  fullAddress: z.string().optional(),
  logoUrl: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
  adminTheme: z.string().optional().nullable(),
});

interface SiteSettingsData {
  siteName?: string;
  siteUrl?: string;
  description?: string | null;
  maintenanceMode?: boolean;
  allowRegistration?: boolean;
  enableGoogleAnalytics?: boolean | string; // Handled stringified data safely
  enableAdminTheme?: boolean | null;
  googleAnalyticsId?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  primaryColor?: string | null;
  secondaryColor?: string | null;
  backgroundColor?: string | null;
  textColor?: string | null;
  adminPrimaryColor?: string | null;
  adminSecondaryColor?: string | null;
  adminBackgroundColor?: string | null;
  adminTextColor?: string | null;
  fullAddress?: string | null;
  logoUrl?: string | null;
  ogImage?: string | null;
  faviconUrl?: string | null;
  adminTheme?: string | null;
}

export function SettingsForm({
  initialData,
}: {
  initialData: SiteSettingsData | null;
}) {
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      siteName: initialData?.siteName || "phaglp",
      siteUrl: initialData?.siteUrl || "https://www.phaglp.com",
      description:
        initialData?.description || "Unified Dashboard Management Engine.",
      maintenanceMode: initialData?.maintenanceMode ?? false,
      allowRegistration: initialData?.allowRegistration ?? false,

      // Clean handling for analytics data
      enableGoogleAnalytics:
        initialData?.enableGoogleAnalytics === true ||
        initialData?.enableGoogleAnalytics === "1",
      enableAdminTheme: initialData?.enableAdminTheme ?? false,
      googleAnalyticsId: initialData?.googleAnalyticsId || "",

      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      primaryColor: initialData?.primaryColor || "#0040a1",
      secondaryColor: initialData?.secondaryColor || "#565e71",
      backgroundColor: initialData?.backgroundColor || "#f8f9ff",
      textColor: initialData?.textColor || "#181c22",
      adminPrimaryColor: initialData?.adminPrimaryColor || "",
      adminSecondaryColor: initialData?.adminSecondaryColor || "",
      adminBackgroundColor: initialData?.adminBackgroundColor || "",
      adminTextColor: initialData?.adminTextColor || "",
      fullAddress: initialData?.fullAddress || "",

      // Null-guards prevent "uncontrolled to controlled" inputs warnings
      logoUrl: initialData?.logoUrl || "",
      ogImage: initialData?.ogImage || "",
      faviconUrl: initialData?.faviconUrl || "",
      adminTheme: initialData?.adminTheme || "default",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      const result = await updateSiteSettings(values);
      if (result.success) {
        toast.success("Settings updated successfully");
      } else {
        toast.error(result.error || "Failed to update settings");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="siteName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter site name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="siteUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Site URL</FormLabel>
                <FormControl>
                  <Input placeholder="https://example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Short Description</FormLabel>
              <FormControl>
                <Textarea placeholder="Describe your platform..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="maintenanceMode"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-white/40 dark:bg-slate-900/10">
                <div className="space-y-0.5">
                  <FormLabel>Maintenance Mode</FormLabel>
                  <FormDescription>
                    Disable public access to the site.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="allowRegistration"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-white/40 dark:bg-slate-900/10">
                <div className="space-y-0.5">
                  <FormLabel>Allow Public Registration</FormLabel>
                  <FormDescription>
                    Toggle registration access for new users.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        {/* Brand Appearance Customization */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Theme Customization
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <ColorPickerField
                    label="Primary Color"
                    description="Used for buttons, links, and accents."
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secondaryColor"
              render={({ field }) => (
                <FormItem>
                  <ColorPickerField
                    label="Secondary Color"
                    description="Used for muted actions and secondary UI elements."
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="backgroundColor"
              render={({ field }) => (
                <FormItem>
                  <ColorPickerField
                    label="Background Color"
                    description="Base background tone of the UI."
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="textColor"
              render={({ field }) => (
                <FormItem>
                  <ColorPickerField
                    label="Text Color"
                    description="Default body text color."
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Admin Theme Colors
          </h3>
          <p className="text-xs text-muted-foreground">
            Optional dedicated admin palette. When enabled, these override
            public colors in the control panel.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="adminPrimaryColor"
              render={({ field }) => (
                <FormItem>
                  <ColorPickerField
                    label="Admin Primary Color"
                    description="Admin panel accent color."
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adminSecondaryColor"
              render={({ field }) => (
                <FormItem>
                  <ColorPickerField
                    label="Admin Secondary Color"
                    description="Admin secondary UI color."
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adminBackgroundColor"
              render={({ field }) => (
                <FormItem>
                  <ColorPickerField
                    label="Admin Background Color"
                    description="Admin panel background tone."
                    value={field.value}
                    onChange={field.onChange}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="adminTextColor"
              render={({ field }) => (
                <FormItem>
                  <ColorPickerField
                    label="Admin Text Color"
                    description="Default admin text color."
                    value={field.value}
                    onChange={field.onChange}
                  />
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
              <span className="font-semibold">
                {form.watch("siteName") || "PHAGLP"}
              </span>
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

        {/* Integration Controls for Analytics Tracking */}
        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Analytics Configurations
          </h3>
          <div className="grid md:grid-cols-3 gap-6 items-end">
            <div className="md:col-span-1">
              <FormField
                control={form.control}
                name="enableGoogleAnalytics"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm bg-white/40 dark:bg-slate-900/10">
                    <div className="space-y-0.5">
                      <FormLabel>Google Analytics</FormLabel>
                    </div>
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="md:col-span-2">
              <FormField
                control={form.control}
                name="googleAnalyticsId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Measurement ID (G-XXXXXX)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="G-XXXXXXXXXX"
                        {...field}
                        value={field.value ?? ""}
                        disabled={!form.watch("enableGoogleAnalytics")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
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
                  <FormDescription>
                    Use separate colors for the admin panel.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            SEO & Meta Tags
          </h3>
          <FormField
            control={form.control}
            name="metaTitle"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Title</FormLabel>
                <FormControl>
                  <Input placeholder="SEO Title" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="metaDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Meta Description</FormLabel>
                <FormControl>
                  <Input placeholder="SEO Description" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Contact & Location Information
          </h3>
          <FormField
            control={form.control}
            name="fullAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Location Address</FormLabel>
                <FormControl>
                  <Input
                    placeholder="2501 Case Street, Unit 13, Batesville 72501, Arkansas, USA."
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  This address will be displayed as the official physical
                  address of the organization.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="space-y-4 pt-4 border-t">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Site Images & Branding
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Site Logo</FormLabel>
                  <div className="flex flex-col gap-3">
                    {field.value && (
                      <img
                        src={field.value}
                        alt="Logo Preview"
                        className="h-16 w-auto object-contain border rounded-md"
                      />
                    )}
                    <CloudinaryUploadButton
                      onUpload={(url) => field.onChange(url)}
                    >
                      Upload Logo
                    </CloudinaryUploadButton>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="faviconUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favicon</FormLabel>
                  <div className="flex flex-col gap-3">
                    {field.value && (
                      <img
                        src={field.value}
                        alt="Favicon Preview"
                        className="h-8 w-8 object-contain border rounded-md"
                      />
                    )}
                    <CloudinaryUploadButton
                      onUpload={(url) => field.onChange(url)}
                    >
                      Upload Favicon
                    </CloudinaryUploadButton>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ogImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>OG Cover Image</FormLabel>
                  <div className="flex flex-col gap-3">
                    {field.value && (
                      <img
                        src={field.value}
                        alt="OG Preview"
                        className="h-24 w-auto object-cover border rounded-md"
                      />
                    )}
                    // FIXED
                    <CloudinaryUploadButton
                      onUpload={(url) => field.onChange(url)}
                    >
                      Upload Cover
                    </CloudinaryUploadButton>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <Button type="submit" disabled={loading} className="w-full sm:w-auto">
          {loading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Save className="mr-2 h-4 w-4" />
          )}
          Save Configuration
        </Button>
      </form>
    </Form>
  );
}
