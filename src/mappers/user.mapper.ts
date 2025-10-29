import { UserCore } from "../models/core/user-core";
import { IUser } from "../models/db/user.model";


export class UserMapper {
    static DBToCore(user: IUser): UserCore {
        return ({
            id: user._id as string,
            userName: user.userName,
            email: user.email
        })
    }
}