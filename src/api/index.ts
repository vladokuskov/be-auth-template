import protectedRoutes from '@/api/protected.routes';
import publicRoutes from '@/api/public.routes';
import {authMiddleWare} from '@/middlewares/auth.middleware';
import {Router} from 'express';

const router: Router = Router();

router.use(publicRoutes);
router.use(protectedRoutes, authMiddleWare);

export default router;
