import { BlogCore } from "../models/core/blog.core";
import { IBlog } from "../models/db/blog.model";
import { blogInfoDTO } from "../models/dto/blog-info.dto";
import { blogDTO } from "../models/dto/blog.dto";


export const mapDbToCore = (db: IBlog): BlogCore => ({
    id: db.id,
    title: db.title as string,
    content: db.content as string,
    authorId: new String(db.authorId).toString(),
    likesCount: +db.likesCount,
    commentsCount: +db.commentsCount,
    status: db.status
});

export const mapDBToBlogDto = (
    blog: IBlog,
    author: { id: string; name: string }
): blogDTO => ({
    id: blog.id,
    title: blog.title as string,
    content: blog.content as string,
    likesCount: +blog.likesCount,
    commentsCount: +blog.commentsCount,
    status: blog.status,
    author: { id: author.id, name: author.name },
});

export const mapDbToBlogInfoDTO = (
    db: IBlog,
    author: { id: string; name: string }
): blogInfoDTO => ({
    id: db.id,
    title: db.title as string,
    likesCount: +db.likesCount,
    commentsCount: +db.commentsCount,
    status: db.status,
    author: { id: author.id, name: author.name },
})