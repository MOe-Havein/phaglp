"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Wand2,
  Loader2,
  FileText,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";
import { toast } from "sonner";

interface AIAssistantPanelProps {
  title?: string;
  category?: string;
  content?: string;
  onInsertContent?: (content: string) => void;
  onSetCategory?: (category: string) => void;
  onSetSlug?: (slug: string) => void;
}

export function AIAssistantPanel({
  title,
  category,
  content,
  onInsertContent,
  onSetCategory,
  onSetSlug,
}: AIAssistantPanelProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [resultDialogOpen, setResultDialogOpen] = useState(false);
  const [resultType, setResultType] = useState<string>("");
  const [copied, setCopied] = useState(false);

  async function handleAIAction(
    type: "outline" | "summary" | "fallacy-check" | "write-lecture",
  ) {
    setLoading(true);
    setResultType(type);

    try {
      let data: Record<string, any> = {};

      if (type === "outline" || type === "write-lecture") {
        if (!title) {
          toast.error("Please enter a title first");
          setLoading(false);
          return;
        }
        data = { title, category };
      } else {
        if (!content || content.trim().length === 0) {
          toast.error("Please write some content first");
          setLoading(false);
          return;
        }
        data = { content };
      }

      const response = await fetch("/api/ai/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, data }),
      });

      const responseData = await response.json();

      if (!response.ok || !responseData.success) {
        throw new Error(responseData.error || "Failed to generate content");
      }

      setResult(responseData.content);
      setResultDialogOpen(true);
      toast.success("AI generation complete!");
    } catch (error) {
      console.error("AI generation error:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to generate content",
      );
    } finally {
      setLoading(false);
    }
  }

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const generateSlug = (text: string): string => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "") // Remove special characters
      .replace(/\s+/g, "-") // Replace spaces with hyphens
      .replace(/-+/g, "-") // Replace multiple hyphens with single
      .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens
  };

  const extractCategoryFromContent = (content: string): string => {
    // Try to find category in common patterns
    const categoryMatch = content.match(
      /(?:category|topic|subject):\s*([\w\s,]+)/i,
    );
    const matchVal = categoryMatch?.[1];
    if (matchVal) {
      const parts = matchVal.split(",");
      const firstPart = parts[0];
      if (firstPart) {
        return firstPart.trim();
      }
    }
    // Default to the category prop if available
    return category || "";
  };

  const handleInsert = () => {
    if (result && onInsertContent) {
      onInsertContent(result);
      setResultDialogOpen(false);
      toast.success("Inserted into editor");

      // Auto-fill slug and category for write-lecture
      if (resultType === "write-lecture" && title) {
        // Generate slug from title
        if (onSetSlug) {
          const slug = generateSlug(title);
          onSetSlug(slug);
        }

        // Extract and set category if not already set
        if (onSetCategory && !category) {
          const extractedCategory = extractCategoryFromContent(result);
          if (extractedCategory) {
            onSetCategory(extractedCategory);
          }
        }
      }
    }
  };

  const getActionLabel = () => {
    switch (resultType) {
      case "outline":
        return "Outline";
      case "summary":
        return "Summary";
      case "fallacy-check":
        return "Fallacy Analysis";
      case "write-lecture":
        return "Generated Lecture";
      default:
        return "Result";
    }
  };

  return (
    <>
      <Card className="bg-emerald-50 border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2 text-emerald-700 dark:text-emerald-400">
            <Wand2 className="h-4 w-4" /> AI Assistant
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-xs leading-relaxed text-emerald-600 dark:text-emerald-500">
            Generate outlines, summaries, or check for logical fallacies using
            our AI engine.
          </p>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={loading}
                className="w-full bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-3 w-3" />
                    AI Actions
                  </>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem onClick={() => handleAIAction("write-lecture")}>
                <Wand2 className="mr-2 h-4 w-4" />
                Write Full Lecture
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAIAction("outline")}>
                <FileText className="mr-2 h-4 w-4" />
                Generate Outline
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAIAction("summary")}>
                <FileText className="mr-2 h-4 w-4" />
                Summarize Content
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleAIAction("fallacy-check")}>
                <AlertCircle className="mr-2 h-4 w-4" />
                Check for Fallacies
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardContent>
      </Card>

      <Dialog open={resultDialogOpen} onOpenChange={setResultDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>AI {getActionLabel()}</DialogTitle>
            <DialogDescription>
              Review the AI-generated content below
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="prose prose-sm dark:prose-invert max-w-none bg-slate-50 dark:bg-slate-900 p-4 rounded-lg">
              <pre className="whitespace-pre-wrap font-sans text-sm">
                {result}
              </pre>
            </div>

            <div className="flex gap-2 justify-end">
              <Button variant="outline" size="sm" onClick={handleCopy}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
              {(resultType === "outline" || resultType === "write-lecture") &&
                onInsertContent && (
                  <Button
                    size="sm"
                    onClick={handleInsert}
                    className="bg-emerald-600 hover:bg-emerald-700"
                  >
                    Insert into Editor
                  </Button>
                )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
