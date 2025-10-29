import { Response } from "express";

import { 
    createComment, 
    deleteComment, 
    getCommentsByBlogId, 
    updateComment 
} from "../services/comment.service";
import { RequestWithUser } from "../shared/interfaces/request-with-user";
import { HttpError } from "../shared/models/http-error";
import { errorResponse, successResponse } from "../shared/helpers/response.util";
import { validateObjectId } from "../shared/helpers/validate-object-id.util";


export const getCommentsByBlogIdController = async(req: RequestWithUser, res: Response) => {
    try {
        const blogId = req.params.id;

        validateObjectId(blogId, 'blog-id');

        const result = await getCommentsByBlogId(blogId);
        return successResponse(res, 200, result);

    } catch (error: HttpError | any) {
        return errorResponse(res, error.status ?? 500, error?.message, error);
    }
}

export const addCommentController = async(req: RequestWithUser, response: Response) => {
    try {
        const comment: string = req.body.comment;
        const blogId = req.params.id;
        const userId = req.user?.id;

        validateObjectId(blogId, 'blog-id');

        if(!comment || comment.trim() === '') {
            throw new HttpError("Invalid body", 400);
        }

        const commentId = await createComment(comment, blogId, userId as string);
        return successResponse(response, 201, {id: commentId});
    } catch(error: HttpError | any)
    {
        return errorResponse(response, error?.status ?? 500, error?.message, error)
    }
}

export const updateCommentController = async(req: RequestWithUser, res: Response) => {
    try{
        const comment: string = req.body.comment;
        const commentId = req.params.commentId;
        const userId = req.user?.id;

        validateObjectId(commentId);

        if(!comment || comment.trim() === '') {
            throw new HttpError("Invalid body", 400);
        }

        const updatedComment = await updateComment(commentId, comment,userId as string);
        return successResponse(res, 200, {comment: updatedComment});
    } catch(error: HttpError | any) {
        return errorResponse(res, error.status ?? 500, error?.message, error);
    }
}

export const deleteCommentController = async(req: RequestWithUser, res: Response) => {
    try {
        const commentId = req.params.commentId;
        const userId = req.user?.id;

       validateObjectId(commentId);

        await deleteComment(commentId, userId as string);
        return successResponse(res, 200, true);

    } catch (error: HttpError | any) {
        return errorResponse(res, error.status ?? 500, error?.message, error);
    }
}