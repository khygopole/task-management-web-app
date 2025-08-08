// Use Zod for Schema and Input Validation
import { z } from "zod";

// Type and Schema Involving User
// Login Schema
export const ZLoginSchema = z.object({
  email: z.email({ message: "Email cannot be empty" }),
  password: z.string().min(1, { message: "Password cannot be empty" }),
});

// SignUp Schema
export const ZSignupSchema = z
  .object({
    username: z.string().min(1, { message: "Username is required" }),
    email: z.email("Enter a valid email address"),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine((value) => /[A-Z]/.test(value), {
        message: "Password must have at least one uppercase letter",
      })
      .refine((value) => /[0-9]/.test(value), {
        message: "Password must have at least one number",
      }),
    confirmPassword: z.string().optional(),
  })
  .refine((value) => value.confirmPassword === value.password, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Export type of Login & Signup Schema
export type TLoginSchema = z.infer<typeof ZLoginSchema>;
export type TSignupSchema = z.infer<typeof ZSignupSchema>;

// Type and Schema Involving Tasks
export type TTaskProps = {
  _id: string;
  TaskName: string;
  TaskDescription: string;
  TaskDeadline: Date;
  isFinished: boolean;
};

export type TTaskItemProps = TTaskProps & {
  onChangeStatus?: (_id: string, newStatus: boolean) => void;
  onDelete?: (_id: string) => void;
};

export type TTaskCardProps = TTaskProps & {
  onEdit?: (
    _id: string,
    newTaskName: string,
    newTaskDeadline: Date,
    newTaskDescription: string
  ) => void;
  onChangeStatus?: (_id: string, newStatus: boolean) => void;
  onDelete?: (_id: string) => void;
};

export const ZNewTaskSchema = z.object({
  TaskName: z
    .string({ message: "Task Name must be a string" })
    .min(1, { message: "Task Name is required" })
    .refine((value) => value.trim().length > 0, {
      message: "Task Name cannot be blank",
    }),
  TaskDeadline: z
    .string()
    .min(1, { message: "Task Deadline is required" })
    .refine(
      (value) => {
        // Deadline set must be in the future
        const date = new Date(value);
        date.setHours(23, 59, 59, 59);
        return date >= new Date();
      },
      { message: "Task Deadline must be in the future" }
    ),
  TaskDescription: z.string({ message: "Task Description must be a string" }),
});

export const ZGetTasksSchema = z.object({
  TaskName: z
    .string({ message: "Task Name must be a string" })
    .min(1, { message: "Task Name is required" })
    .refine((value) => value.trim().length > 0, {
      message: "Task Name cannot be blank",
    }),
  TaskDeadline: z.string({ message: "Task Deadline must be a string" }),
});

export type TNewTaskSchema = z.infer<typeof ZNewTaskSchema>;
