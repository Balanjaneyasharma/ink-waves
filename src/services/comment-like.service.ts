import { ClientSession } from "mongoose";

import { 
    addCommentLikeRecord, 
    deleteCommentLikeRecord, 
    deleteCommentLikeRecordsByCommentId, 
    deleteCommentLikeRecordsByCommentIds, 
    getLikedUsersForCommentRecord, 
    getLikesCountForCommentRecord 
} from "../registries/comment-like.registry";
import { doesUserExist } from "./user.service";
import { doesCommentExist } from "./comment.service";
import { HttpError } from "../shared/models/http-error";

export const getLikesCountForComment = async (commentId: string): Promise<number> => {
    try {
        await doesCommentExist(commentId);
        const likesCount = await getLikesCountForCommentRecord(commentId)
        return likesCount;
    } catch (error) {
        throw error;
    }
}

export const getLikedUsersForComment = async (commentId: string) => {
    try {
        await doesCommentExist(commentId);
        await getLikedUsersForCommentRecord(commentId)
        
    } catch (error) {
        throw error;
    }
}

export const LikeAComment = async (commentId: string, userId: string): Promise<string> => {
    try {
        await doesUserExist(userId);
        await doesCommentExist(commentId);

        const newLike = await addCommentLikeRecord(commentId, userId);
        return newLike;

    } catch (error: HttpError | any) {
        throw error;
    }
}

export const UnlikeAComment = async (commentId: string, userId: string): Promise<boolean> => {
    try {
        await doesUserExist(userId);
        await doesCommentExist(commentId);

        const result = await deleteCommentLikeRecord(commentId, userId);
        if(!result) {
            throw new HttpError("Like not found", 404);
        }
        return true;
    }
    catch (error) {
        throw error;
    }   
}

export const deleteCommentLikesByCommentIds = async (commentIds: string[], session?: ClientSession): Promise<boolean> => {
    try {
        return await deleteCommentLikeRecordsByCommentIds(commentIds, session);    
    }
    catch (error) {
        throw error;
    }
}

export const deleteCommentLikesByCommentId = async(commentId: string, session?: ClientSession): Promise<boolean> => {
    try {
        return await deleteCommentLikeRecordsByCommentId(commentId, session);
    }
    catch(error) {
        throw error;
    }
}