"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { Birthday } from "@/app/domain/entities";

type BirthdayContextType = {
  birthdays: Birthday[];
  setBirthdays: React.Dispatch<React.SetStateAction<Birthday[]>>;
  addBirthday: (newBirthday: Birthday) => void;
  updateBirthday: (newBirthday: Birthday) => void;
  removeBirthday: (birthdayId: number) => void;
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

  const addBirthday = useCallback((newBirthday: Birthday) => {
    setBirthdays((prevBirthdays) => {
      return [...prevBirthdays, newBirthday].sort(
        (a, b) => a.daysToBirthday - b.daysToBirthday
      );
    });
  }, []);

  const updateBirthday = useCallback((newBirthday: Birthday) => {
    setBirthdays((prevBirthdays) =>
      prevBirthdays
        .map((birthday) =>
          birthday.id === newBirthday.id ? newBirthday : birthday
        )
        .sort((a, b) => a.daysToBirthday - b.daysToBirthday)
    );
  }, []);

  const removeBirthday = useCallback((birthdayId: number) => {
    setBirthdays((prevBirthdays) =>
      prevBirthdays.filter((birthday) => birthday.id !== birthdayId)
    );
  }, []);

  return (
    <BirthdayContext.Provider
      value={{
        birthdays,
        setBirthdays,
        addBirthday,
        removeBirthday,
        updateBirthday,
      }}
    >
      {children}
    </BirthdayContext.Provider>
  );
};
