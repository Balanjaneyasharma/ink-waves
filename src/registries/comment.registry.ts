import { ClientSession } from 'mongoose';

import Comment, { IComment } from '../models/db/comment.model';
import { handleMongoError } from '../shared/helpers/mongo-error-handler.util';

export const isUserAuthorOfCommentRecord = async(commentId: string): Promise<boolean> => {
    try{
        const commentRecord: IComment | null = await Comment.findById(commentId);
        if(!commentRecord) return false;
        return commentRecord._id === commentId;
    } catch(error) {
        handleMongoError(error);
    }
}

export const doesCommentRecordExistsById = async(commentId: string) => {
    try {
        const count = await Comment.countDocuments(
            { _id: commentId}
        );
        return count > 0;
    } catch (error) {
        handleMongoError(error);
    }
}
export const getBlogIdByCommentRecordId = async(commentId: string): Promise<string> => {
    try{
        const result = await Comment.findById(
            {commentId},
            {blogId: 1}
        );
        return result?.blogId as unknown as string;
    } catch(error) {
        handleMongoError(error)
    }
}

export const getCommentRecordIdsByBlogId = async(blogId: string): Promise<string[]> => {
    try {
        const result = await Comment.find(
            { blogId: blogId},
            {_id :1}
        );
        return result.map((rec) => rec._id as string);
    } catch(error) {
        handleMongoError(error);
    }
}

export const getCommentRecordsByBlogId = async(blogId: string) => {
    try {
        const comments = await Comment.aggregate([
            {$match: { blogId: blogId}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as: 'author'
                }
            },
            {$unwind: { path: '$author', preserveNullAndEmptyArrays: true }},
            {$project: {
                id: '$_id', //comment id
                content: 1,
                parentId: 1,
                blogId: 1,
                author: {
                    id: '$author._id',
                    name: '$author.userName',
                    email: '$author.email'
                }
            }}
        ]);
        return comments
    } catch(error) {
        handleMongoError(error);
    }
}

export const addCommentRecord = async(userId: string, blogId: string, content: string, parentId: string = ''): Promise<string> => {
    try {
        const newCommentRecord = await Comment.create({
            userId,
            blogId,
            content,
            parentId
        });
        return newCommentRecord._id as string;

    } catch(error) {
        handleMongoError(error);
    }
}

export const updateCommentRecord = async(content: string, commentId: string): Promise<string> => {
    try {
        await Comment.findByIdAndUpdate(
            commentId,
            { content: content },
            { new: true, runValidators: true }
        );
        return content;
    } catch(error) {        
        handleMongoError(error);
    }
}

export const deleteCommentRecordById = async(commentId: string, session?: ClientSession): Promise<boolean> => {
    try {
        await Comment.findByIdAndDelete(commentId, {session: session});
        return true;
    } catch (error) {
        handleMongoError(error);
    }
}

export const deleteCommentRecordsByBlogId = async(blogId: string, session?: ClientSession): Promise<boolean> => {
    try {
        await Comment.deleteMany(
            {blogId: blogId}, 
            {session: session}
        );
        return true;
    } catch(error) {
        handleMongoError(error);
    }
}


export const deleteCommentRecordsByUserId = async(userId: string, session?: ClientSession): Promise<boolean> => {
    try {
        await Comment.deleteMany(
            {userId: userId},
            {session: session}
        );
        return true;
    } catch(error) {
        handleMongoError(error);
    }
}