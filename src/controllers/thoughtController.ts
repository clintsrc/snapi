/*
/api/thoughts
    GET to get all thoughts
    GET to get a single thought by its _id
    POST to create a new thought. Don't forget to push the created thought's _id to the associated user's thoughts array field. (note that the examples below are just sample data):
        {
            "thoughtText": "Here's a cool thought...",
            "username": "lernantino",
            "userId": "5edff358a0fcb779aa7b118b"
        }
    PUT to update a thought by its _id
    DELETE to remove a thought by its _id
/api/thoughts/:thoughtId/reactions
    POST to create a reaction stored in a single thought's reactions array field
    DELETE to pull and remove a reaction by the reaction's reactionId value
*/

import { Thought } from '../models/index.js';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';

/**
 * GET ALL Thoughts /thoughts
 * @param _req (for typescript intentionally unused)
 * @returns an array of Thoughts
 */
export const getAllThoughts = async (_req: Request, res: Response) => {
  try {
    const thoughts = await Thought.find();

    console.info('GET getAllThoughts called');
    res.json(thoughts);
  } catch (error: unknown) {
    if (error instanceof Error) {
    console.error('ERROR: GET getAllThoughts', error.message);
    } else {
      console.error('ERROR: GET getAllThoughts', error);
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

/**
 * GET Thought based on id /thoughts:id
 * @param string id
 * @returns a single Thought object
 */
export const getThoughtById = async (req: Request, res: Response) => {
  const { thoughtId } = req.params;

  try {
    if (!ObjectId.isValid(thoughtId)) {
      throw new Error(
        `GET getThoughtById: Invalid ObjectId format: ${thoughtId}`
      );
    }

    const thought = await Thought.findById(thoughtId);

    if (thought) {
      console.info('GET getThoughtById called', thoughtId);
      res.status(200).json(thought);
    } else {
      console.info('ERROR: GET getThoughtById NOT FOUND', thoughtId);
      res.status(404).json({
        message: 'Thought not found',
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: GET getThoughtById', error.message);
    } else {
      console.error('ERROR: GET getThoughtById', error);
    }
    res.status(500).json({ message: error instanceof Error ? error.message : 'An unknown error occurred' });
  }
};

/**
 * POST Create a Thought /thoughts
 * @param object Thought
 * @returns create a single Thought object
 */
export const createThought = async (req: Request, res: Response) => {
  try {
    const thought = await Thought.create(req.body);

    console.info('POST createThought called');

    res.status(200).json(thought);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: POST createThought', error.message);
      res.status(500).json({ message: error.message });
    } else {
      console.error('ERROR: POST createThought', error);
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

/**
 * PUT Update a Thought based on id /thoughts/:id
 * @param object id, thoughtId
 * @returns a single Thought object
 */
export const updateThought = async (req: Request, res: Response) => {
  const { thoughtId } = req.params;
  try {
    if (!ObjectId.isValid(thoughtId)) {
      throw new Error(
        `PUT updateThought: Invalid ObjectId format: ${thoughtId}`
      );
    }

    const thought = await Thought.findOneAndUpdate(
      { _id: thoughtId }, // filter
      { $set: req.body },
      { runValidators: true, new: true } // run validation, return updated record
    );

    if (thought) {
      console.info('PUT updateThought called', thoughtId);
      res.status(200).json(thought);
    } else {
      console.info('ERROR: PUT updateThought NOT FOUND', thoughtId);
      res.status(404).json({
        message: 'Thought not found',
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: PUT updateThought', error.message);
      res.status(500).json({ message: error.message });
    } else {
      console.error('ERROR: PUT updateThought', error);
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

/**
 * DELETE Thought based on id /thoughts/:id
 * @param string id
 * @returns string
 */
export const deleteThought = async (req: Request, res: Response) => {
  const { thoughtId } = req.params;
  try {
    if (!ObjectId.isValid(thoughtId)) {
      throw new Error(
        `DELETE deleteThought: Invalid ObjectId format: ${thoughtId}`
      );
    }

    const thought = await Thought.findOneAndDelete({ _id: thoughtId });

    if (thought) {
      console.info('DELETE deleteThought called', thoughtId);
      res.status(200).json({ message: 'Thought deleted' });
    } else {
      console.info('ERROR: DELETE deleteThought NOT FOUND', thoughtId);
      res.status(404).json({
        message: 'Thought not found',
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: DELETE deleteThought', error.message);
      res.status(500).json({ message: error.message });
    } else {
      console.error('ERROR: DELETE deleteThought', error);
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};

// TODO:
// /api/thoughts/:thoughtId/reactions
//    POST to create a reaction stored in a single thought's reactions array field
//    
/**
 * POST Reaction based on /thoughts/:thoughtId/reactions
 * @param string id
 * @param object reaction
 * @returns object Thought
 */
// export const addReaction = async (req: Request, res: Response) => {
//   try {
//     const thought = await Thought.create(req.body);

//     console.info('POST addReaction called');

//     res.status(200).json(thought);
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error('ERROR: POST addReaction', error.message);
//       res.status(500).json({ message: error.message });
//     } else {
//       console.error('ERROR: POST addReaction', error);
//       res.status(500).json({ message: 'An unknown error occurred' });
//     }
//   }
// };

// // /api/thoughts/:thoughtId/reactions/:reactionId 
// //    DELETE to pull and remove a reaction by the reaction's reactionId value
// //    deleteReaction
// /**
//  * DELETE Thought based on id /thoughts/:id
//  * @param string id
//  * @returns string
//  */
// export const deleteThought = async (req: Request, res: Response) => {
//   const { thoughtId } = req.params;
//   try {
//     if (!ObjectId.isValid(thoughtId)) {
//       throw new Error(
//         `DELETE deleteThought: Invalid ObjectId format: ${thoughtId}`
//       );
//     }

//     const thought = await Thought.findOneAndDelete({ _id: thoughtId });

//     if (thought) {
//       console.info('DELETE deleteThought called', thoughtId);
//       res.status(200).json({ message: 'Thought deleted' });
//     } else {
//       console.info('ERROR: DELETE deleteThought NOT FOUND', thoughtId);
//       res.status(404).json({
//         message: 'Thought not found',
//       });
//     }
//   } catch (error: unknown) {
//     if (error instanceof Error) {
//       console.error('ERROR: DELETE deleteThought', error.message);
//       res.status(500).json({ message: error.message });
//     } else {
//       console.error('ERROR: DELETE deleteThought', error);
//       res.status(500).json({ message: 'An unknown error occurred' });
//     }
//   }
// };