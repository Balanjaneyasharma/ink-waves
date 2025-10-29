import { Response } from "express";

import { createBlogDTo } from "../models/dto/create-blog.dto";
import { 
    createBlog, 
    deleteBlog, 
    getAllBlogs, 
    getBlogById, 
    updateBlog 
} from "../services/blog.service";
import { RequestWithUser } from "../shared/interfaces/request-with-user";
import { HttpError } from "../shared/models/http-error";
import { validateObjectId } from "../shared/helpers/validate-object-id.util";
import { errorResponse, successResponse } from "../shared/helpers/response.util";


export const createBlogController = async (req: RequestWithUser, res: Response) => {
    try {
        const blogData: createBlogDTo = req.body;
        const userId = req.user?.id;
         // Assuming user ID is available in req.user

        if (!blogData.title || !blogData.content) {
            return errorResponse(res, 400, 'Title and content are required');
        }
        
        const newBlogId = await createBlog(blogData.content, blogData.title, userId!);
        return successResponse(res, 201, { blogId: newBlogId });

    } catch(error: HttpError | any) {
        return errorResponse(res, error.status ?? 500, (error as Error)?.message, error);
    }
}


export const getAllBlogsController = async(req: RequestWithUser, res: Response) => {
    try {
        const blogs = await getAllBlogs();
        return successResponse(res, 200, { blogs });
    } catch (error: HttpError | any) {
        return errorResponse(res, error.status ?? 500, (error as Error).message, error);
    }
}

export const getBlogByIDController = async(req: RequestWithUser, res: Response) => {
    try {
        const blogId = req.params.id;

        validateObjectId(blogId, 'blog');

        const blog = await getBlogById(blogId);
        if (!blog) {
            return errorResponse(res, 404, "Blog not found");
        }
        return successResponse(res, 200, { blog } );
    }
    catch (error: HttpError | any) {
        return errorResponse(res, error.status ?? 500, (error as Error).message, error);
    }
}

export const updateBlogController = async (req: RequestWithUser, res: Response) => {
    try {
        const blogId = req.params.id;
        const updateData = req.body;
        const userId = req.user?.id; // Assuming user ID is available in req.user

        validateObjectId(blogId, 'Blog ID');

        const updatedBlog = await updateBlog(blogId, updateData.title, updateData.content, userId!);

        return successResponse(res, 200, { blog: updatedBlog });
    } catch (error: HttpError | any) {
        return errorResponse(res, error.status ?? 500, (error as Error).message, error);
    }
}

export const deleteBlogController = async (req: RequestWithUser, res: Response) => {
    try {
        const blogId = req.params.id;
        const userId = req.user?.id; // Assuming user ID is available in req.user

        validateObjectId(blogId, 'Blog ID');

        await deleteBlog(blogId, userId!);
        return successResponse(res, 200, true);


    } catch (error: HttpError | any) {
        return errorResponse(res, error.status ?? 500, (error as Error).message, error);
    }
}