import { HttpError } from "../shared/models/http-error";
import { doesUserRecordExistByUserID, getUserRecord } from "../registries/user.registry";

export const doesUserExist = async (userId: string) => {
    try {
        const result = await doesUserRecordExistByUserID(userId);
        if (result) return true;
        throw new HttpError("User not found", 404);
    } catch (error) {
        throw error;
    }
}

export const getUserDetails = async(userId: string) => {
    try {
        return await getUserRecord(userId);
    }
    catch(error) {
        throw error
    }
}