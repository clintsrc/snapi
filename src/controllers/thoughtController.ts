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
//import { ObjectId } from 'mongodb';

/**
 * GET ALL Thouthts /thoughts
 * @param _req (for typescript intentionally unused)
 * @returns an array of Thoughts
 */
export const getAllThoughts = async (_req: Request, res: Response) => {
  try {
    const thoughts = await Thought.find();

    console.info('GET getAllThoughts called');
    res.json(thoughts);
  } catch (error: any) {
    console.error('ERROR: GET getAllThoughts', error.message);
    res.status(500).json({ message: error.message });
  }
};
