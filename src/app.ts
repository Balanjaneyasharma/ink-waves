import express from 'express';
import cookieParser from 'cookie-parser';

export const app = express();

app.use(express.json());
app.use(cookieParser());


app.use('/api/users', require('./routes/user.route'));
app.use('/api/blogs', require('./routes/blog.route'));