/*
 * Thought Routes
 *
 * Organize and manage the Thought routes
 * Associates each supported CRUD route with the supporting controller function
 *
 */

import { Router } from 'express';
import {
  createThought,
  getAllThoughts,
  getThoughtById,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} from '../../controllers/thoughtController.js';

const router = Router();

// /api/thoughts
router
  .route('/')
  .post(createThought) // Create
  .get(getAllThoughts); // Read all

// /api/thoughts/:thoughtId
router
  .route('/:thoughtId')
  .get(getThoughtById) // Read single
  .put(updateThought) // Update
  .delete(deleteThought); // Delete

// /api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(addReaction);

// /api/thoughts/:thoughtId/reactions/:reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(deleteReaction);

export { router as thoughtRouter };
