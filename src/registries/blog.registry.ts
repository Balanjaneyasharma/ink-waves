import mongoose, { ClientSession } from "mongoose";

import Blog, { IBlog } from "../models/db/blog.model";
import { blogInfoDTO } from "../models/dto/blog-info.dto";
import { BlogCore } from "../models/core/blog.core";
import { blogDTO } from "../models/dto/blog.dto";
import { mapDbToCore } from "../mappers/blog.mapper";
import { handleMongoError } from "../shared/helpers/mongo-error-handler.util";

export const doesBlogRecordWithIdExists = async(blogId: string): Promise<boolean> => {
    try {
        const count = await Blog.countDocuments({
            _id: blogId
        })
        return count > 0;
    } catch(error) {
        handleMongoError(error);
    }
} 

export const isUserAuthorOfBlogRecord = async(userId: string, blogId: string): Promise<boolean> => {
    try{
        const blog = await Blog.findById(blogId);
        if(!blog) return false;
        return blog.authorId.toString() === userId;   
    }
    catch(error) {
        handleMongoError(error);
    }
}

export const getAllBlogRecords = async(): Promise<blogInfoDTO[]> => {
    try {
        const blogsResponse: blogInfoDTO[] = await Blog.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: 'authorId',
                    foreignField: '_id',
                    as: 'author'
                }   
            },
            { $unwind: '$author'},
            {
                $project: {
                    id: '$_id',
                    title: 1,
                    likesCount: 1,
                    commentsCount: 1,
                    isPublished: 1,
                    isReadOnly: 1,
                    author: {
                        id: '$author._id',
                        userName: '$author.userName'
                    }

                }
            }
        ])
        return blogsResponse;
    } catch (error) {
        handleMongoError(error);
    }
}

export const insertBlogRecord = async(title: string, content: string, authorId: string): Promise<BlogCore> => {
    try{
        const blog = await Blog.create({
            title,
            content,
            authorId
        });
        return mapDbToCore(blog);
    } catch(error) {
        handleMongoError(error);
    }
}

export const getBlogRecordById = async(blogId: string): Promise<blogDTO | null> => {
    try {
        const result = await Blog.aggregate([
            { $match: { _id: blogId}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'authorId',
                    foreignField: '_id',
                    as:  'author'
                }
            },
            { $unwind: '$author' },
            {
                $project: {
                    id: '$_id',
                    title: 1,
                    content: 1,
                    likesCount: 1,
                    commentsCount: 1,
                    isPublished: 1,
                    isReadOnly: 1,
                    author: {
                        id: '$author._id',
                        userName: '$author.userName'
                    }
                }
            },
        ]);
        return result[0] as (blogDTO | null);
    } catch(error) {
        handleMongoError(error);
    }
}

export const getBlogRecordsByAuthorId = async(authorId: string): Promise<blogInfoDTO[]> => {
    try {
        const results: blogInfoDTO[] = await Blog.aggregate([
            { 
                $match: 
                { authorId: new mongoose.Types.ObjectId(authorId) }
            },
            { 
                $lookup: {
                    from: 'users',
                    localField: 'authorId',
                    foreignField: '_id',
                    as:  'author'
                }
            },
            { $unwind: '$author' },
            {
                $project: {
                    id: '$_id',
                    title: 1,
                    likesCount: 1,
                    commentsCount: 1,
                    isPublished: 1,
                    isReadOnly: 1,
                    author: {
                        id: '$author._id',
                        userName: '$author.userName'
                    }
                }
            }
        ]);
        return results;
    } catch(error) {
        handleMongoError(error);
    }
}

export const getBlogStatus = async(blogId: string) => {
    try {
        const blog: IBlog | null = await Blog.findById(blogId);
        if(!blog) {
            return null;
        }
        return blog.status;
    } catch(error) {
        handleMongoError(error);
    }
}

export const updateBlogRecordById = async(blogId: string, title: string, content: string): Promise<BlogCore> => {
    try {
        const blog = await Blog.findByIdAndUpdate(
            blogId,
            { title, content },
            { new: true }
        );
        return mapDbToCore(blog as IBlog);
    }
    catch(error) {
        handleMongoError(error);
    }
}

export const updateBlogRecordLikesCount = async(blogId: string, isIncrement: boolean): Promise<boolean> => {
    try {
        const updateQuery = isIncrement ? { $inc: { likesCount: 1 } } : { $inc: { likesCount: -1 } };
        await Blog.findByIdAndUpdate(blogId, updateQuery, { new: true });
        return true;
    } catch (error) {
        handleMongoError(error);
    }
}

export const updateBlogRecordCommentsCount = async(blogId: string, isIncrement: boolean, session?: ClientSession): Promise<boolean> => {
    try {
        const updateQuery = isIncrement ? { $inc: { commentsCount: 1 } } : { $inc: { commentsCount: -1 } };
        await Blog.findByIdAndUpdate(blogId, updateQuery, { new: true }).session(session ?? null);
        return true;    
    } catch (error) {
        handleMongoError(error);
    }
}

export const deleteBlogRecordById = async(blogId: string, session?: ClientSession): Promise<boolean> => {
    try {
        await Blog.findByIdAndDelete(blogId, session);
        return true;
    }
    catch(error) {
        handleMongoError(error);
    }
}