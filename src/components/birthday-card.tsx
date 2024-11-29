import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Gift,
  Clock,
  Trash2,
  MoreVertical,
  PartyPopper,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui";

interface BirthDayCardProps {
  name: string;
  birthdayDate: Date;
  daysToBirthDay: number;
  onDelete: () => Promise<void>;
  onClick?: (event: React.MouseEvent) => void;
  onRecommendGift: () => void;
}

export function BirthdayCard({
  name,
  birthdayDate,
  onDelete,
  onClick,
  onRecommendGift,
  daysToBirthDay,
}: BirthDayCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const dateFormated = format(birthdayDate, "dd 'de' MMMM", { locale: ptBR });
  const isBirthdayToday = daysToBirthDay === 0;

  return (
    <div>
      <Card
        onClick={onClick}
        className="cursor-pointer relative w-full max-w-md mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <MoreActions
          onDelete={() => setIsDeleteDialogOpen(true)}
          onRecommendGifts={onRecommendGift}
        />
        <div>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              {name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <span className="text-lg">{dateFormated}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Gift className="h-5 w-5" />
              <span className="text-lg sm:text-base xl:text-base 2xl:text-lg">
                Próximo aniversário em:
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-primary">
              {isBirthdayToday ? (
                <>
                  <PartyPopper className="h-6 w-6 text-primary-500" />
                  <span className="text-3xl font-bold">Hoje!</span>
                </>
              ) : (
                <>
                  <Clock className="h-6 w-6" />
                  <span className="text-3xl font-bold">
                    {daysToBirthDay} dias
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
      <DeleteConfirmationDialog
        onDelete={onDelete}
        itemName="aniversário"
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      />
    </div>
  );
}

function MoreActions({
  onDelete,
  onRecommendGifts,
}: {
  onDelete: () => void;
  onRecommendGifts: () => void;
}) {
  return (
    <div className="relative">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 text-muted-foreground"
            aria-label={`Delete ${name}'s birthday`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <MoreVertical className="h-6 w-6" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-2 z-50 absolute">
          <div className="grid gap-2">
            <Button
              variant="ghost"
              className="flex items-center justify-start w-full px-2 py-1.5 text-sm hover:bg-accent hover:text-destructive transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Deletar presente
            </Button>
            <Button
              variant="ghost"
              className="flex items-center justify-start w-full px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                onRecommendGifts();
              }}
            >
              <Gift className="h-4 w-4 mr-2" />
              Recommendar presente
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
