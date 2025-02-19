//

import { Router } from 'express';
const router = Router();
import {
  //   createUser,
  getAllThoughts,
  //   getUserById,
  //   updateUser,
  //   deleteUser,
} from '../../controllers/thoughtController.js';

// /api/thought
router
  .route('/')
  // .post(createUser) // Create
  .get(getAllThoughts); // Read all

export { router as thoughtRouter };
