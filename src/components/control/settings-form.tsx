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

const formSchema = z.object({
  siteName: z.string().min(2).max(50),
  siteUrl: z.string().url(),
  description: z.string().min(10).max(500),
  maintenanceMode: z.boolean(),
  allowRegistration: z.boolean(),
  enableGoogleAnalytics: z.boolean(),
  googleAnalyticsId: z.string().optional().nullable(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  primaryColor: z.string().optional(),
  fullAddress: z.string().optional(),
  logoUrl: z.string().optional().nullable(),
  ogImage: z.string().optional().nullable(),
  faviconUrl: z.string().optional().nullable(),
});

interface SiteSettingsData {
  siteName?: string;
  siteUrl?: string;
  description?: string | null;
  maintenanceMode?: boolean;
  allowRegistration?: boolean;
  enableGoogleAnalytics?: boolean | string; // Handled stringified data safely
  googleAnalyticsId?: string | null;
  metaTitle?: string | null;
  metaDescription?: string | null;
  primaryColor?: string | null;
  fullAddress?: string | null;
  logoUrl?: string | null;
  ogImage?: string | null;
  faviconUrl?: string | null;
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
      description: initialData?.description || "Unified Dashboard Management Engine.",
      maintenanceMode: initialData?.maintenanceMode ?? false,
      allowRegistration: initialData?.allowRegistration ?? false,
      
      // Clean handling for analytics data
      enableGoogleAnalytics: initialData?.enableGoogleAnalytics === true || initialData?.enableGoogleAnalytics === "1",
      googleAnalyticsId: initialData?.googleAnalyticsId || "",
      
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      primaryColor: initialData?.primaryColor || "#3b82f6",
      fullAddress: initialData?.fullAddress || "",
      
      // Null-guards prevent "uncontrolled to controlled" inputs warnings
      logoUrl: initialData?.logoUrl || "",
      ogImage: initialData?.ogImage || "",
      faviconUrl: initialData?.faviconUrl || "",
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
          <FormField
            control={form.control}
            name="primaryColor"
            render={({ field }) => (
              <FormItem className="max-w-[200px]">
                <FormLabel>Primary Color Hex</FormLabel>
                <div className="flex gap-2">
                  <FormControl>
                    <Input placeholder="#3b82f6" {...field} />
                  </FormControl>
                  <div 
                    className="w-10 h-10 rounded border shadow-sm shrink-0" 
                    style={{ backgroundColor: field.value || "#3b82f6" }}
                  />
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
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
                    //  FIXED
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
