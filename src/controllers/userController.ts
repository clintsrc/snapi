/*
/api/users
    GET all users
    GET a single user by its _id and populated thought and friend data
    POST a new user (note that the examples below are just sample data):
        {
            "username": "lernantino",
            "email": "lernantino@gmail.com"
        }
    PUT to update a user by its _id
    DELETE to remove user by its _id

BONUS: Remove a user's associated thoughts when deleted.
/api/users/:userId/friends/:friendId
    POST to add a new friend to a user's friend list
    DELETE to remove a friend from a user's friend list
*/

import { User } from "../models/index.js";
import { Request, Response } from "express";

/**
 * GET ALL Users /users
 * @returns an array of Users
 */
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();
    
    console.info('GET getAllUsers called');
    res.json(users);
  } catch (error: any) {
    console.log('ERROR: GET getAllUsers', error.message);
    res.status(500).json({ message: error.message });
  }
};
