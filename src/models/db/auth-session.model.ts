import { Document, Model, model, models, Schema } from "mongoose";


export interface IAuthSession  extends Document {
    _id: string, // tokenId (uuid)
    userId: Schema.Types.ObjectId,
    tokenHash: string,   // bcrypt hash of secret
    expiresAt: Date,
    isExpired: boolean,
    createdAt: Date
}

const AuthSessionSchema = new Schema({
    _id: { 
        type: String /* = tokenId (uuid) */, 
        required: true 
    },
    userId: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    tokenHash: { 
        type: String, 
        required: true 
    },   // bcrypt hash of secret
    expiresAt: { 
        type: Date, 
        required: true 
    },
    isExpired: { 
        type: Boolean, 
        default: false 
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});
const RefreshToken: Model<IAuthSession> = models.RefreshToken || model<IAuthSession>('RefreshToken', AuthSessionSchema);
export default RefreshToken;