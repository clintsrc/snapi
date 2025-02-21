/*
 * Thought Controller API
 *
 * Supports CRUD routes for the mongoose Thought model
 *
 * Routes:
 *  /api/thoughts
 *  /api/thoughts/:thoughtId
 *
 *  /api/thoughts/:thoughtId/reactions
 *  /api/thoughts/:thoughtId/reactions/:reactionId
 *
 */

import { User, Thought } from '../models/index.js';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb'; // represents the mondodb '_id'

/*
 * Thought routes:
 *  /api/thoughts
 */

/**
 * GET ALL Thoughts /thoughts
 * @param _req (for typescript intentionally unused)
 * @returns an array of Thoughts
 */
export const getAllThoughts = async (
  _req: Request,
  res: Response
): Promise<void> => {
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
export const getThoughtById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { thoughtId } = req.params;

  try {
    if (!ObjectId.isValid(thoughtId)) {
      res.status(400).json({
        message: `GET getThoughtById: Invalid ObjectId format: ${thoughtId}`,
      });
      return;
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
    res.status(500).json({
      message:
        error instanceof Error ? error.message : 'An unknown error occurred',
    });
  }
};

/**
 * POST Create a Thought /thoughts
 * @param object Thought
 * @returns create a single Thought object
 */
export const createThought = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { thoughtText, username } = req.body;

  try {
    if (!username || !thoughtText) {
      res
        .status(400)
        .json({ message: 'Username and thoughtText are required.' });
      return;
    }

    // Lookup the username to whom the thought will be attributed
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: `User not found: ${username}` });
      return;
    }

    const thought = await Thought.create({
      thoughtText,
      username,
    });

    // Add the thought id to the user's list of thoughts
    user.thoughts.push(thought._id as ObjectId);
    await user.save(); // Save the updated document

    console.info('POST createThought called');
    res.status(201).json({
      message: 'Thought created successfully!',
      thought,
      user, // Returning the updated user with the new thought linked
    });
  } catch (error: unknown) {
    console.error('ERROR: POST createThought', (error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * PUT Update a Thought based on id /thoughts/:id
 * @param object id, thoughtId
 * @returns a single Thought object
 */
export const updateThought = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { thoughtId } = req.params;
  const { thoughtText } = req.body;

  try {
    if (!ObjectId.isValid(thoughtId)) {
      res
        .status(400)
        .json({ message: `Invalid ObjectId format: ${thoughtId}` });
      return;
    }

    /* Don't change the poster's username and definitely not the reactions of 
      of others */
    if (!thoughtText) {
      res
        .status(400)
        .json({ message: 'thoughtText is required to update the thought' });
      return;
    }

    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      { thoughtText },
      { new: true, runValidators: true }
    );

    if (!updatedThought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }

    res.status(200).json(updatedThought);
  } catch (error) {
    console.error('ERROR: PUT updateThought', (error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
};

/*
 * Thought routes:
 *  /api/thoughts/:thoughtId
 */

/**
 * DELETE Thought based on id /thoughts/:id
 * @param string id
 * @returns string
 */
export const deleteThought = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { thoughtId } = req.params;

  try {
    if (!ObjectId.isValid(thoughtId)) {
      res.status(400).json({
        message: `DELETE deleteThought: Invalid ObjectId format: ${thoughtId}`,
      });
      return;
    }

    const thought = await Thought.findOneAndDelete({ _id: thoughtId });

    if (!thought) {
      console.info('ERROR: DELETE deleteThought NOT FOUND', thoughtId);
      res.status(404).json({ message: 'Thought not found' });
      return;
    }

    // Remove the thoughtId from the user's thoughts list
    await User.findOneAndUpdate(
      { username: thought.username }, // filter on the thought's username
      { $pull: { thoughts: thoughtId } }, // remove thoughtId from the thoughts array
      { new: true } // return the updated user document
    );

    console.info('DELETE deleteThought called', thoughtId);
    res.status(200).json({ message: 'Thought deleted and removed from user' });
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

/*
 * Thought reaction routes:
 *  /api/thoughts/:thoughtId/reactions
 */

/**
 * POST Reaction based on /thoughts/:thoughtId/reactions
 * @param string id
 * @param object reaction
 * @returns object Thought
 */
export const addReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { thoughtId } = req.params;
  const { reactionBody, username } = req.body;

  try {
    if (!ObjectId.isValid(thoughtId)) {
      res
        .status(400)
        .json({ message: `Invalid ObjectId format: ${thoughtId}` });
      return;
    }

    // Ensure the user exists
    const user = await User.findOne({ username });
    if (!user) {
      res.status(404).json({ message: `User not found: ${username}` });
      return;
    }

    // Find the thought and add the reaction
    const updatedThought = await Thought.findByIdAndUpdate(
      thoughtId,
      {
        $push: {
          reactions: {
            reactionBody,
            username,
            createdAt: new Date(),
          },
        },
      },
      { new: true, runValidators: true }
    );

    if (!updatedThought) {
      res.status(404).json({ message: 'Thought not found' });
      return;
    }

    res.status(200).json(updatedThought);
  } catch (error) {
    console.error('ERROR: POST addReaction', (error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
};

/*
 * Thought reaction routes:
 *  /api/thoughts/:thoughtId/reactions/:reactionId
 */

/**
 * DELETE Reaction from user's friend list based on /thoughts/:thoughtId/reactions/:reactionId
 * @param string id
 * @param string id
 * @returns string
 */
export const deleteReaction = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { thoughtId, reactionId } = req.params;
  try {
    if (!ObjectId.isValid(thoughtId)) {
      res.status(400).json({
        message: `DELETE deleteReaction: Invalid ObjectId format: ${thoughtId}`,
      });
      return;
    }

    if (!ObjectId.isValid(reactionId)) {
      res.status(400).json({
        message: `DELETE deleteReaction: Invalid ObjectId format: ${reactionId}`,
      });
      return;
    }

    const thought = await Thought.findOneAndUpdate(
      { _id: thoughtId }, // filter for the thought to be updated
      { $pull: { reactions: { reactionId } } }, // $pull operator removes the specified reactionId object from the reactions array based on reactionId property inside
      { runValidators: true, new: true } // run validation, return updated record
    );
    if (thought) {
      console.info('DELETE deleteReaction called', reactionId);
      res.status(200).json(thought);
    } else {
      console.info('ERROR: DELETE deleteReaction NOT FOUND', reactionId);
      res.status(404).json({
        message: 'Thought not found',
      });
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('ERROR: DELETE deleteReaction', error.message);
      res.status(500).json({ message: error.message });
    } else {
      console.error('ERROR: DELETE deleteReaction', error);
      res.status(500).json({ message: 'An unknown error occurred' });
    }
  }
};
