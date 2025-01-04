import authController from '@/controllers/auth.controller';
import express from 'express';

const router = express.Router();

router.use('/auth', authController);

export default router;
