import { BirthdayCard } from "@/components/birthday-card";
import { BirthdayDetailsForm } from "./birthday-details-form";
import { useBirthdayContext } from "../contexts/birthday-page-context";
import { useCallback, useMemo, useState } from "react";
import { Birthday } from "@/lib/domain/entities";
import FilterButtons from "./birthday-filter-buttons";
import BirthdayRecommendedGifts from "./birthday-recommend-gifts";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { todayDate } from "../../../lib/utils";
import { ptBR } from "date-fns/locale";
import { format } from "date-fns";

export default function BirthdayList() {
  const { birthdays, deleteBirthday } = useBirthdayContext();
  const [filter, setFilter] = useState<"all" | "thisMonth">("all");
  const [isBirthdayFormOpen, setIsBirthdayFormOpen] = useState(false);
  const [isBirthdayRecommendedGiftsOpen, setIsBirthdayRecommendedGifts] =
    useState(false);

  const [selectedBirthday, setSelectedBirthday] = useState<
    Birthday | undefined
  >();

  const filteredBirthdays = useMemo(() => {
    const currentMonth = new Date().getMonth();
    if (filter === "thisMonth") {
      return birthdays.filter((birthday) => {
        const birthdayMonth = birthday.date.getMonth();
        return birthdayMonth === currentMonth;
      });
    }
    return birthdays;
  }, [filter, birthdays]);

  const openBirthdayForm = (birthday?: Birthday | undefined) => {
    setSelectedBirthday(birthday);
    setIsBirthdayFormOpen(true);
  };

  const openBirthdayRecommendedGifts = (birthday: Birthday) => {
    setSelectedBirthday(birthday);
    setIsBirthdayRecommendedGifts(true);
  };

  const deleteBirthdayAction = useCallback(
    async (birthdayId: number) => {
      deleteBirthday(birthdayId);
    },
    [deleteBirthday]
  );

  if (birthdays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-[80vh]">
        <p className="text-gray-500 mb-4">Nenhum aniversário encontrado.</p>
        <Button
          onClick={() => openBirthdayForm()}
          className="flex items-center"
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Adicionar Aniversário
        </Button>
        <BirthdayDetailsForm
          isOpen={isBirthdayFormOpen}
          onOpenChange={setIsBirthdayFormOpen}
        />
      </div>
    );
  }

  if (filteredBirthdays.length === 0) {
    const currentMonth = format(todayDate(), "MMMM", { locale: ptBR });
    return (
      <>
        <FilterButtons
          filter={filter}
          onFilterChange={setFilter}
        ></FilterButtons>
        <div className="flex flex-col items-center justify-center text-center h-[80vh]">
          <p className="text-gray-500 mb-4">
            Nenhum aniversário foi encontrado no mês de {currentMonth}.
          </p>
        </div>
      </>
    );
  }
  return (
    <>
      <FilterButtons filter={filter} onFilterChange={setFilter}></FilterButtons>
      <div className="space-y-2">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-4">
          {filteredBirthdays.map((birthday) => (
            <div key={birthday.id}>
              <BirthdayCard
                name={birthday.name}
                birthdayDate={birthday.date}
                daysToBirthDay={birthday.daysToBirthday}
                onDelete={() => {
                  return deleteBirthdayAction(birthday.id!);
                }}
                onRecommendGift={() => {
                  openBirthdayRecommendedGifts(birthday);
                }}
                onClick={() => openBirthdayForm(birthday)}
              />
            </div>
          ))}
          <BirthdayDetailsForm
            initialData={selectedBirthday}
            isOpen={isBirthdayFormOpen}
            onOpenChange={setIsBirthdayFormOpen}
          />
          <BirthdayRecommendedGifts
            birthday_id={selectedBirthday?.id}
            isOpen={isBirthdayRecommendedGiftsOpen}
            onOpenChange={setIsBirthdayRecommendedGifts}
          ></BirthdayRecommendedGifts>
        </div>
      </div>
    </>
  );
}
