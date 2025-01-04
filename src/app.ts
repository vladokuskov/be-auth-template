import 'reflect-metadata';

import errorMiddleware from '@/middlewares/error.middleware';
import router from '@/router';
import cors from 'cors';
import dotenv from 'dotenv';
import express, {Express} from 'express';

dotenv.config();

const app: Express = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Register middlewares
app.use(errorMiddleware);

app.use(router);

export default app;
