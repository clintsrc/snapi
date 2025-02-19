import { Router } from 'express';
const router = Router();
import {
  createThought,
  getAllThoughts,
  getThoughtById,
  updateThought,
  deleteThought,
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

export { router as thoughtRouter };
