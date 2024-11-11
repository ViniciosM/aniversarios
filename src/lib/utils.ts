import { clsx, type ClassValue } from "clsx"
import { parseISO } from "date-fns";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const minimumDate = parseISO("1900-01-01");

export const todayDate = () => {
 const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

 export const calculateDaysUntilBirthday = (birthdayDate: Date, todayDate: Date) => {
      const birthday = new Date(birthdayDate);
      birthday.setFullYear(todayDate.getFullYear());

      if (birthday < todayDate) {
        birthday.setFullYear(todayDate.getFullYear() + 1);
      }

      const difference = birthday.getTime() - todayDate.getTime();
      const days = Math.ceil(difference / (1000 * 3600 * 24));
      return days;
    };