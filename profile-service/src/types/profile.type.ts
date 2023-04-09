export type TProfile = {
    _id: string;
    email: string;
    roles: string[];
    targets: TTarget[]
}

export type TTarget = {
    _id: string;
    user: TUser
    image: TImage;
    location: TLocation;
    participant: TParticipant[];
    created_at: Date;
}

export type TUser = {
    _id: string;
    email: string;
    roles: string[];
}

export type TImage = {
    _id: string;
    data: Buffer;
    immagaId: string;
}

export type TLocation = {
    _id: string;
    long: number;
    lat: number
}

export type TParticipant = {
    _id: string;
    user: TUser;
    email: string;
    image: TImage;
    score: number;
}