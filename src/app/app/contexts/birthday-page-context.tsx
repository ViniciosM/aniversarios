"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { Birthday } from "@/domain/entities";
import { BirthdayService } from "../service/birthday-service";
import { useSupabase } from "@/app/app/supabase-provider";
import { AppError, AppServerError } from "@/domain/erros";
import { useToast } from "@/lib/hooks/use-toast";
import { defaultToastUnexpectedError } from "@/lib/utils";
import { CreateBirthdayData } from "../service/models/create-bithday-dto";
import { UpdateBirthdayData } from "../service/models/update-birthday-dto";

type BirthdayContextType = {
  birthdays: Birthday[];
  setBirthdays: React.Dispatch<React.SetStateAction<Birthday[]>>;
  addBirthday: (newBirthday: Birthday) => void;
  setBirthdaysList: (birthdays: Birthday[]) => void;
  updateBirthday: (newBirthday: Birthday) => void;
  removeBirthday: (birthdayId: number) => void;
  createBirthday: (
    birthday: CreateBirthdayData,
    onSucess: () => void
  ) => Promise<void>;
  changeBirthday: (
    birthday: UpdateBirthdayData,
    onSucess: () => void
  ) => Promise<void>;
  fetchBirthdays: (
    user_id: string,
    onError: (err: AppError) => void
  ) => Promise<void>;
  deleteBirthday: (
    birthday_id: number,
    onError?: (err: AppError) => void
  ) => Promise<void>;
};

const BirthdayContext = createContext<BirthdayContextType | undefined>(
  undefined
);

export const useBirthdayContext = () => {
  const context = useContext(BirthdayContext);
  if (!context) {
    throw new Error(
      "useBirthdayContext must be used within a BirthdayProvider"
    );
  }
  return context;
};

export const BirthdayProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);

  const supabase = useSupabase();

  const { toast } = useToast();

  const setBirthdaysList = useCallback((birthdays: Birthday[]) => {
    setBirthdays(birthdays.sort((a, b) => a.daysToBirthday - b.daysToBirthday));
  }, []);

  const addBirthday = useCallback((newBirthday: Birthday) => {
    setBirthdays((prevBirthdays) => {
      return [...prevBirthdays, newBirthday];
    });
  }, []);

  const updateBirthday = useCallback((newBirthday: Birthday) => {
    setBirthdays((prevBirthdays) =>
      prevBirthdays.map((birthday) =>
        birthday.id === newBirthday.id ? newBirthday : birthday
      )
    );
  }, []);

  const removeBirthday = useCallback((birthdayId: number) => {
    setBirthdays((prevBirthdays) =>
      prevBirthdays.filter((birthday) => birthday.id !== birthdayId)
    );
  }, []);

  const birthdayService = useMemo(() => {
    console.log("suapabse criando");
    return new BirthdayService(supabase);
  }, [supabase]);

  const createBirthday = async (
    birthday: CreateBirthdayData,
    onSucess: () => void
  ) => {
    try {
      const result = await birthdayService.create({
        name: birthday.name,
        relationship: birthday.relationship,
        observation: birthday.observation,
        date: birthday.date,
        user_id: birthday.user_id,
      });
      if (result instanceof AppServerError) {
        toast({
          variant: "destructive",
          title: "Ocorreu um erro",
          description: "Não foi possível criar o aniversário.",
          duration: 3000,
        });
        return;
      } else {
        addBirthday(result);
        onSucess();
        return;
      }
    } catch (err) {
      defaultToastUnexpectedError();
    }
  };

  const changeBirthday = async (
    birthday: UpdateBirthdayData,
    onSucess: () => void
  ) => {
    try {
      const result = await birthdayService.update(birthday);
      if (result instanceof AppServerError) {
        toast({
          variant: "destructive",
          title: "Ocorreu um erro",
          description: "Não foi possível criar o aniversário.",
          duration: 3000,
        });
        return;
      } else {
        updateBirthday(result);
        onSucess();
        return;
      }
    } catch (err) {
      defaultToastUnexpectedError();
    }
  };

  const fetchBirthdays = useCallback(
    async (user_id: string, onError: (err: AppError) => void) => {
      try {
        const result = await birthdayService.fetchBirthdays(user_id);
        if (result instanceof AppServerError) {
          onError(result);
          toast({
            variant: "destructive",
            title: "Ocorreu um erro",
            description: "Não foi possível carregar os aniversários.",
            duration: 3000,
          });
          return;
        } else {
          setBirthdaysList(result);
          return;
        }
      } catch (err) {
        onError(new AppError("Erro inesperado aconteceu"));
        defaultToastUnexpectedError();
      }
    },
    [birthdayService, setBirthdaysList, toast]
  );

  const deleteBirthday = async (
    birthday_id: number,
    onError?: (err: AppError) => void
  ) => {
    try {
      const result = await birthdayService.delete(birthday_id);
      if (result instanceof AppServerError) {
        onError?.(result);
        toast({
          variant: "destructive",
          title: "Ocorreu um erro",
          description: "Não foi possível excluir o aniversário.",
          duration: 3000,
        });
        return;
      } else {
        removeBirthday(birthday_id);
        return;
      }
    } catch (err) {
      onError?.(new AppError("Erro inesperado aconteceu"));
      defaultToastUnexpectedError();
    }
  };

  return (
    <BirthdayContext.Provider
      value={{
        birthdays,
        setBirthdays,
        setBirthdaysList,
        addBirthday,
        removeBirthday,
        updateBirthday,
        createBirthday,
        changeBirthday,
        fetchBirthdays,
        deleteBirthday,
      }}
    >
      {children}
    </BirthdayContext.Provider>
  );
};
