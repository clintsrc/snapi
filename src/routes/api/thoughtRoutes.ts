import { Router } from 'express';
const router = Router();
import {
  createThought,
  getAllThoughts,
  getThoughtById,
  updateThought,
  deleteThought,
  addReaction,
  deleteReaction,
} from '../../controllers/thoughtController.js';

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
