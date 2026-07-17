"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ModelSelector, useDefaultAIModel } from "@/components/model-selector";

export function DefaultAIModelCard() {
  const { model: aiModel, setModel: setAiModel } = useDefaultAIModel();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Default AI Model</CardTitle>
        <CardDescription>
          Choose the AI model that powers generative features across the
          platform. Your selection is saved to your profile automatically.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ModelSelector value={aiModel || ""} onChange={setAiModel} />
      </CardContent>
    </Card>
  );
}
