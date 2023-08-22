export const LIKE = '👍';
export const DISLIKE = '👎';

export interface upsertParams {
    modelName: string;
    uniqueId: number;
    kvpArray: kvp [];
    prisma: any;
}

export interface kvp {
    k: string;
    v: any;
}