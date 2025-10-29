import { models, model, Schema, Document, Model } from 'mongoose';

import { EMAIL_REGEX } from '../../shared/helpers/validation.constants';

export interface IUser  extends Document {
    userName: string,
    email: string,
    passwordHash: string,
    createdAt: Date,
    updatedAt: Date
}

const userSchema = new Schema({
    userName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: [
            EMAIL_REGEX,
            'Please fill a valid email address' // Custom error message
        ]
    },
    passwordHash: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true
    },
    updatedAt: {
        type: Date,
        default: () => Date.now()
    }
},
{timestamps : true});
userSchema.index({_id: 1, email: 1}, {unique: true});
const User: Model<IUser> = models.User || model<IUser>('User', userSchema);
export default User;