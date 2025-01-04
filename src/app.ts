import globalErrorMiddleware from '@/middlewares/globalErrorMiddleware';
import ormContextMiddleware from '@/middlewares/ormContextMiddleware';
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
app.use(globalErrorMiddleware);
app.use(ormContextMiddleware);

app.use(router);

export default app;
