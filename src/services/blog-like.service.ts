
import { ClientSession } from "mongoose";

import { doesBlogExist } from "../services/blog.service";
import { doesUserExist } from "../services/user.service";
import { 
    deleteABlogLikeRecord, 
    deleteBlogLikeRecordsByBlogId, 
    deleteBlogLikeRecordsByUserId, 
    getLikedUserRecordsByBlogId, 
    insertABlogLikeRecord 
} from "../registries/blog-like.registry";
import { HttpError } from "../shared/models/http-error";

export const getLikedUsersForBlog = async (blogId: string) => {
    try {
        await doesBlogExist(blogId);
        const users = getLikedUserRecordsByBlogId(blogId);
        return users
    }
    catch (error) {
        throw error;
    }
}

export const likeABlog = async (blogId: string, userId: string): Promise<string> => {
    try {
        await doesBlogExist(blogId);
        await doesUserExist(userId);

        const id = await insertABlogLikeRecord(blogId, userId);

        const blogService  = require("../blog/blog.service");
        await blogService.updateBlogLikesCount(blogId, true);

        return id as string;
        
    } catch (error: any) {
        if(error.code === 11000) {
            throw new HttpError("You have already liked this blog", 409);
        }
        throw error;
    }
}

export const unlikeABlog = async (blogId: string, userId: string): Promise<boolean> => {
    try {
        await doesBlogExist(blogId);
        await doesUserExist(userId);

        const result = await deleteABlogLikeRecord(blogId, userId);

        if(!result) throw new HttpError("You have not liked this blog", 400);

        const blogService  = require("../blog/blog.service");
        await blogService.updateBlogLikesCount(blogId, false);

        return true;
    } catch (error) {
        throw error;
    }
}

export const deleteBlogLikesByBlogId = async (blogId: string, session? : ClientSession): Promise<boolean> => {
    try {
        await deleteBlogLikeRecordsByBlogId(blogId, session);
        return true;    
    }
    catch (error) {
        throw error;
    }
}

export const deleteBlogLikesByUserId = async(userId: string, session?: ClientSession): Promise<boolean> => {
    try {
        await deleteBlogLikeRecordsByUserId(userId, session);
        return true;
    } catch(error: HttpError | any) {
        throw error;
    }
}