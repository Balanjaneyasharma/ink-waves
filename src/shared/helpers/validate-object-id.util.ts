import mongoose from "mongoose";
import { HttpError } from "../models/http-error";

export const validateObjectId = (id: string, fieldName = 'ID') => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new HttpError(`Invalid ${fieldName}`, 400);
    }
};