import { BlogCore } from "../core/blog.core";

export type blogInfoDTO  = Omit<BlogCore, 'authorId' | 'content'> & {
    author: {
        id: string;
        name: string;
    }
};