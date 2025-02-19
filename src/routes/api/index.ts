// /api/users

import { Router } from 'express';
import { userRouter } from './userRoutes.js';
import { thoughtRouter } from './thoughtRoutes.js';

const router = Router();

// /api/users
router.use('/users', userRouter);
// /api/thoughts
router.use('/thoughts', thoughtRouter);

export default router;
