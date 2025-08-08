// Insert Server Types
import { Collection } from "mongodb";
import { ObjectId } from "mongodb";
import { z } from "zod";

// Database Associated Types
export type collections = {
  UserCollection: Collection;
  TaskCollection: Collection;
};

// User Associated Types or Schema
export const ZLoginSchemaServer = z.object({
  email: z.email({ message: "Enter a valid email address" }),
  password: z.string(),
});

export const ZSignupSchemaServer = z
  .object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.email({ message: "Enter a valid email address" }),
    password: z.string(),
    confirmPassword: z.string().optional(),
  })
  .refine((value) => value.confirmPassword === value.password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Task Associated Types or Schema
export const ZNewTaskSchemaServer = z.object({
  TaskName: z
    .string()
    .min(1, { message: "Task Name is required" })
    .refine((value) => value.trim().length > 0, {
      message: "Task Name cannot be blank",
    }),
  TaskDeadline: z
    .string()
    .min(1, { message: "Task Deadline is required" })
    .refine(
      (value) => {
        const date = new Date(value);
        date.setHours(23, 59, 59, 59);
        return date >= new Date();
      },
      { message: "Task Deadline must be in the future" }
    ),
  TaskDescription: z.string().optional().nullable(),
});

export const ZEditTaskSchemaServer = z.object({
  TaskName: z
    .string()
    .min(1, {
      message: "Task Name is required",
    })
    .refine((value) => value.trim().length > 0, {
      message: "Task Name cannot be blank",
    }),
  TaskDeadline: z
    .string()
    .min(1, { message: "Task Deadline is required" })
    .refine(
      (value) => {
        const date = new Date(value);
        date.setHours(23, 59, 59, 59);
        return date >= new Date();
      },
      { message: "Task Deadline must be in the future" }
    ),
  TaskDescription: z.string().optional().nullable(),
});

export type TDatabaseTaskProps = {
  _id: ObjectId;
  name: string;
  deadline: Date;
  description: string;
  isFinished: boolean;
  userID: string;
};

declare global {
  namespace Express {
    interface Request {
      user?: { _id: string; email: string; username: string };
    }
  }
}
