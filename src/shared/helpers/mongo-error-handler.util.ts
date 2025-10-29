import mongoose from "mongoose";
import { MongoServerError } from "mongodb";

import { HttpError } from "../models/http-error";

export function handleMongoError(error: unknown): never {
    if (error instanceof MongoServerError) {
        switch (error.code) {
            case 11000: {
                const field = Object.keys(error.keyPattern || {})[0];
                throw new HttpError(`Duplicate key error on field: ${field}`, 409);
            }
            default:
                throw new HttpError("MongoDB server error", 500);
        }
    }

    switch (true) {
        case error instanceof mongoose.Error.CastError:
            throw new HttpError(`Invalid ${error.path} format`, 400);

        case error instanceof mongoose.Error.ValidationError:
            throw new HttpError(`Validation failed: ${error.message}`, 400);

        case error instanceof mongoose.Error.DocumentNotFoundError:
            throw new HttpError("Document not found", 404);

        case error instanceof mongoose.Error.VersionError:
            throw new HttpError("Document version conflict", 409);

        case error instanceof mongoose.Error.StrictModeError:
            throw new HttpError("Unknown field(s) detected", 400);

        case error instanceof mongoose.Error.MongooseServerSelectionError:
            throw new HttpError("Database not reachable", 503);

        default:
            throw new HttpError("Database operation failed", 500);
    }
}
