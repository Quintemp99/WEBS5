export type TUser = {
    _id: string;
    email: string;
    password: string;
    roles: string[];
    isValidPassword: (password: string) => Promise<boolean>;
}