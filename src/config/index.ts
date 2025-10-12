import 'dotenv/config';

export const config = {
    mongoUri: process.env.MONGODB_URI as string,
    jwtSecret: process.env.JWT_SECRET as string,
    refreshTokenSecret: process.env.REFRESH_TOKEN_SECRET as string,
    port: parseInt(process.env.PORT || '3000', 10),
};