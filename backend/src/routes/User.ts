// INSERT USER ASSOCIATED ROUTES
import express, { Request, Response } from "express";
import { ZLoginSchemaServer, ZSignupSchemaServer } from "../utils/types";
import { ZodError } from "zod";
import {
  ConnectMongoAtlas,
  GetDatabaseCollections,
} from "../database/database";
import { AuthenticateUser, ValidateData } from "../utils/middleware";

// Import Libraries Essential for Authentication and Authorization
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

// Set path of ENV
dotenv.config({ path: "../.env" });

// Instantiate Router
const router = express.Router();

// Login Post Route
router.post(
  "/login",
  ValidateData(ZLoginSchemaServer),
  async (req: Request, res: Response) => {
    try {
      // Connect to Database
      await ConnectMongoAtlas();

      // Retrieve User Collection
      const { UserCollection } = GetDatabaseCollections();

      // Get Data from Client
      const loginData = ZLoginSchemaServer.safeParse(req.body);

      // Initialize properties for authentication purposes
      const email = loginData.data?.email;
      const password = loginData.data?.password;

      // Verify if user's email is in the database
      const user = await UserCollection.findOne({ email });

      if (password !== undefined) {
        // If account exists, verify password
        if (user) {
          // Compare passwords if encrypted form is the same as raw password entered
          bcrypt.compare(password, user.password, (error, response) => {
            if (response) {
              // If password is correct, generate token - secret key must be at least 32 characters and expires in 1 hour
              const token = jwt.sign(
                { _id: user._id, email: user.email, username: user.username },
                process.env.JWT_SECRET_KEY || "",
                { expiresIn: "1h" }
              );

              // Attach Token to Cookie
              res.cookie("token", token, {
                httpOnly: false, // Set to false to allow Javascript access
                secure: false,
                sameSite: "strict",
                path: "/", // Explicit path
                maxAge: 3600000, // 1 hour
              });

              // Send Response
              return res.status(200).json({
                Status: "Success",
                message: "Account successfully logged in",
              });
            } else {
              // Return if password is incorrect
              return res.status(401).json({ error: "Password is incorrect" });
            }
          });
        } else {
          return res.status(404).json({ error: "User does not exist" });
        }
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(401).json({ error: "Account login failed" });
      } else {
        console.error("Unexpected error: ", error);
        return res.status(500).json({ error: "Unexpected error" });
      }
    }
  }
);

// Signup Post Route
router.post(
  "/signup",
  ValidateData(ZSignupSchemaServer),
  async (req: Request, res: Response) => {
    try {
      // Connect to Database
      await ConnectMongoAtlas();

      // Retrieve User Collection
      const { UserCollection } = GetDatabaseCollections();

      // Get data from client
      const signupData = ZSignupSchemaServer.safeParse(req.body);

      // Initialize properties for authentication purposes
      const username = signupData.data?.username;
      const email = signupData.data?.email;
      const password = signupData.data?.password;

      // Check if account already exists using entered email
      const user = await UserCollection.findOne({ email });

      // Prevent account creation if email is already registered
      if (user) {
        return res.status(409).json({ error: "Account already exists" });
      } else {
        // If this is a new record, hash password using 10x hashing rounds then insert data to database
        if (password !== undefined) {
          const hashPassword = await bcrypt.hash(password, 10);

          // Then insert the account details in the database
          await UserCollection.insertOne({
            username,
            email,
            password: hashPassword,
          });

          // Return success status
          res.status(201).json({
            Status: "Success",
            message: "Account successfully created",
          });
        }
      }
    } catch (error) {
      if (error instanceof ZodError) {
        return res.sendStatus(401).json({ error: "Account creation failed" });
      } else {
        console.error("Unexpected error: ", error);
        return res.status(500).json({ error: "Unexpected error" });
      }
    }
  }
);

// Navigation Get Route for Username Display
router.get(
  "/navigationName",
  AuthenticateUser,
  async (req: Request, res: Response) => {
    try {
      // Get the username from cookie
      const username = req.user?.username;
      return res.json({ username });
    } catch (error) {
      console.error(error);
    }
  }
);

// Logout Post Route
router.post("/logout", async (req: Request, res: Response) => {
  try {
    // Clear the cookie to clear token after logging out
    res.clearCookie("token", {
      path: "/", // Explicit path to match
    });
    res.send({ message: "Successfully logged out" });
  } catch (error) {
    console.error("Unexpected error: ", error);
    return res.status(500).json({ error: "Unexpected error" });
  }
});

export default router;
