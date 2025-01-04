import 'reflect-metadata';

import {authMiddleWare} from '@/middlewares/auth.middleware';
import errorMiddleware from '@/middlewares/error.middleware';
import {privateRouter, publicRouter} from '@/router';
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

// Register routers
app.use(publicRouter);
app.use(authMiddleWare, privateRouter);

export default app;
