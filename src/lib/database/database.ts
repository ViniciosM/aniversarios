import { Birthday } from "@/lib/domain/entities";
import { AppServerError } from "@/lib/domain/erros";
import { UpdateBirthdayData } from "./dtos/update-birthday-dto";

export interface Database {
    name: string;

    connect(params?: unknown): Promise<void>;
    disconnect(): Promise<void>;

    /// -----------     BIRTHDAY -----------
    fetchBirthdays(userId: string): Promise<Birthday[] | AppServerError>;

    createBirthday(birthday: Birthday): Promise<Birthday | AppServerError>;

    updateBirthday(
        birthday: UpdateBirthdayData,
    ): Promise<Birthday | AppServerError>;

    deleteBirthday(birthdayId: number): Promise<number | AppServerError>;

    recommendGifts(
        birthday: Birthday,
    ): Promise<Birthday | AppServerError>;
}
