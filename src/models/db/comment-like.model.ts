import mongoose, { Model, models, Schema } from "mongoose";
import { Document } from "mongoose";
import { model } from "mongoose";

export interface ICommentLike  extends Document {
    commentId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    createdAt: Date
}

const commentLikeSchema = new Schema({
    commentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comment',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: () => Date.now(), 
        immutable: true
    }
},
{timestamps : true});
// Compound index to ensure one like per user per blog
commentLikeSchema.index({ commentId: 1, userId: 1 }, { unique: true });

const CommentLike: Model<ICommentLike> = models.CommentLike || model<ICommentLike>('CommentLike', commentLikeSchema)
export default CommentLike;
