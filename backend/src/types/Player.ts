export type PlayerFromDB = {
    id: number;
    name: string;
    levels: string;
}

export type Player = {
    id: number;
    name: string;
    levels: Record<string, number>;
}