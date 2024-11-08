import { Birthday } from "@/app/domain/entities";
import { AppServerError } from "@/app/domain/erros";

export abstract class BirthdayService {
    static async fetchBirthdays(): Promise<Birthday[] | AppServerError> {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            const fetchedBirthdays: Birthday[] = [
                { id: 1, name: "Carol", date: new Date("1999-10-03"), relationship: "Parente", observation: "Muito carismática" },
                { id: 2, name: "Jorge", date: new Date(), relationship: "Parente" },
                { id: 3, name: "Maria", date: new Date(), relationship: "Parente" },
                { id: 4, name: "Joana", date: new Date(), relationship: "Parente" },
                { id: 5, name: "Vinicios", date: new Date(), relationship: "Parente" },
                { id: 6, name: "Flavio", date: new Date(), relationship: "Parente" },
            ];
            return fetchedBirthdays;
        } catch (err) {
            return new AppServerError("Failed to fetch birthdays", 400);
        }
    }

    static async create(birthday: Birthday): Promise<Birthday | AppServerError> {
        try {
            throw Error()
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return birthday;
        } catch (err) {
            return new AppServerError("Failed to create birthdays", 400);
        }
    }

    static async update(birthday: Birthday): Promise<Birthday | AppServerError> {
        try {
            throw Error()
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return birthday;
        } catch (err) {
            return new AppServerError("Failed to update birthdays", 400);
        }
    }

    static async delete(birthdayId: number): Promise<number | AppServerError> {
        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            return birthdayId;
        } catch (err) {
            return new AppServerError("Failed to delete birthdays", 400);
        }
    }
}
