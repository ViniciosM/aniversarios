import { Birthday } from '../../../domain/entities';
import { AppServerError } from "@/domain/erros";
import { calculateDaysUntilBirthday, todayDate } from '@/lib/utils';
import { SupabaseClient } from '@supabase/supabase-js';
import { parseISO } from "date-fns";
import { CreateBirthdayData } from './models/create-bithday-dto';
import { UpdateBirthdayData } from './models/update-birthday-dto';


export class BirthdayService {
    supabase: SupabaseClient;
    constructor(supabase: SupabaseClient) {
        this.supabase = supabase;
    }
    async fetchBirthdays(userId: string): Promise<Birthday[] | AppServerError> {
        try {
            const { data, error } = await this.supabase
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

            const parsedBirthdays = (data).map((birthday) => {
                birthday.date = parseISO(birthday.date as string);
                const daysToBirthday = calculateDaysUntilBirthday(birthday.date, today)
                return { ...birthday, daysToBirthday, user_id: userId };
            });
            return parsedBirthdays;
        } catch (err) {
            return new AppServerError("Failed to fetch birthdays", 400);
        }
    }

    async create(birthday: CreateBirthdayData): Promise<Birthday | AppServerError> {
        try {
            const { data, error } = await this.supabase
                .from('birthdays')
                .insert([
                    birthday,
                ])
                .select()

            if (error) {
                return new AppServerError(error.message, 400);
            }
            const today = todayDate();

            const parsedBirthdays = (data).map((birthday) => {
                birthday.date = parseISO(birthday.date as string);
                const daysToBirthday = calculateDaysUntilBirthday(birthday.date, today)
                return { ...birthday, daysToBirthday };
            });

            return parsedBirthdays.at(0)!;
        } catch (err) {
            return new AppServerError("Failed to create birthdays", 400);
        }
    }


    async update(birthday: UpdateBirthdayData): Promise<Birthday | AppServerError> {
        try {
            const { data, error } = await this.supabase
                .from('birthdays')
                .update(birthday)
                .eq('id', birthday.id)
                .select();

            if (error) {
                return new AppServerError(error.message, 400);
            }
            const today = todayDate();
            const parsedBirthdays = (data).map((birthday) => {
                birthday.date = parseISO(birthday.date as string);
                const daysToBirthday = calculateDaysUntilBirthday(birthday.date, today)
                return { ...birthday, daysToBirthday };
            });

            return parsedBirthdays.at(0)!;
        } catch (err) {
            return new AppServerError("Failed to update birthdays", 400);
        }
    }

    async delete(birthdayId: number): Promise<number | AppServerError> {
        try {
            const { error } = await this.supabase
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
