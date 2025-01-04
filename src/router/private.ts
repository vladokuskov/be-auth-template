import userController from '@/controllers/user.controller';
import express from 'express';

const router = express.Router();

router.use('/user', userController);

export default router;
