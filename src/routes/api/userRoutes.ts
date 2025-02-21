/*
 * User Routes
 *
 * Organize and manage the User routes
 * Associates each supported CRUD route with the supporting controller function
 *
 */

import { Router } from 'express';
import {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,
  addFriend,
  deleteFriend,
} from '../../controllers/userController.js';

const router = Router();

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

// /api/users/:userId/friends/:friendId
router
  .route('/:userId/friends/:friendId')
  .post(addFriend) // Create
  .delete(deleteFriend); // Delete

export { router as userRouter };
