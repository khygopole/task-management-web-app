import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

dotenv.config({ path: "../../../.env" });

// Middleware for Validating Data using Zod Schema
export function ValidateData(schema: any) {
  return (req: Request, res: Response, next: NextFunction) => {
    // Apply Zod safeParse to validate data using the schema
    const parseResult = schema.safeParse(req.body);

    if (!parseResult.success) {
      // Send error response if validation failed
      return res.status(400).json({
        message: "Validation failed. Please enter all required information",
        errors: parseResult.error.errors,
      });
    }

    // If validation passed, continue to the next middleware or route handler
    next();
  };
}

// Middleware for Verifying if User is Authenticated
export const AuthenticateUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get Token in cookies
  const token = req.cookies?.token;

  // Prohibit access if no token
  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return;
  }

  // If there is a token, decode it using the JWT token
  try {
    // Decode token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY || "");

    // Check if token is an object then verify id, email, and username
    if (
      typeof decodedToken === "object" &&
      "_id" in decodedToken &&
      "email" in decodedToken &&
      "username" in decodedToken
    ) {
      // Attach decoded token in req.user
      req.user = decodedToken as {
        _id: string;
        email: string;
        username: string;
      };

      // Go to the next route handler
      next();
    } else {
      return;
    }
  } catch (error) {
    res.status(403).json({ message: "Invalid or token expired" });
  }
};
