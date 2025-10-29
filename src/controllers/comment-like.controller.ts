import { Response } from "express";

import { 
    getLikedUsersForComment, 
    LikeAComment, 
    UnlikeAComment 
} from "../services/comment-like.service";
import { RequestWithUser } from "../shared/interfaces/request-with-user";
import { errorResponse, successResponse } from "../shared/helpers/response.util";
import { HttpError } from "../shared/models/http-error";
import { validateObjectId } from "../shared/helpers/validate-object-id.util";


export const getLikedUsersForCommentsController = async(req: RequestWithUser, res: Response) => {
    try {
        const commentId = req.params.commentId;

        validateObjectId(commentId, 'comment-id');

        const result = await getLikedUsersForComment(commentId);
        return successResponse(res, 200, result);
    } catch(error: HttpError | any) {
        return errorResponse(res, error.status ?? 500, error.message, error);
    }
}

export const addCommentLikeController = async(req: RequestWithUser, res: Response) => {
    try{
        const userId = req.user?.id;
        const commentId = req.params.commentId;
        
        validateObjectId(commentId);

        const result = await LikeAComment(commentId, userId as string);
        return successResponse(res, 201, result);
    } catch(error: HttpError | any) {
        return errorResponse(res, error.status ?? 500, error?.message, error)
    }
}

export const removeCommentLikeController = async(req: RequestWithUser, res: Response) => {
    try {
        const userId = req.user?.id;
        const commentId = req.params.commentId;

        validateObjectId(commentId);

        const result = await UnlikeAComment(commentId, userId as string);
        return successResponse(res, 200, result);
    } catch(error: HttpError | any) {
        return errorResponse(res, error.status ?? 500, error?.message, error);
    }
}