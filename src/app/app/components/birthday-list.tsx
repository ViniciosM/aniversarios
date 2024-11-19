import { BirthdayCard } from "@/components/birthday-card";
import { BirthdayDetailsForm } from "./birthday-details-form";
import { useBirthdayContext } from "../contexts/birthday-page-context";
import { useCallback, useMemo, useState } from "react";
import { Birthday } from "@/domain/entities";
import FilterButtons from "./birthday-filter-buttons";

export default function BirthdayList() {
  const { birthdays, deleteBirthday } = useBirthdayContext();
  const [filter, setFilter] = useState<"all" | "thisMonth">("all");
  const [isBirthdayFormOpen, setIsBirthdayFormOpen] = useState(false);
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

  const openBirthdayForm = (birthday: Birthday) => {
    setSelectedBirthday(birthday);
    setIsBirthdayFormOpen(true);
  };

  const deleteBirthdayAction = useCallback(
    async (birthdayId: number) => {
      deleteBirthday(birthdayId);
    },
    [deleteBirthday]
  );

  if (filteredBirthdays.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-[80%]">
        <p className="text-center text-gray-500">
          Nenhum aniversário encontrado.
        </p>
      </div>
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
                onClick={() => openBirthdayForm(birthday)}
              />
            </div>
          ))}
          <BirthdayDetailsForm
            initialData={selectedBirthday}
            isOpen={isBirthdayFormOpen}
            onOpenChange={setIsBirthdayFormOpen}
          />
        </div>
      </div>
    </>
  );
}
