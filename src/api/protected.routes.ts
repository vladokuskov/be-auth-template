import userRoutes from '@/components/user/user.routes';
import express, {Router} from 'express';

const router: Router = express.Router();

router.use('/user', userRoutes);

export default router;
