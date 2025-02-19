// /api/users

import {Router} from 'express';
import {userRouter} from './userRoutes.js';

const router = Router();

// /api/users
router.use('/users', userRouter);

export default router;