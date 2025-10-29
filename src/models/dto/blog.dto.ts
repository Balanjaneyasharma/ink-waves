import { BlogCore } from "../core/blog.core";

export type blogDTO  = Omit<BlogCore, 'authorId'> & {
    author: {
        id: string;
        name: string;
    }
};