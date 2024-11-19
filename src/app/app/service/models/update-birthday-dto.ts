export interface UpdateBirthdayData {
    id: number;
    name?: string;
    date?: string;
    relationship?: string;
    observation?: string;
};


export const createUpdatedBirthdayData = async (
    data: UpdateBirthdayData,
    initialData?: UpdateBirthdayData
) => {
    const updateData: UpdateBirthdayData = { id: data.id };

    if (data.name !== initialData?.name) {
        updateData.name = data.name;
    }

    if (data.date !== initialData?.date) {
        updateData.date = data.date;
    }

    if (data.relationship !== initialData?.relationship) {
        updateData.relationship = data.relationship;
    }

    if (data.observation !== initialData?.observation) {
        updateData.observation = data.observation;
    }

    return updateData;
};


export const parseToUpdateBirthdayData = (data: { id: number; name?: string; date?: Date | string; relationship?: string; observation?: string; },): UpdateBirthdayData => {
    const parsedData: UpdateBirthdayData = { id: data.id };

    if (data.name) {
        parsedData.name = data.name;
    }

    if (data.date) {
        parsedData.date = data.date instanceof Date ? data.date.toISOString() : data.date;
    }

    if (data.relationship) {
        parsedData.relationship = data.relationship;
    }

    if (data.observation) {
        parsedData.observation = data.observation;
    }

    return parsedData;
};