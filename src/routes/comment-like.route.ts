import { Router } from "express";

import { 
    addCommentLikeController, 
    getLikedUsersForCommentsController, 
    removeCommentLikeController 
} from "../controllers/comment-like.controller";
import { asyncHandler } from "../middleware/async-handler";

const commentLikeRouter = Router({mergeParams: true});

commentLikeRouter
    .route("/users")
    .get(asyncHandler(getLikedUsersForCommentsController));

commentLikeRouter
    .route("")
    .post(addCommentLikeController)
    .delete(removeCommentLikeController)

export default commentLikeRouter;