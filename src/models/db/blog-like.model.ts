import { Document, Model, model, models, Schema } from "mongoose";

export interface IBlogLike extends Document{
    blogId: Schema.Types.ObjectId,
    userId: Schema.Types.ObjectId,
    createdAt: Date
}

const blogLikeSchema = new Schema({
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
},
{timestamps : true});
// Compound index to ensure one like per user per blog
blogLikeSchema.index({ blogId: 1, userId: 1 }, { unique: true });

const BlogLike: Model<IBlogLike> = models.BlogLike || model<IBlogLike>('BlogLike', blogLikeSchema)
export default BlogLike;
