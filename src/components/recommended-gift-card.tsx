"use client";

import { Card, CardContent } from "./ui/card";
interface RecommendadedGiftProps {
  title: string;
  description: string;
}
export function RecommendadedGiftCard({
  title,
  description,
}: RecommendadedGiftProps) {
  return (
    <Card className="cursor-pointer hover:bg-muted/50 transition-colors">
      <CardContent className="p-4">
        <h3 className="font-medium mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  );
}
