/*
TODO:
BONUS: Remove a user's associated thoughts when deleted.
/api/users/:userId/friends/:friendId
    POST to add a new friend to a user's friend list
    DELETE to remove a friend from a user's friend list
*/

/* 
 * User Controller API
 * 
 * Supports CRUD routes for the mongoose User model
 * 
 * Routes:
 *  /api/users
 *  /api/users/:userId
 *
 */

import { User } from "../models/index.js";
import { Request, Response } from "express";
import { ObjectId } from "mongodb";

/**
 * GET ALL Users /users
 * @param _req (for typescript intentionally unused)
 * @returns an array of Users
 */
export const getAllUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find();

    console.info("GET getAllUsers called");
    res.json(users);
  } catch (error: any) {
    console.error("ERROR: GET getAllUsers", error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * GET User based on id /users/:id
 * @param string id
 * @returns a single User object
 */
export const getUserById = async (req: Request, res: Response) => {
  const { userId } = req.params;

  try {
    if (!ObjectId.isValid(userId)) {
      throw new Error(`GET getUserById: Invalid ObjectId format: ${userId}`);
    }

    const user = await User.findById(userId);

    if (user) {
      console.info("GET getUserById called", userId);
      res.status(200).json(user);
    } else {
      console.info("ERROR: GET getUserById NOT FOUND", userId);
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error: any) {
    console.error("ERROR: GET getUserById", error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * POST Create a User /users
 * @param object User
 * @returns create a single User object
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const user = await User.create(req.body);

    console.info("POST createUser called");
    res.status(200).json(user);
  } catch (error: any) {
    console.error("ERROR: POST createUser", error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * PUT Update a User based on id /users/:id
 * @param object id, userId
 * @returns a single User object
 */
export const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    if (!ObjectId.isValid(userId)) {
      throw new Error(`PUT updateUser: Invalid ObjectId format: ${userId}`);
    }

    const user = await User.findOneAndUpdate(
      { _id: userId }, // filter
      { $set: req.body },
      { runValidators: true, new: true } // run validation, return updated record
    );

    if (user) {
      console.info("PUT updateUser called", userId);
      res.status(200).json(user);
    } else {
      console.info("ERROR: PUT updateUser NOT FOUND", userId);
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error: any) {
    console.error("ERROR: PUT updateUser", error.message);
    res.status(500).json({ message: error.message });
  }
};

/**
 * DELETE User based on id /users/:id
 * @param string id
 * @returns string
 */
export const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;
  try {
    if (!ObjectId.isValid(userId)) {
      throw new Error(`DELETE deleteUser: Invalid ObjectId format: ${userId}`);
    }

    const user = await User.findOneAndDelete({ _id: userId });

    if (user) {
      console.info("DELETE deleteUser called", userId);
      res.status(200).json({ message: "User deleted" });
    } else {
      console.info("DELETE: PUT deleteUser NOT FOUND", userId);
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error: any) {
    console.error("ERROR: DELETE deleteUser", error.message);
    res.status(500).json({ message: error.message });
  }
};
