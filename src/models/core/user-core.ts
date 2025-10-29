import { IUser } from "../db/user.model";

export type  UserCore = Pick<IUser, 'userName' | 'email'>  & {
    id: string;
}