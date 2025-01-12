import api from '@/api';
import {httpLogger} from '@/logger';
import errorMiddleware from '@/middlewares/error.middleware';
import cors from 'cors';
import dotenv from 'dotenv';
import express, {Express} from 'express';
import 'reflect-metadata';

dotenv.config();

const app: Express = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(httpLogger);

// Register middlewares
app.use(errorMiddleware);

// Register api routes
app.use(api);

export default app;
