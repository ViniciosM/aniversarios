"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Birthday } from "@/lib/domain/entities";
import { useDatabase } from "@/app/app/database-provider";
import { AppError, AppServerError } from "@/lib/domain/erros";
import { useToast } from "@/lib/hooks/use-toast";
import { defaultToastUnexpectedError } from "@/lib/utils";
import { UpdateBirthdayData } from "../../../lib/database/dtos/update-birthday-dto";

type BirthdayContextType = {
  birthdays: Birthday[];
  setBirthdays: React.Dispatch<React.SetStateAction<Birthday[]>>;
  addBirthday: (newBirthday: Birthday) => void;
  setBirthdaysList: (birthdays: Birthday[]) => void;
  updateBirthday: (newBirthday: Birthday) => void;
  removeBirthday: (birthdayId: number) => void;
  createBirthday: (birthday: Birthday, onSucess: () => void) => Promise<void>;
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
  recommendGifts: (
    birthday: Birthday,
    onSucess: (birthday: Birthday) => void
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

  const database = useDatabase();

  const { toast } = useToast();

  const sortBirthdays = (birthdays: Birthday[]) =>
    birthdays.sort((a, b) => a.daysToBirthday - b.daysToBirthday);

  const setBirthdaysList = useCallback((birthdays: Birthday[]) => {
    setBirthdays(sortBirthdays([...birthdays]));
  }, []);

  const addBirthday = useCallback((newBirthday: Birthday) => {
    setBirthdays((prevBirthdays) =>
      sortBirthdays([...prevBirthdays, newBirthday])
    );
  }, []);

  const updateBirthday = useCallback((newBirthday: Birthday) => {
    setBirthdays((prevBirthdays) =>
      sortBirthdays(
        prevBirthdays.map((birthday) =>
          birthday.id === newBirthday.id
            ? {
                ...newBirthday,
                recommendadedGifts: birthday.recommendadedGifts,
              }
            : birthday
        )
      )
    );
  }, []);

  const removeBirthday = useCallback((birthdayId: number) => {
    setBirthdays((prevBirthdays) =>
      sortBirthdays(
        prevBirthdays.filter((birthday) => birthday.id !== birthdayId)
      )
    );
  }, []);

  const createBirthday = async (birthday: Birthday, onSucess: () => void) => {
    try {
      const result = await database.createBirthday(birthday);
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
      const result = await database.updateBirthday(birthday);
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
        const result = await database.fetchBirthdays(user_id);
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
    [setBirthdaysList, toast, database]
  );

  const deleteBirthday = async (
    birthday_id: number,
    onError?: (err: AppError) => void
  ) => {
    try {
      const result = await database.deleteBirthday(birthday_id);
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

  const recommendGifts = async (
    birthday: Birthday,
    onSucess: (birthday: Birthday) => void
  ) => {
    try {
      const result = await database.recommendGifts(birthday);
      if (result instanceof AppServerError) {
        toast({
          variant: "destructive",
          title: "Ocorreu um erro",
          description: "Não foi possível recomendar o aniversário.",
          duration: 3000,
        });
        return;
      } else {
        updateBirthday(result);
        onSucess(result);
        return;
      }
    } catch (err) {
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
        recommendGifts,
      }}
    >
      {children}
    </BirthdayContext.Provider>
  );
};
