export type CommentBlogDTo = {
    id: string,
    content: string,
    comments?: CommentBlogDTo[]
    blogId: string
} 