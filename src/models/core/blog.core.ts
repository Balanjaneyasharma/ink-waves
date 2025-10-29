import { BlogStatus } from "./blog-status";

export interface BlogCore {
    id: string;
    title: string;
    content: string;
    authorId: string,
    status: BlogStatus;
    likesCount: number;
    commentsCount: number; 
}