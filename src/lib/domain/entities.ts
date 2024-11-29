export interface RecommendadedGift {
    id: number;
    name: string;
    description: string;
}
export interface Birthday {
    id?: number;
    name: string;
    date: Date;
    relationship: string;
    observation?: string;
    daysToBirthday: number;
    recommendadedGifts?: RecommendadedGift[];
    user_id: string;
}
