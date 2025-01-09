import authRoutes from '@/components/auth/auth.routes';
import express, {Router} from 'express';

const router: Router = express.Router();

router.use('/auth', authRoutes);

export default router;
