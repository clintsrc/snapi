/*
 * API Routes index
 *
 * Organize and manage the routes
 *
 */

import { Router } from 'express';
import apiRoutes from './api/index.js';

const router = Router();

router.use('/api', apiRoutes);

export default router;
