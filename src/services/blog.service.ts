import mongoose, { ClientSession } from "mongoose";

import { 
    deleteBlogRecordById, 
    doesBlogRecordWithIdExists, 
    getAllBlogRecords, 
    getBlogRecordById, 
    getBlogRecordsByAuthorId, 
    getBlogStatus, 
    insertBlogRecord, 
    isUserAuthorOfBlogRecord, 
    updateBlogRecordById, 
    updateBlogRecordCommentsCount,
    updateBlogRecordLikesCount
} from "../registries/blog.registry";
import { BlogStatus } from "../models/core/blog-status";
import { blogDTO } from "../models/dto/blog.dto";
import { blogInfoDTO } from "../models/dto/blog-info.dto";
import { doesUserExist } from "./user.service";
import { deleteBlogLikeRecordsByBlogId } from "../registries/blog-like.registry";
import { HttpError } from "../shared/models/http-error";
import { deleteCommentLikesByCommentIds } from "./comment-like.service";
import { deleteCommentsByBlogId, getCommentIdsByBlogId } from "./comment.service";

export const doesBlogExist = async(blogId: string) => {
    try {
        const blog = doesBlogRecordWithIdExists(blogId);
        if(!blog)
        throw new HttpError("Blog not found", 404);
        return true;
    } catch (error: HttpError | any) {
        throw error;
    }
}

export const isBlogPublic = async(blogId: string): Promise<boolean> => {
    try {
       const blogStatus = await getBlogStatus(blogId);
       if(blogStatus === null) {
        throw new HttpError("Blog not found", 404);
       }
       return blogStatus === BlogStatus.Published;
    }
    catch (error: HttpError | any) {
        throw error;
    }
}

export const getAllBlogs = async () => {
    try {
        return await getAllBlogRecords();
    } catch(error: HttpError | any) {
        throw error;
    }
}

export const getBlogById = async (blogId: string): Promise<blogDTO> => {
    try{
        await doesBlogExist(blogId);
        const blog = await getBlogRecordById(blogId);
        if(!blog) {
            throw new HttpError("Blog not found, 404");
        }
        return blog;
    } catch(error: HttpError | any){
        throw error;
    }
}

export const getBlogByAuthor = async (authorId: string): Promise<blogInfoDTO[]> => {
    try{
        await doesUserExist(authorId);
        const blogs = await getBlogRecordsByAuthorId(authorId) ;
        return blogs;
    } catch(error: HttpError | any) {
        throw error;
    }
}

export const createBlog = async(content: string, title: string, authorId: string): Promise<string> => {
    try {
        const newBlog = await insertBlogRecord(title, content, authorId);
        return newBlog.id;
    } catch(error: HttpError | any) {
        throw error;
    }
}

export const updateBlog = async(blogId: string, title: string, content: string, userId: string) => {
    try {
        await doesBlogExist(blogId);
        const canUserEdit  = await isUserAuthorOfBlogRecord(userId, blogId);
        
        if(!canUserEdit) throw new HttpError("You are not authorized to edit this blog", 403);

        await isBlogPublic(blogId);
        
        return await updateBlogRecordById(blogId, title, content);
        
    } catch (error: HttpError | any) {
        throw error;
    }
}

export const updateBlogLikesCount = async(blogId: string, isIncrement: boolean) => {
    try {
        await doesBlogExist(blogId);
        await isBlogPublic(blogId);
        await updateBlogRecordLikesCount(blogId, isIncrement);
        return true;    

    } catch (error: HttpError | any) {
        throw error;
    }
}

export const updateBlogCommentsCount = async(blogId: string, isIncrement: boolean, session? : ClientSession) => {
    try {
        await doesBlogExist(blogId);
        await isBlogPublic(blogId);
        await updateBlogRecordCommentsCount(blogId, isIncrement, session);
        return true;   
    } catch (error: HttpError | any) {
        throw error;
    }
}

export const deleteBlog = async(blogId: string, userId: string) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        await doesBlogExist(blogId);
        const canUserDelete  = await isUserAuthorOfBlogRecord(userId, blogId);
        
        if(!canUserDelete) throw new HttpError("You are not authorized to delete this blog", 403);
        
        const commentIds = await getCommentIdsByBlogId(blogId);

        await deleteCommentLikesByCommentIds(commentIds, session);
        await deleteCommentsByBlogId(blogId, session);
        await deleteBlogLikeRecordsByBlogId(blogId, session);
        await deleteBlogRecordById(blogId, session);

        await session.commitTransaction();


    } catch (error: HttpError | any) {
        await session.abortTransaction();
        throw error;
    }
    finally {
        await session.endSession();
    }
}