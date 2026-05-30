"use client"

import { Button } from "@/components/ui/button"
import { Printer } from "lucide-react"

export function PrintButton() {
  return (
    <Button
      onClick={() => window.print()}
      className="bg-primary text-white hover:bg-primary/95 rounded-xl shadow-md font-bold flex items-center gap-2 px-5"
    >
      <Printer className="w-4 h-4" />
      Print Certificate
    </Button>
  )
}
