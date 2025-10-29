import { Response } from "express";

import { RequestWithUser } from "../shared/interfaces/request-with-user";
import { validateObjectId } from "../shared/helpers/validate-object-id.util";
import { likeABlog, unlikeABlog } from "../services/blog-like.service";
import { errorResponse, successResponse } from "../shared/helpers/response.util";
import { HttpError } from "../shared/models/http-error";


export const blogLikeController = async(req: RequestWithUser, res: Response) => {
    try {
        const blogId = req.params.blogId;
        const userId = req.user?.id;

        validateObjectId(blogId, 'blog');

        await likeABlog(blogId, userId!);

        return successResponse(res, 200, { message: "Blog liked successfully" } );
    }
    catch(error: HttpError | any) {
        return errorResponse(res, error.status ?? 500, (error as Error)?.message, error);
    }
}


export const blogUnlikeController = async(req: RequestWithUser, res: Response) =>  {
    try {
        const blogId = req.params.blogId;
        const userId = req.user?.id;

        validateObjectId(blogId, 'blog');

        await unlikeABlog(blogId, userId!);
        return successResponse(res, 200, { message: "Blog un-liked successfully" } );
    }
    catch(error: HttpError | any) {
        return errorResponse(res, error.status ?? 500, (error as Error)?.message, error);
    }
}