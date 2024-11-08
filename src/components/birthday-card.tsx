import { useState, useEffect, forwardRef } from "react";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Gift, Clock } from "lucide-react";
import { Slot } from "@radix-ui/react-slot";

interface BirthDayCardProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  name: string;
  brithDayDate: Date;
  asChild?: boolean;
}

const BirthDayCard = forwardRef<HTMLButtonElement, BirthDayCardProps>(
  ({ name, brithDayDate, asChild, ...props }, ref) => {
    const [daysToBirthDay, setDaysToBirthDay] = useState(0);

    useEffect(() => {
      const calcularDiasAteAniversario = () => {
        const todayDate = new Date();
        brithDayDate.setFullYear(todayDate.getFullYear());

        if (brithDayDate < todayDate) {
          brithDayDate.setFullYear(todayDate.getFullYear() + 1);
        }

        const difference = brithDayDate.getTime() - todayDate.getTime();
        const days = Math.ceil(difference / (1000 * 3600 * 24));
        setDaysToBirthDay(days);
      };

      calcularDiasAteAniversario();
    }, [brithDayDate]);

    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref}
        className="w-full max-w-md mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300"
        {...props}
      >
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
                {new Date(brithDayDate).toLocaleDateString("pt-BR", {
                  day: "2-digit",
                  month: "long",
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
      </Component>
    );
  }
);

BirthDayCard.displayName = "BirthDayCard";

export default BirthDayCard;
