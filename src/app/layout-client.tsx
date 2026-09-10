// src/app/layout-client.tsx
"use client";

import { ThemeProvider } from "@/components/ui/ThemeProvider";
import { SessionProvider } from "@/components/providers/session-provider";
import { Toaster } from "@/components/ui/sonner";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import dynamic from "next/dynamic";
const ChatbotWidget = dynamic(
  () =>
    import("@/components/chatbot/chatbot-widget").then(
      (mod) => mod.ChatbotWidget,
    ),
  { ssr: false },
);
import { ReactNode } from "react";

export default function LayoutClient({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SessionProvider>{children}</SessionProvider>
      <Toaster position="top-center" richColors />
      <Analytics />
      <SpeedInsights />
      <ChatbotWidget />
    </ThemeProvider>
  );
}
