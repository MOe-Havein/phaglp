"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Sparkles, Wand2, Copy, RefreshCw } from "lucide-react"

interface AIContentGeneratorProps {
  onContentGenerated: (field: string, value: string | string[]) => void
}

export function AIContentGenerator({ onContentGenerated }: AIContentGeneratorProps) {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedContent, setGeneratedContent] = useState<any>(null)

  const contentTypes = [
    { id: "hero", label: "Hero Section", description: "Main headline and subtitle" },
    { id: "features", label: "Features List", description: "Product/service features" },
    { id: "about", label: "About Section", description: "Company description" },
    { id: "cta", label: "Call to Action", description: "Compelling CTA text" },
  ]

  const handleGenerate = async (type: string) => {
    setIsGenerating(true)
    setGeneratedContent(null)

    try {
      const response = await fetch("/api/generate-content", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: prompt || `Create content for a ${type} section`,
          type,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate content")
      }

      const data = await response.json()
      setGeneratedContent(data)
    } catch (error) {
      console.error("Error generating content:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleUseContent = () => {
    if (!generatedContent) return

    const { content } = generatedContent

    Object.entries(content).forEach(([key, value]) => {
      onContentGenerated(key, value as string | string[])
    })

    setGeneratedContent(null)
  }

  return (
    <div className="space-y-6">
      {/* Quick Generate Buttons */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-foreground">Quick Generate</h3>
        <div className="grid grid-cols-2 gap-2">
          {contentTypes.map((type) => (
            <Button
              key={type.id}
              variant="outline"
              size="sm"
              onClick={() => handleGenerate(type.id)}
              disabled={isGenerating}
              className="h-auto p-3 flex flex-col items-start text-left bg-transparent"
            >
              <div className="font-medium text-xs text-foreground">{type.label}</div>
              <div className="text-xs text-muted-foreground mt-1">{type.description}</div>
            </Button>
          ))}
        </div>
      </div>

      {/* Custom Prompt */}
      <div>
        <h3 className="text-sm font-medium mb-3 text-foreground">Custom Prompt</h3>
        <div className="space-y-3">
          <Textarea
            placeholder="Describe your business and what content you need... (e.g., 'Create a hero section for a sustainable fashion brand targeting millennials')"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={3}
          />
          <Button
            onClick={() => handleGenerate("custom")}
            disabled={!prompt.trim() || isGenerating}
            className="w-full bg-accent text-white hover:bg-accent/90"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Content
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Generated Content Preview */}
      {generatedContent && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-foreground">
              <Sparkles className="w-4 h-4 text-primary" />
              Generated Content
              <Badge variant="secondary">AI Generated</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {Object.entries(generatedContent.content).map(([key, value]) => (
              <div key={key} className="space-y-1">
                <div className="text-xs font-medium text-muted-foreground capitalize">{key}</div>
                <div className="text-sm bg-background p-2 rounded border text-foreground">
                  {Array.isArray(value) ? (
                    <ul className="list-disc list-inside space-y-1">
                      {value.map((item, index) => (
                        <li key={index}>{item}</li>
                      ))}
                    </ul>
                  ) : (
                    (value as string)
                  )}
                </div>
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <Button
                size="sm"
                onClick={handleUseContent}
                className="flex-1 bg-accent text-white hover:bg-accent/90"
              >
                <Copy className="w-3 h-3 mr-1" />
                Use This Content
              </Button>
              <Button size="sm" variant="outline" onClick={() => setGeneratedContent(null)}>
                Discard
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card className="bg-primary/5 border-primary/20">
        <CardContent className="pt-4">
          <div className="text-sm">
            <div className="font-medium text-primary mb-2">Pro Tips:</div>
            <ul className="text-primary/80 space-y-1 text-xs">
              <li>- Be specific about your industry and target audience</li>
              <li>- Mention your unique value proposition</li>
              <li>- Include the tone you want (professional, friendly, etc.)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
