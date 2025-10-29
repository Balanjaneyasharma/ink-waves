import { Document, Model } from "mongoose";
import { model, models, Schema } from "mongoose";

export interface IComment extends Document {
    blogId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    parentId?: Schema.Types.ObjectId,
    content: String,
    createdAt: Date,
    updatedAt: Date
}

const commentSchema = new Schema({
    blogId: {
        type: Schema.Types.ObjectId,
        ref: 'Blog',
        required: true
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    parentId: {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        default: null,
        immutable: true
    },
    content: {
        type: String,
        required: true
    }
},
{timestamps : true});
commentSchema
.index({ blogId: 1, createdAt: -1 })
.index({ parentId: 1 });
const Comment: Model<IComment> = models.Comments || model<IComment>('Comments', commentSchema)
export default Comment;
