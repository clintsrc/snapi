import { Router } from 'express';
const router = Router();
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
} from '../../controllers/userController.js';

// /api/users
router
  .route('/')
  .post(createUser) // Create
  .get(getAllUsers); // Read all

// /api/users/:userId
router
  .route('/:userId')
  .get(getUserById) // Read single
  .put(updateUser) // Update
  .delete(deleteUser); // Delete

export { router as userRouter };
