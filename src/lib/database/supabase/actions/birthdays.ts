/* eslint-disable @typescript-eslint/no-explicit-any */
import { Birthday } from "@/lib/domain/entities";
import { AppServerError } from "@/lib/domain/erros";
import {
    calculateAge,
    calculateDaysUntilBirthday,
    todayDate,
} from "@/lib/utils";
import { SupabaseClient } from "@supabase/supabase-js";
import { parseISO } from "date-fns";
import { SupabaseSchema } from "../supabase-schema";
import { UpdateBirthdayData } from "../../dtos/update-birthday-dto";

export const fetchBirthdays = async (
    supabase: SupabaseClient,
    userId: string,
): Promise<Birthday[] | AppServerError> => {
    try {
        const { data, error } = await supabase
            .from("birthdays")
            .select(`
                id,
                name,
                date,
                relationship,
                observation,
                user_id,
                recommended_gifts ( 
                    id, 
                    name, 
                    description 
                )
            `)
            .eq("user_id", userId)
            .order("date", { ascending: true });

        if (error) {
            return new AppServerError(error.message, 400);
        }

        const parsedBirthdays = data.map((birthday) => {
            return parseBirthdays(birthday);
        });

        return parsedBirthdays;
    } catch (err) {
        return new AppServerError("Failed to fetch birthdays", 400);
    }
};

export const createBirthday = async (
    supabase: SupabaseClient<SupabaseSchema>,
    birthday: Birthday,
): Promise<Birthday | AppServerError> => {
    try {
        const createBirthday:
            SupabaseSchema["public"]["Tables"]["birthdays"]["Insert"] = {
                name: birthday.name,
                date: birthday.date.toISOString(),
                relationship: birthday.relationship,
                observation: birthday.observation,
                user_id: birthday.user_id,
            };
        const { data, error } = await supabase
            .from("birthdays")
            .insert([createBirthday])
            .select()
            .single();

        if (error) {
            return new AppServerError(error.message, 400);
        }
        const parsedData = parseBirthday(data);

        return parsedData;
    } catch (err) {
        return new AppServerError("Failed to create birthday", 400);
    }
};

export const updateBirthday = async (
    supabase: SupabaseClient,
    birthday: UpdateBirthdayData,
): Promise<Birthday | AppServerError> => {
    try {
        const { data, error } = await supabase
            .from("birthdays")
            .update(birthday)
            .eq("id", birthday.id)
            .select()
            .single();

        if (error) {
            return new AppServerError(error.message, 400);
        }

        const parsedData = parseBirthday(data);

        return parsedData;
    } catch (err) {
        return new AppServerError("Failed to update birthday", 400);
    }
};

export const deleteBirthday = async (
    supabase: SupabaseClient,
    birthdayId: number,
): Promise<number | AppServerError> => {
    try {
        const { error } = await supabase
            .from("birthdays")
            .delete()
            .eq("id", birthdayId);

        if (error) {
            return new AppServerError(error.message, 400);
        }

        return birthdayId;
    } catch (err) {
        return new AppServerError("Failed to delete birthday", 400);
    }
};
export const recommendGifts = async (
    supabase: SupabaseClient<SupabaseSchema>,
    birthday: Birthday,
): Promise<Birthday | AppServerError> => {
    try {
        const age = calculateAge(birthday.date);
        const { data, error } = await supabase.functions.invoke(
            "recommend-gifts",
            {
                method: "POST",
                body: {
                    relationship: birthday.relationship,
                    age: age,
                    characteristics: birthday.observation ?? undefined,
                    birthday_id: birthday.id,
                },
            },
        );

        if (error) {
            console.error(error);
            return new AppServerError(error.message, 400);
        }

        return {
            ...birthday,
            recommendadedGifts: data,
        };
    } catch (err) {
        console.error(err);
        return new AppServerError("Failed to delete birthday", 400);
    }
};

const parseBirthday = (
    data: SupabaseSchema["public"]["Tables"]["birthdays"]["Row"],
) => {
    const parsedDate = parseISO(data.date as string);
    const result: Birthday = {
        id: data.id,
        name: data.name,
        date: parsedDate,
        relationship: data.relationship,
        observation: data.observation ?? undefined,
        user_id: data.user_id,
        daysToBirthday: calculateDaysUntilBirthday(
            parsedDate,
            todayDate(),
        ),
    };

    return result;
};

const parseBirthdays = (
    data: {
        id: any;
        name: any;
        date: any;
        relationship: any;
        observation: any;
        user_id: any;
        recommended_gifts: {
            id: any;
            name: any;
            description: any;
        }[];
    },
) => {
    const parsedDate = parseISO(data.date as string);
    const result: Birthday = {
        id: data.id,
        name: data.name,
        date: parsedDate,
        relationship: data.relationship,
        observation: data.observation,
        user_id: data.user_id,
        daysToBirthday: calculateDaysUntilBirthday(
            parsedDate,
            todayDate(),
        ),
        recommendadedGifts: data.recommended_gifts.map((gift) => ({
            id: gift.id,
            name: gift.name,
            description: gift.description,
        })),
    };

    return result;
};
