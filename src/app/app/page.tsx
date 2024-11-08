"use client";

import { User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import React from "react";
import BirthdayDetailsForm from "./components/birthday-details-form";
import BirthdayCard from "@/components/birthday-card";
import BirthdayCardSkeletonLoading from "./components/birthday-card-skeleton-loading";
import { useToast } from "@/hooks/use-toast";
import {
  BirthdayProvider,
  useBirthdayContext,
} from "./contexts/birthday-page-context";
import { BirthdayService } from "./service/birthday-service";
import { AppServerError } from "../domain/erros";

function BirthDayListPageContent() {
  const [filter, setFilter] = useState<"all" | "thisMonth">("all");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const { birthdays, updateBirthday, setBirthdays, removeBirthday } =
    useBirthdayContext();

  const loadBirthdays = useCallback(async () => {
    console.log("loadBirthdays");
    setIsLoading(true);
    setError(null);
    const result = await BirthdayService.fetchBirthdays();
    if (result instanceof AppServerError) {
      setError(result);
      toast({
        variant: "destructive",
        title: "Ocorreu um erro",
        description: "Não foi possível carregar a lista de aniversários.",
        duration: 3000,
      });
    } else {
      setBirthdays(result);
    }
    setIsLoading(false);
  }, [toast, setBirthdays]);

  const deleteBirthday = useCallback(
    async (birthdayId: number) => {
      setError(null);
      const result = await BirthdayService.delete(birthdayId);
      if (result instanceof AppServerError) {
        setError(result);
        toast({
          variant: "destructive",
          title: "Ocorreu um erro",
          description: "Não foi possível deletar o aniversários.",
          duration: 3000,
        });
      } else {
        removeBirthday(result);
      }
    },
    [toast, removeBirthday]
  );

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

  useEffect(() => {
    loadBirthdays();
  }, [loadBirthdays]);

  return (
    <AppSidebar>
      <header className="flex h-16 shrink-0 items-center justify-between border-b px-4">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="mr-2 h-4" />
          <h1 className="text-xl font-semibold">Lista de aniversários</h1>
        </div>
        <Button variant="ghost" size="icon">
          <User className="h-6 w-6" />
        </Button>
      </header>
      <div className="flex h-screen bg-background">
        <div className="flex-1 p-4 md:p-6 ">
          <div className="flex gap-4 mb-6">
            <Button
              variant={filter === "all" ? "default" : "ghost"}
              onClick={() => setFilter("all")}
              size="sm"
            >
              Todos
            </Button>
            <Button
              variant={filter === "thisMonth" ? "default" : "ghost"}
              onClick={() => setFilter("thisMonth")}
              size="sm"
            >
              Este mês
            </Button>
          </div>
          {isLoading ? (
            <BirthdayCardSkeletonLoading />
          ) : error ? (
            <div className="flex flex-col items-center justify-center text-center h-[90%]">
              <p className="text-red-400 mb-4">
                Ocorreu um erro ao carregar os aniversários.
              </p>
              <Button onClick={loadBirthdays}>Tentar novamente</Button>
            </div>
          ) : filteredBirthdays.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center h-[90%]">
              <p className="text-center text-gray-500">
                Nenhum aniversário encontrado para o filtro selecionado.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6 mb-4">
                {filteredBirthdays.map((birthday, index) => (
                  <BirthdayDetailsForm
                    key={index}
                    initialData={birthday}
                    onBirthdayDataUpdated={updateBirthday}
                  >
                    <BirthdayCard
                      name={birthday.name}
                      brithDayDate={birthday.date}
                    />
                  </BirthdayDetailsForm>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </AppSidebar>
  );
}

export default function BirthDayListPage() {
  return (
    <BirthdayProvider>
      <BirthDayListPageContent />
    </BirthdayProvider>
  );
}
