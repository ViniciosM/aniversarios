import { Birthday } from './../../domain/entities';
import { AppServerError } from "@/app/domain/erros";
import { supabase } from "@/lib/supabase";
import { calculateDaysUntilBirthday, todayDate } from '@/lib/utils';
import { parseISO } from "date-fns";

export type UpdateBirthdayData = {
    id: number;
    name?: string;
    date?: string;
    relationship?: string;
    observation?: string;
};

export type CreateBirthdayData = {
    name: string,
    date: string,
    relationship: string,
    observation?: string,
    user_id: string,
}

export abstract class BirthdayService {
    static async fetchBirthdays(userId: string): Promise<Birthday[] | AppServerError> {
        try {
            const { data, error } = await supabase
                .from('birthdays')
                .select(`
                        id,
                        name,
                        date,
                        relationship,
                        observation,
                        recommended_gifts ( 
                            id, 
                            name, 
                            description 
                        )
                `)
                .eq('user_id', userId)
                .order('date', { ascending: true });

            if (error) {
                return new AppServerError(error.message, 400);
            }

            const today = todayDate();
            
            const parsedBirthdays = (data).map(birthday => {
                birthday.date = parseISO(birthday.date as string);
                const daysToBirthday = calculateDaysUntilBirthday( birthday.date, today)
                return { ...birthday, daysToBirthday};
            });
            return parsedBirthdays;
        } catch (err) {
            return new AppServerError("Failed to fetch birthdays", 400);
        }
    }

    static async create(birthday: CreateBirthdayData): Promise<Birthday | AppServerError> {
        try {
            const { data, error } = await supabase
                .from('birthdays')
                .insert([
                    birthday,
                ])
                .select()

            if (error) {
                return new AppServerError(error.message, 400);
            }
             const today = todayDate();

            const parsedBirthdays = (data).map(birthday => {
                birthday.date = parseISO(birthday.date as string);
                const daysToBirthday = calculateDaysUntilBirthday( birthday.date, today)
                return { ...birthday, daysToBirthday};
            });

            return parsedBirthdays.at(0)!;
        } catch (err) {
            return new AppServerError("Failed to create birthdays", 400);
        }
    }


    static async update(birthday: UpdateBirthdayData): Promise<Birthday | AppServerError> {
        try {
            const { data, error } = await supabase
                .from('birthdays')
                .update(birthday)
                .eq('id', birthday.id)
                .select();

            if (error) {
                return new AppServerError(error.message, 400);
            }
            const today = todayDate();
            const parsedBirthdays = (data).map(birthday => {
                birthday.date = parseISO(birthday.date as string);
                const daysToBirthday = calculateDaysUntilBirthday( birthday.date, today)
                return { ...birthday, daysToBirthday};
            });

            return parsedBirthdays.at(0)!;
        } catch (err) {
            return new AppServerError("Failed to update birthdays", 400);
        }
    }

    static async delete(birthdayId: number): Promise<number | AppServerError> {
        try {
            const { error } = await supabase
                .from('birthdays')
                .delete()
                .eq('id', birthdayId)
                .select();

            if (error) {
                return new AppServerError(error.message, 400);
            }
            return birthdayId;
        } catch (err) {
            return new AppServerError("Failed to delete birthdays", 400);
        }
    }
}
