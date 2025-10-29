import { ClientSession } from "mongoose";

import BlogLike, { IBlogLike } from "../models/db/blog-like.model";
import { BlogStatus } from "../models/core/blog-status";
import { handleMongoError } from "../shared/helpers/mongo-error-handler.util";

export type BlogLikeInfo = {
    id: string,
    title: string,
    likesCount: number,
    commentsCount: number,
    author: {
        id: string,
        name: string,
    }
}

export const getLikedUserRecordsByBlogId = async(blogId: string) => {
    try {
        const likedUsers = await BlogLike.aggregate([
            { $match: {blogId: blogId}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'userId',
                    foreignField: '_id',
                    as : 'users'
                }
            },
            {$unwind: '$users'},
            {
                $project: {
                    id: '$users._id',
                    name: 1
                }
            }
        ]);
        return likedUsers;

    } catch(error) {
        handleMongoError(error);
    }
}

export const getLikedBlogRecordsByUserId = async(userId: string) => {
    try {
        const likedBlogs = await BlogLike.aggregate([
            { $match: { userId: userId } },
            {
                $lookup: {
                    from: 'blogs',
                    let: { blogId: '$blogId' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$_id', '$$blogId'] },
                                        { $eq: ['$status', BlogStatus.Published] }
                                    ]
                                }
                            }
                        },
                        { $project: { _id: 1, title: 1, likesCount: 1, commentsCount: 1, authorId: 1 } }
                    ],
                    as: 'blogs'
                }
            },
            { $unwind: '$blogs' },
            {
                $lookup: {
                    from: 'users',
                    let: {authorId: '$blog.authorId'},
                    pipeline:[
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', '$$authorId']
                                }
                            }
                        },
                        {
                            $project: {
                                _id: 1,
                                userName: 1
                            }
                        }
                    ],
                    as: 'user'
                },
                
            },
            {$unwind: '$user'},
            {
                $project: {
                    id: '$blogs._id',
                    title: '$blogs.title',
                    likesCount: '$blogs.likesCount',
                    commentsCount: '$blogs.commentsCount',
                    author: {
                        id: '$user._id',
                        name: '$user.userName'
                    }
                }
            }
        ]);
        return likedBlogs;
    } catch(error) {
        handleMongoError(error);
    }
}

export const insertABlogLikeRecord = async(blogId: string, userId: string) => {
    try {
        const newBlogLike: IBlogLike = await BlogLike.create({
            blogId,
            userId
        });
        return newBlogLike._id;
    }
    catch(error) {
        handleMongoError(error);
    }
}

export const deleteABlogLikeRecord = async(blogId: string, userId: string) => {
    try {
        await BlogLike.deleteOne({
            blogId,userId
        });
        return true;
    } catch(error) {
        handleMongoError(error);
    }
}

export const deleteBlogLikeRecordsByBlogId = async(blogId: string, session?: ClientSession): Promise<boolean> => {
    try {
        await BlogLike.deleteMany(
            {blogId: blogId}, 
            {session: session}
        );
        return true;
    } catch(error) {
        handleMongoError(error);
    }
}

export const deleteBlogLikeRecordsByUserId = async(userId: string, session?: ClientSession): Promise<boolean> => {
    try{
        await BlogLike.deleteMany(
            {userId: userId}, 
            {session: session}
        );
        return true;
    } catch(error) {
        handleMongoError(error);
    }
}