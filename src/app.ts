import errorHandler from '@/middlewares/errorHandler';
import router from '@/router';
import cors from 'cors';
import dotenv from 'dotenv';
import express, {Express} from 'express';

dotenv.config();

const app: Express = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(router);

// Register global error handler
app.use(errorHandler);

export default app;
