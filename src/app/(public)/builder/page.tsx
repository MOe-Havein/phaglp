"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  Wand2,
  Palette,
  Type,
  ImageIcon,
  Layout,
  Save,
  Eye,
} from "lucide-react";
import { AIContentGenerator } from "@/components/ai-content-generator";
import { WebsitePreview } from "@/components/website-preview";

export default function BuilderPage() {
  const [activeTab, setActiveTab] = useState("content");
  const [websiteData, setWebsiteData] = useState({
    title: "Your Amazing Business",
    subtitle: "Transform your ideas into reality with our innovative solutions",
    description:
      "We help businesses grow and succeed in the digital age with cutting-edge technology and expert guidance.",
    ctaText: "Get Started Today",
    features: ["Professional Service", "24/7 Support", "Money Back Guarantee"],
  });

  const handleContentUpdate = (field: string, value: string | string[]) => {
    setWebsiteData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-secondary">
      {/* Header */}
      <header className="bg-background border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-blue-600 rounded-lg flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-primary">
                AI Builder Pro
              </span>
            </div>
            <Badge variant="secondary">Website Builder</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              size="sm"
              className="bg-accent text-white hover:bg-accent/90"
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Builder Controls */}
        <div className="w-1/3 bg-background border-r overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-6 text-foreground">
              Website Builder
            </h2>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content" className="text-xs">
                  <Type className="w-4 h-4 mr-1" />
                  Content
                </TabsTrigger>
                <TabsTrigger value="design" className="text-xs">
                  <Palette className="w-4 h-4 mr-1" />
                  Design
                </TabsTrigger>
                <TabsTrigger value="layout" className="text-xs">
                  <Layout className="w-4 h-4 mr-1" />
                  Layout
                </TabsTrigger>
                <TabsTrigger value="media" className="text-xs">
                  <ImageIcon className="w-4 h-4 mr-1" />
                  Media
                </TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-6 mt-6">
                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Wand2 className="w-5 h-5 text-primary" />
                      AI Content Generator
                    </CardTitle>
                    <CardDescription>
                      Generate compelling content with AI
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <AIContentGenerator
                      onContentGenerated={handleContentUpdate}
                    />
                  </CardContent>
                </Card>

                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle className="text-foreground">
                      Manual Content
                    </CardTitle>
                    <CardDescription>
                      Edit your content directly
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-foreground">
                        Main Title
                      </label>
                      <Input
                        value={websiteData.title}
                        onChange={(e) =>
                          handleContentUpdate("title", e.target.value)
                        }
                        placeholder="Your business title"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-foreground">
                        Subtitle
                      </label>
                      <Input
                        value={websiteData.subtitle}
                        onChange={(e) =>
                          handleContentUpdate("subtitle", e.target.value)
                        }
                        placeholder="Compelling subtitle"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block text-foreground">
                        Description
                      </label>
                      <Textarea
                        value={websiteData.description}
                        onChange={(e) =>
                          handleContentUpdate("description", e.target.value)
                        }
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
                        onChange={(e) =>
                          handleContentUpdate("ctaText", e.target.value)
                        }
                        placeholder="Get Started"
                      />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="design" className="space-y-6 mt-6">
                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle className="text-foreground">
                      Color Scheme
                    </CardTitle>
                    <CardDescription>Choose your brand colors</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="w-full h-12 bg-gradient-to-r from-primary to-blue-600 rounded-lg cursor-pointer border-2 border-primary"></div>
                      <div className="w-full h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-lg cursor-pointer border-2 border-transparent hover:border-muted-foreground/30"></div>
                      <div className="w-full h-12 bg-gradient-to-r from-accent to-red-500 rounded-lg cursor-pointer border-2 border-transparent hover:border-muted-foreground/30"></div>
                      <div className="w-full h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg cursor-pointer border-2 border-transparent hover:border-muted-foreground/30"></div>
                      <div className="w-full h-12 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-lg cursor-pointer border-2 border-transparent hover:border-muted-foreground/30"></div>
                      <div className="w-full h-12 bg-gradient-to-r from-gray-700 to-gray-900 rounded-lg cursor-pointer border-2 border-transparent hover:border-muted-foreground/30"></div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle className="text-foreground">
                      Typography
                    </CardTitle>
                    <CardDescription>
                      Select fonts for your website
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="p-3 border rounded-lg cursor-pointer hover:bg-secondary border-primary/30 bg-primary/5">
                        <div className="font-bold text-lg text-foreground">
                          Modern Sans
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Clean and professional
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg cursor-pointer hover:bg-secondary">
                        <div className="font-bold text-lg font-serif text-foreground">
                          Classic Serif
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Traditional and elegant
                        </div>
                      </div>
                      <div className="p-3 border rounded-lg cursor-pointer hover:bg-secondary">
                        <div className="font-bold text-lg font-mono text-foreground">
                          Tech Mono
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Modern and technical
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="layout" className="space-y-6 mt-6">
                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle className="text-foreground">
                      Page Layout
                    </CardTitle>
                    <CardDescription>
                      Choose your page structure
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="border-2 border-primary rounded-lg p-4 cursor-pointer bg-primary/5">
                        <div className="w-full h-20 bg-secondary rounded mb-2"></div>
                        <div className="text-xs font-medium text-foreground">
                          Hero + Features
                        </div>
                      </div>
                      <div className="border rounded-lg p-4 cursor-pointer hover:border-muted-foreground/40">
                        <div className="w-full h-20 bg-secondary rounded mb-2"></div>
                        <div className="text-xs font-medium text-foreground">
                          Split Layout
                        </div>
                      </div>
                      <div className="border rounded-lg p-4 cursor-pointer hover:border-muted-foreground/40">
                        <div className="w-full h-20 bg-secondary rounded mb-2"></div>
                        <div className="text-xs font-medium text-foreground">
                          Minimal
                        </div>
                      </div>
                      <div className="border rounded-lg p-4 cursor-pointer hover:border-muted-foreground/40">
                        <div className="w-full h-20 bg-secondary rounded mb-2"></div>
                        <div className="text-xs font-medium text-foreground">
                          Magazine
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="media" className="space-y-6 mt-6">
                <Card className="bg-background">
                  <CardHeader>
                    <CardTitle className="text-foreground">
                      Images & Media
                    </CardTitle>
                    <CardDescription>
                      Add visual content to your site
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <ImageIcon className="w-4 h-4 mr-2" />
                        Upload Images
                      </Button>
                      <Button
                        variant="outline"
                        className="w-full bg-transparent"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate AI Images
                      </Button>
                      <div className="text-sm text-muted-foreground">
                        Supported formats: JPG, PNG, WebP, SVG
                      </div>
                    </div>
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
  );
}
