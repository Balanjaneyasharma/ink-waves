import { Request } from "express";

/**
 * Extend the Request type locally to include a user property.
 * This keeps the change scoped to this file; alternatively you can
 * put a global declaration in a types folder if used across the app.
 */
export interface RequestWithUser extends Request {
    user?: {
        id?: string;
        [key: string]: any;
    };
}