import {Router} from 'express';
const router = Router();
import {
    getAllUsers
} from '../../controllers/userController.js';

// /api/users
router.route('/')
    .get(getAllUsers);

export { router as userRouter };