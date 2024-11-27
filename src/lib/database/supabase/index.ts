import { SUPABASE_ANON_KEY, SUPABASE_URL } from "@/lib/const";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { Database } from "../database";
import { SupabaseSchema } from "./supabase-schema";
import { Birthday } from "@/lib/domain/entities";
import { AppServerError } from "@/lib/domain/erros";
import {
    createBirthday,
    deleteBirthday,
    fetchBirthdays,
    recommendGifts,
    updateBirthday,
} from "./actions/birthdays";
import { UpdateBirthdayData } from "../dtos/update-birthday-dto";

export class SupaClientDatabase implements Database {
    name = "supabase";
    supabase: SupabaseClient | null = null;

    async connect({
        customAccessToken,
    }: {
        customAccessToken: string;
    }): Promise<void> {
        if (!this.supabase) {
            this.supabase = createClient<SupabaseSchema>(
                SUPABASE_URL,
                SUPABASE_ANON_KEY,
                {
                    global: {
                        headers: {
                            Authorization: `Bearer ${customAccessToken}`,
                        },
                    },
                    auth: {
                        persistSession: false,
                    },
                },
            );
        }
    }

    async disconnect(): Promise<void> {}

    /// -----------     BIRTHDAY -----------
    async fetchBirthdays(userId: string): Promise<Birthday[] | AppServerError> {
        return await fetchBirthdays(this.supabase!, userId);
    }
    async createBirthday(
        birthday: Birthday,
    ): Promise<Birthday | AppServerError> {
        return await createBirthday(this.supabase!, birthday);
    }
    async updateBirthday(
        birthday: UpdateBirthdayData,
    ): Promise<Birthday | AppServerError> {
        return await updateBirthday(this.supabase!, birthday);
    }
    async deleteBirthday(birthdayId: number): Promise<number | AppServerError> {
        return await deleteBirthday(this.supabase!, birthdayId);
    }

    async recommendGifts(
        birthday: Birthday,
    ): Promise<Birthday | AppServerError> {
        return await recommendGifts(this.supabase!, birthday);
    }
}
