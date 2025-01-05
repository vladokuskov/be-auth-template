import userRoutes from '@/components/user/user.routes';
import express from 'express';

const router = express.Router();

router.use('/user', userRoutes);

export default router;
