"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Database, Loader2, CheckCircle2, XCircle } from "lucide-react"
import { toast } from "sonner"

export default function AdminUtilitiesPage() {
  const [seeding, setSeeding] = useState(false)
  const [seedStatus, setSeedStatus] = useState<"idle" | "success" | "error">("idle")

  async function seedKnowledgeBase() {
    setSeeding(true)
    setSeedStatus("idle")

    try {
      const response = await fetch("/api/control/seed-knowledge", {
        method: "POST",
      })

      const data = await response.json()

      if (data.success) {
        setSeedStatus("success")
        toast.success("Knowledge base seeded successfully!")
      } else {
        setSeedStatus("error")
        toast.error(data.error || "Failed to seed knowledge base")
      }
    } catch (error) {
      console.error("Error seeding knowledge base:", error)
      setSeedStatus("error")
      toast.error("Failed to seed knowledge base")
    } finally {
      setSeeding(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Utilities</h1>
        <p className="text-muted-foreground mt-2">Database management and system utilities</p>
      </div>

      <div className="grid gap-6 max-w-2xl">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Seed Knowledge Base
            </CardTitle>
            <CardDescription>
              Populate the chatbot knowledge base with course and matching information. Run this
              once after setting up the database.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Button onClick={seedKnowledgeBase} disabled={seeding} className="w-40">
                {seeding && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Seed Database
              </Button>

              {seedStatus === "success" && (
                <div className="flex items-center gap-2 text-green-600">
                  <CheckCircle2 className="h-5 w-5" />
                  <span className="text-sm font-medium">Seeded successfully!</span>
                </div>
              )}

              {seedStatus === "error" && (
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-5 w-5" />
                  <span className="text-sm font-medium">Seeding failed</span>
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground mt-4">
              This will add 9 knowledge base entries about courses, marriage matching, and platform
              features. The chatbot uses these entries to answer user questions.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
