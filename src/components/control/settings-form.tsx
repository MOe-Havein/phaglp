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

const formSchema = z.object({
  siteName: z.string().min(2).max(50),
  siteUrl: z.string().url(),
  description: z.string().min(10).max(500),
  maintenanceMode: z.boolean(),
  allowRegistration: z.boolean(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  primaryColor: z.string().optional(),
  fullAddress: z.string().optional(),
});

interface SiteSettingsData {
  siteName?: string;
  siteUrl?: string;
  description?: string | null;
  maintenanceMode?: boolean;
  allowRegistration?: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  primaryColor?: string | null;
  fullAddress?: string | null;
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
      siteName: initialData?.siteName || "PHAGLP Platform",
      siteUrl: initialData?.siteUrl || "https://phaglp.com",
      description:
        initialData?.description ||
        "A modern application for philosophical education.",
      maintenanceMode: initialData?.maintenanceMode || false,
      allowRegistration: initialData?.allowRegistration ?? true,
      metaTitle: initialData?.metaTitle || "",
      metaDescription: initialData?.metaDescription || "",
      primaryColor: initialData?.primaryColor || "#1E3A8A",
      fullAddress: initialData?.fullAddress || "",
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

        <div className="space-y-4">
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
