import { BlogCore } from "../core/blog.core";


export type createBlogDTo = Omit<BlogCore, 'id' | 'authorId' | 'likesCount' | 'commentsCount'> 