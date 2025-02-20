/*
 * User Controller API
 *
 * Supports CRUD routes for the mongoose User model
 *
 * Routes:
 *  /api/users
 *  /api/users/:userId
 *  /api/users/:userId/friends/:friendId
 *
 */

import { User } from '../models/index.js';
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb'; // represents the mondodb '_id'

/*
 * User routes:
 *  /api/users
 */

/**
 * POST Create a User /users
 * @param object User
 * @returns create a single User object
 */
export const createUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const user = await User.create(req.body);

    console.info('POST createUser called');

    res.status(200).json(user);
  } catch (error: unknown) {
    console.error('ERROR: POST createUser', (error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * GET ALL Users /users
 * @param _req (for typescript intentionally unused)
 * @returns an array of Users
 */
export const getAllUsers = async (
  _req: Request,
  res: Response
): Promise<void> => {
  try {
    const users = await User.find();

    console.info('GET getAllUsers called');
    res.json(users);
  } catch (error: unknown) {
    console.error('ERROR: GET getAllUsers', (error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
};

/*
 * User routes:
 *  /api/users/:userId
 */

/**
 * GET User based on id /users/:id
 * @param string id
 * @returns a single User object
 */
export const getUserById = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;

  try {
    if (!ObjectId.isValid(userId)) {
      res.status(400).json({
        message: `GET getUserById: Invalid ObjectId format: ${userId}`,
      });
      return;
    }

    const user = await User.findById(userId);

    if (user) {
      console.info('GET getUserById called', userId);
      res.status(200).json(user);
    } else {
      console.info('ERROR: GET getUserById NOT FOUND', userId);
      res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (error: unknown) {
    console.error('ERROR: GET getUserById', (error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * PUT Update a User based on id /users/:id
 * @param object id, userId
 * @returns a single User object
 */
export const updateUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    if (!ObjectId.isValid(userId)) {
      res.status(400).json({
        message: `PUT updateUser: Invalid ObjectId format: ${userId}`,
      });
      return;
    }

    const user = await User.findOneAndUpdate(
      { _id: userId }, // filter
      { $set: req.body }, // $set operator updates record with data included in the PUT body
      { runValidators: true, new: true } // run validation, return updated record
    );

    if (user) {
      console.info('PUT updateUser called', userId);
      res.status(200).json(user);
    } else {
      console.info('ERROR: PUT updateUser NOT FOUND', userId);
      res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (error: unknown) {
    console.error('ERROR: PUT updateUser', (error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * DELETE User based on id /users/:id
 * @param string id
 * @returns string
 */
// TODO: BONUS: Remove a user's associated thoughts when deleted.
export const deleteUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId } = req.params;
  try {
    if (!ObjectId.isValid(userId)) {
      res.status(400).json({
        message: `DELETE deleteUser: Invalid ObjectId format: ${userId}`,
      });
      return;
    }

    const user = await User.findOneAndDelete({ _id: userId });

    if (user) {
      console.info('DELETE deleteUser called', userId);
      res.status(200).json({ message: 'User deleted' });
    } else {
      console.info('DELETE: PUT deleteUser NOT FOUND', userId);
      res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (error: unknown) {
    console.error('ERROR: DELETE deleteUser', (error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
};

/*
 * User Friends routes:
 *  /api/users/:userId/friends/:friendId
 */

/**
 * POST Friend based on /users/:userId/friends/:friendId
 * @param string id
 * @param string id
 * @returns object User
 */
export const addFriend = async (req: Request, res: Response): Promise<void> => {
  const { userId, friendId } = req.params;

  try {
    if (!ObjectId.isValid(userId)) {
      res.status(400).json({
        message: `POST addFriend: Invalid ObjectId format (userId): ${userId}`,
      });
      return;
    }

    if (!ObjectId.isValid(friendId)) {
      res.status(400).json({
        message: `POST addFriend: Invalid ObjectId format (friendId): ${friendId}`,
      });
      return;
    }

    if (userId == friendId) {
      console.error(`POST addFriend: users can't friend themselves`);
      res.status(422).json({
        message: 'Unprocessable Entity: users cannot friend themselves',
      });
      return;
    }

    const user = await User.findOneAndUpdate(
      { _id: userId }, // filter
      { $addToSet: { friends: friendId } }, // $addToSet operator adds a friend to the list but only if it's unique
      { runValidators: true, new: true } // run validation, return updated record
    );

    if (user) {
      console.info('POST addFriend called');
      res.status(200).json(user);
    } else {
      console.info('POST: addFriend NOT FOUND', userId);
      res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (error: unknown) {
    console.error('ERROR: POST addFriend', (error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
};

/**
 * DELETE Friend from user's friend list based on /users/:userId/friends/:friendId
 * @param string id
 * @param string id
 * @returns string
 */
export const deleteFriend = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { userId, friendId } = req.params;
  try {
    if (!ObjectId.isValid(userId)) {
      res.status(400).json({
        message: `DELETE deleteFriend: Invalid ObjectId format: ${userId}`,
      });
      return;
    }

    if (!ObjectId.isValid(friendId)) {
      res.status(400).json({
        message: `DELETE deleteFriend: Invalid ObjectId format (friendId): ${friendId}`,
      });
      return;
    }

    const user = await User.findOneAndUpdate(
      { _id: userId }, // filter
      { $pull: { friends: friendId } }, // $pull operator removes friendId from the friends array
      { runValidators: true, new: true } // run validation, return updated record
    );

    if (user) {
      console.info('DELETE deleteFriend called', friendId);
      res.status(200).json({ message: 'Friend deleted' });
    } else {
      console.info('DELETE: PUT deleteFriend NOT FOUND', friendId);
      res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (error: unknown) {
    console.error('ERROR: DELETE deleteFriend', (error as Error).message);
    res.status(500).json({ message: (error as Error).message });
  }
};
