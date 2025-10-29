import { Router } from "express";

import { asyncHandler } from "../middleware/async-handler";
import { 
    addCommentController, 
    deleteCommentController, 
    updateCommentController 
} from "../controllers/comment.controller";
import commentLikeRouter from "./comment-like.route";

const commentRouter = Router({mergeParams: true});

commentRouter
        .route("")
        .post(asyncHandler(addCommentController));
commentRouter
        .route("/:commentId")
        .put(updateCommentController)
        .delete(deleteCommentController)
commentRouter.use("/:commentId/like", commentLikeRouter)

export default commentRouter;