export interface RecommendadedGifts {
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
    recommendadedGifts?: RecommendadedGifts;
}