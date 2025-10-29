import { Router } from "express";

import { 
    createBlogController, 
    deleteBlogController, 
    getAllBlogsController, 
    getBlogByIDController, 
    updateBlogController 
} from "../controllers/blog.controller";
import { asyncHandler } from "../middleware/async-handler";
import blogLikeRouter from "./blog-like.route.js";
import commentRouter from "./comment.route";

const router = Router();

router.route("/")
    .get(asyncHandler(getAllBlogsController))
    .post(asyncHandler(createBlogController));

router.route("/:id")
    .get(asyncHandler(getBlogByIDController))
    .put(asyncHandler(updateBlogController))
    .delete(asyncHandler(deleteBlogController));

router.route("/author/:authorId")

router.use("/:id/likes", blogLikeRouter);

router.use('/:id/comment', commentRouter)

export default router;