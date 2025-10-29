import { Document, model, Model, models, Schema } from 'mongoose';
import { BlogStatus } from './core/blog-status';

export interface IBlog extends Document {
    title: string,
    content: string,
    authorId: Schema.Types.ObjectId,
    status: number
    likesCount: number,
    commentsCount: number,
    createdAt: Date,
    updatedAt: Date
}

const blogSchema = new Schema<IBlog>({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true
    },
    authorId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        immutable: true
    },
    status: {
        type: Number,
        enum: [0,1,2],
        default: BlogStatus.Draft
    },
    likesCount: {
        type: Number,
        default: 0
    },
    commentsCount: {
        type: Number,
        default: 0
    },
},
{timestamps : true});
blogSchema.index({createdAt: -1});
blogSchema.index({authorId: 1});

const Blog: Model<IBlog> = models.Blog || model<IBlog>('Blog',blogSchema)
export default Blog;