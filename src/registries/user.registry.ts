import { UserCore } from "../models/core/user-core";
import User, { IUser } from "../models/db/user.model";
import { UserMapper } from "../mappers/user.mapper";
import { handleMongoError } from "../shared/helpers/mongo-error-handler.util";


export const doesUserRecordExistByUserID = async(userId: string): Promise<boolean> => {
    try{
        const count = await User.countDocuments({
            _id: userId
        })
        return count > 0;
    } catch(error) {
        handleMongoError(error);
    }
}

export const doesUSerExistsByUserMail = async(email: string): Promise<boolean> => {
    try{
        const count = await User.countDocuments({
            email: email
        })
        return count > 0;
    } catch(error) {
        handleMongoError(error);
    }
}

export const getUserRecord = async(userId: string): Promise<UserCore> => {
    try {
        const user = await User.findById(userId);
        return UserMapper.DBToCore(user as unknown as IUser);
    }
    catch(error) {
        handleMongoError(error);
    }
}

export const getPasswordHashByUserMail = async(email: string): Promise<string> => {
    try{
        const user: any = await User.findOne({email}).select('passwordHash').lean();
        return user ? user.passwordHash as string : '';
    } catch(error) {
        handleMongoError(error);
    }
}