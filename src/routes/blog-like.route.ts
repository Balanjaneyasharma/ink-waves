import { Router } from "express";

import { asyncHandler } from "../middleware/async-handler";
import { blogLikeController, blogUnlikeController } from "../controllers/blog-like.controller";

const blogLikeRouter = Router({ mergeParams: true });

blogLikeRouter.route("/")
    .post(asyncHandler(blogLikeController))
    .delete(asyncHandler(blogUnlikeController));

export default blogLikeRouter;