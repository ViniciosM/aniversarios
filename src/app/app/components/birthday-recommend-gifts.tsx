"use client";

import { useState, useCallback } from "react";
import { RecommendadedGift } from "../../../lib/domain/entities";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBirthdayContext } from "../contexts/birthday-page-context";

export default function BirthdayRecommendedGifts({
  birthday_id,
  isOpen,
  onOpenChange,
}: {
  birthday_id: number | undefined;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [isRecommending, setIsRecommending] = useState(false);
  const birthdayContext = useBirthdayContext();

  const birthday = birthdayContext.birthdays.find((b) => b.id === birthday_id);

  const handleRecommend = useCallback(async () => {
    if (birthday === undefined) return;
    await birthdayContext.recommendGifts(birthday, () => {});
  }, [birthdayContext, birthday]);

  if (birthday === undefined) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-lg w-[90%] sm:max-w-[425px] md:max-w-[600px] lg:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Presentes Recomendados para {birthday.name}</DialogTitle>
          <DialogDescription>
            Aqui estão algumas ideias de presentes para o aniversário de{" "}
            {birthday.name} em {birthday.date.toLocaleDateString()}.
          </DialogDescription>
        </DialogHeader>
        {isRecommending ? (
          <SkeletonCard></SkeletonCard>
        ) : (
          <RecommendedList
            recommendedGifts={birthday.recommendadedGifts ?? []}
          />
        )}
        <div className="mt-4 flex justify-center">
          <Button
            onClick={() => {
              setIsRecommending(true);
              handleRecommend().then(() => setIsRecommending(false));
            }}
            disabled={isRecommending}
          >
            {isRecommending ? "Recomendando..." : "Recomendar Presentes"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function RecommendedList({
  recommendedGifts,
}: {
  recommendedGifts: RecommendadedGift[];
}) {
  return (
    <ScrollArea className="h-[60vh] rounded-md border p-4">
      <div className="grid gap-4 sm:grid-cols-2 ">
        {recommendedGifts?.map((gift) => (
          <Card key={gift.id} className="flex flex-col justify-between">
            <CardHeader>
              <CardTitle className="text-lg">{gift.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>{gift.description}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

function SkeletonCard() {
  return (
    <ScrollArea className="h-[60vh] rounded-md border p-4">
      <div className="grid gap-4 sm:grid-cols-2 ">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card
            className="flex flex-col justify-between animate-pulse"
            key={index}
          >
            <CardHeader>
              <div className="h-6 bg-gray-300 rounded-md w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-4 bg-gray-300 rounded-md w-full mb-2"></div>
              <div className="h-4 bg-gray-300 rounded-md w-5/6"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}
