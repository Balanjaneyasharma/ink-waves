import { ClientSession } from "mongoose";
import { handleMongoError } from "../shared/helpers/mongo-error-handler.util"
import CommentLike, { ICommentLike } from "../models/db/comment-like.model";

export const getLikesCountForCommentRecord = async(commentId: string): Promise<number> => {
    try {
        return await CommentLike.countDocuments({
            commentId: commentId
        });
    } catch(error) {
        handleMongoError(error);
    }
}

export const getLikedUsersForCommentRecord = async(commentId: string) => {
    try {
        const result = await CommentLike.aggregate([
            {
                $match: {commentId: commentId}
            },
            {
                $lookup: {
                    from :'users',
                    let: {'userId': '$userId'},
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $eq: ['$_id', '$$userId']
                                }
                            },
                            $project: {
                                _id: 1,
                                userName: 1
                            }
                        }
                    ],
                    as: 'users'
                }
            },
            {$unwind : '$users'},
            {
                $project: {
                    id: '$users._id',
                    userName: '$users.userName'
                }
            }
        ]);
        return result;
    }
    catch(error) {
        handleMongoError(error);
    }
    
}

export const addCommentLikeRecord = async(commentId: string, userId: string): Promise<string> => {
    try{
        const record: ICommentLike = await CommentLike.create({
            userId: userId,
            commentId: commentId
        });
        return record._id as string;
    }
    catch(error) {
        handleMongoError(error);
    }
}

export const deleteCommentLikeRecord = async(commentId: string, userId: string): Promise<boolean> => {
    try{
        await CommentLike.deleteOne({
            commentId: commentId,
            userId: userId
        });
        return true;
    }
    catch(error) {
        handleMongoError(error);
    }
}

export const deleteCommentLikeRecordsByCommentId = async(commentId: string, session?: ClientSession): Promise<boolean> => {
    try{
        await CommentLike.deleteMany(
            {commentId: commentId},
            {session: session}
        )
        return true;
    } catch(error) {
        handleMongoError(error);
    }
}

export const deleteCommentLikeRecordsByCommentIds = async(commentIds: string[], session?: ClientSession): Promise<boolean> => {
    try {
        await CommentLike.deleteMany(
            {commentId: { $in: commentIds}}, 
            {session: session}
        );
        return true;
    } catch(error) {
        handleMongoError(error);
    }
}

export const deleteCommentLikeRecordsByUserId = async(userId: string, session?: ClientSession): Promise<boolean> => {
    try {
        await CommentLike.deleteMany(
            {userId: userId},
            {session: session});
        return true;
    } catch(error) {
        handleMongoError(error);
    }
}