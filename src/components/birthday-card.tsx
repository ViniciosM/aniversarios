import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Gift, Clock, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { DeleteConfirmationDialog } from "./delete-confirmation-dialog";

interface BirthDayCardProps {
  name: string;
  birthdayDate: Date;
  daysToBirthDay: number;
  onDelete: () => Promise<void>;
  onClick?: (event: React.MouseEvent) => void;
}

export function BirthdayCard({
  name,
  birthdayDate,
  onDelete,
  onClick,
  daysToBirthDay,
}: BirthDayCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  return (
    <div>
      <Card
        onClick={onClick}
        className="cursor-pointer relative w-full max-w-md mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300"
      >
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 text-muted-foreground hover:text-destructive"
          aria-label={`Delete ${name}'s birthday`}
          onClick={(e) => {
            e.stopPropagation();
            setIsDeleteDialogOpen(true);
          }}
        >
          <Trash2 className="h-5 w-5" />
        </Button>

        <div>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-primary">
              {name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <span className="text-lg">
                {format(birthdayDate, "dd 'de' MMMM", {
                  locale: ptBR,
                })}
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-muted-foreground">
              <Gift className="h-5 w-5" />
              <span className="text-lg sm:text-base xl:text-base 2xl:text-lg">
                Próximo aniversário em:
              </span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-primary">
              <Clock className="h-6 w-6" />
              <span className="text-3xl font-bold">{daysToBirthDay} dias</span>
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
