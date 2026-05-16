"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sparkles, Save, Eye, ArrowLeft, Share, Download } from "lucide-react"
import { AIContentGenerator } from "@/components/ai-content-generator"
import { WebsitePreview } from "@/components/website-preview"
import Link from "next/link"

export default function EditProjectPage() {
  const [activeTab, setActiveTab] = useState("content")
  const [websiteData, setWebsiteData] = useState({
    title: "Tech Startup Landing",
    subtitle: "Revolutionary SaaS platform for modern businesses",
    description:
      "Streamline your workflow and boost productivity with our cutting-edge software solution designed for teams of all sizes.",
    ctaText: "Start Free Trial",
    features: [
      "Advanced Analytics Dashboard",
      "Real-time Collaboration",
      "Enterprise Security",
      "24/7 Customer Support",
      "API Integration",
      "Custom Workflows",
    ],
  })

  const [isSaving, setIsSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  const handleContentUpdate = (field: string, value: string | string[]) => {
    setWebsiteData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setLastSaved(new Date())
    setIsSaving(false)
  }

  const handlePublish = async () => {
    await handleSave()
    alert("Website published successfully!")
  }

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-foreground">Tech Startup Landing</span>
                <div className="text-xs text-muted-foreground">
                  {lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : "Unsaved changes"}
                </div>
              </div>
            </div>
            <Badge variant="secondary">Editing</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Share className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              size="sm"
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary text-white hover:bg-primary/90"
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? "Saving..." : "Save"}
            </Button>
            <Button
              size="sm"
              onClick={handlePublish}
              className="bg-accent text-white hover:bg-accent/90"
            >
              Publish
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Builder Controls */}
        <div className="w-1/3 bg-background border-r overflow-y-auto">
          <div className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="design">Design</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6 mt-6">
                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Sparkles className="w-5 h-5 text-primary" />
                      AI Content Generator
                    </CardTitle>
                    <CardDescription>Generate and refine your content with AI</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AIContentGenerator onContentGenerated={handleContentUpdate} />
                  </CardContent>
                </Card>

                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle className="text-foreground">Content Editor</CardTitle>
                    <CardDescription>Manually edit your content</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-foreground">
                        Main Title
                      </label>
                      <Input
                        value={websiteData.title}
                        onChange={(e) => handleContentUpdate("title", e.target.value)}
                        placeholder="Your business title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-foreground">
                        Subtitle
                      </label>
                      <Input
                        value={websiteData.subtitle}
                        onChange={(e) => handleContentUpdate("subtitle", e.target.value)}
                        placeholder="Compelling subtitle"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-foreground">
                        Description
                      </label>
                      <Textarea
                        value={websiteData.description}
                        onChange={(e) => handleContentUpdate("description", e.target.value)}
                        placeholder="Describe your business"
                        rows={4}
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-foreground">
                        Call to Action
                      </label>
                      <Input
                        value={websiteData.ctaText}
                        onChange={(e) => handleContentUpdate("ctaText", e.target.value)}
                        placeholder="Get Started"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="space-y-6 mt-6">
                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle className="text-foreground">Theme & Colors</CardTitle>
                    <CardDescription>Customize your website's appearance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3 mb-4">
                      <div className="w-full h-12 bg-gradient-to-r from-primary to-blue-600 rounded-lg cursor-pointer border-2 border-primary"></div>
                      <div className="w-full h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg cursor-pointer border-2 border-transparent hover:border-muted-foreground/30"></div>
                      <div className="w-full h-12 bg-gradient-to-r from-accent to-red-500 rounded-lg cursor-pointer border-2 border-transparent hover:border-muted-foreground/30"></div>
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      Customize Colors
                    </Button>
                  </CardContent>
                </Card>

                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle className="text-foreground">Typography</CardTitle>
                    <CardDescription>Choose fonts for your website</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg cursor-pointer hover:bg-secondary border-primary/30 bg-primary/5">
                        <div className="font-bold text-lg text-foreground">Inter</div>
                        <div className="text-sm text-muted-foreground">Modern and clean</div>
                      </div>
                      <div className="p-3 border rounded-lg cursor-pointer hover:bg-secondary">
                        <div className="font-bold text-lg font-serif text-foreground">
                          Playfair Display
                        </div>
                        <div className="text-sm text-muted-foreground">Elegant serif</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="settings" className="space-y-6 mt-6">
                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle className="text-foreground">SEO Settings</CardTitle>
                    <CardDescription>Optimize for search engines</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-foreground">
                        Page Title
                      </label>
                      <Input placeholder="SEO-friendly page title" />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-foreground">
                        Meta Description
                      </label>
                      <Textarea placeholder="Brief description for search results" rows={3} />
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle className="text-foreground">Domain & Publishing</CardTitle>
                    <CardDescription>Configure your website URL</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-foreground">
                        Custom Domain
                      </label>
                      <Input placeholder="yourwebsite.com" />
                    </div>
                    <Button variant="outline" className="w-full bg-transparent">
                      Connect Domain
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="flex-1 bg-secondary">
          <WebsitePreview data={websiteData} />
        </div>
      </div>
    </div>
  )
}
