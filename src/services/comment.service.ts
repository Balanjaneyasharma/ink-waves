import mongoose, { ClientSession } from "mongoose";

import { 
    doesBlogExist, 
    isBlogPublic, 
    updateBlogCommentsCount 
} from "./blog.service"
import { doesUserExist } from "./user.service";
import { HttpError } from "../shared/models/http-error";
import { 
    addCommentRecord, 
    deleteCommentRecordById, 
    deleteCommentRecordsByBlogId, 
    doesCommentRecordExistsById, 
    getBlogIdByCommentRecordId, 
    getCommentRecordIdsByBlogId, 
    getCommentRecordsByBlogId, 
    isUserAuthorOfCommentRecord, 
    updateCommentRecord 
} from "../registries/comment.registry";
import { deleteCommentLikeRecordsByCommentId } from "../registries/comment-like.registry";

export const isUserAuthorOfComment = async(userId: string, commentId: string): Promise<boolean> => {
    try {
        const hasComment = await doesCommentExist(commentId);
        if(!hasComment) throw new HttpError('Comment not found', 404);
        return await isUserAuthorOfCommentRecord(commentId);
    }
    catch(error) {
        throw error;
    }
}

export const doesCommentExist = async(commentId: string) => {
    try {
        const comment = await doesCommentRecordExistsById(commentId);
        if(comment) return true;
        throw new HttpError("Comment not found", 404);
    } catch (error) {
        throw error;
    }
}

export const getCommentsByBlogId = async(blogId: string) => {
    try {
        await doesBlogExist(blogId);
        const comments = await getCommentRecordsByBlogId(blogId);
        //will map later:)
        return comments;
    } catch (error) {
        throw error;
    }
}

export const getCommentIdsByBlogId = async(blogId: string): Promise<string[]> => {
    try{
        return await getCommentRecordIdsByBlogId(blogId);
    } catch(error) {
        throw error;
    }
}

export const createComment = async(content: string, blogId: string, userId: string) => {
    try {
        await doesBlogExist(blogId);
        await doesUserExist(userId);

        const isPublished = await isBlogPublic(blogId);
        if(!isPublished) {
            throw new HttpError("Cannot comment on an unpublished blog", 403);
        }

        // Create and save the comment
       const result = await addCommentRecord(userId, blogId, content);

        const blogService  = require("../blog/blog.service");
        await blogService.updateBlogCommentsCount(blogId, true);

        return result;
    } catch (error) {
        throw error;
    }
}

export const updateComment = async(commentId: string, content: string, userId: string): Promise<string> => {
    try {
        await doesUserExist(userId);
        await doesCommentExist(commentId);

        const isAuthor = await isUserAuthorOfComment(userId, commentId);
        if(!isAuthor) {
            throw new HttpError("You are not allowed to update this comment", 403);
        }  

        const updatedComment = await updateCommentRecord(content, commentId);
        return updatedComment;
    }
    catch(error) {
        throw error;
    }
        
}

export const deleteComment = async(commentId: string, userId: string): Promise<boolean> => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        await doesUserExist(userId);
        await doesCommentExist(commentId);

        const isAuthor = await isUserAuthorOfComment(userId, commentId);

        if(!isAuthor) {
            throw new HttpError("You are not allowed to delete this comment", 403);
        }

        const blogId = await getBlogIdByCommentRecordId(commentId);

        await deleteCommentLikeRecordsByCommentId(commentId, session);
        await updateBlogCommentsCount(blogId, false, session);
        await deleteCommentRecordById(commentId, session);

        await session.commitTransaction();

        return true;
    } 
    catch(error) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        session.endSession();
    }
}


export const deleteCommentsByBlogId = async(blogId: string, session?: ClientSession): Promise<boolean> => {
    try {
        await deleteCommentRecordsByBlogId(blogId, session);
        return true;
    }
    catch (error) {
        throw error;
    }
}