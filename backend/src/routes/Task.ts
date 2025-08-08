// INSERT TASK ASSOCIATED ROUTES
// Import Essential Libraries and Schema
import express, { Request, Response } from "express";
import { ObjectId, WithId } from "mongodb";
import { ZEditTaskSchemaServer, ZNewTaskSchemaServer } from "../utils/types";

// import Middleware and other essential types and functions
import { ValidateData, AuthenticateUser } from "../utils/middleware";
import {
  ConnectMongoAtlas,
  GetDatabaseCollections,
} from "../database/database";
import { TDatabaseTaskProps } from "../utils/types";
import { modifyData } from "../utils/util";

// Instantiate Router
const router = express.Router();

// NewTask Post Route to Create a Task
router.post(
  "/newtask",
  AuthenticateUser,
  ValidateData(ZNewTaskSchemaServer),
  async (req: Request, res: Response) => {
    try {
      // Connect to database
      await ConnectMongoAtlas();

      // Retrieve Task Collection
      const { TaskCollection } = GetDatabaseCollections();

      // Add the task data into the database
      const result = await TaskCollection.insertOne({
        name: req.body.TaskName,
        deadline: req.body.TaskDeadline,
        description: req.body.TaskDescription,
        isFinished: false,
        userID: req.user?._id, // Set the user id of the current user active which will serve as key when accessing tasks, retrieved from token
      });

      if (result.acknowledged) {
        res.status(201).json({
          message: "A New Task has been successfully created",
        });
      } else {
        return res.status(500).json({ message: "Failed to create new task" });
      }
    } catch (error) {
      console.error(error);
    }
  }
);

// InProgress Get Route to retrieve inprogress tasks
router.get(
  "/inprogress",
  AuthenticateUser,
  async (req: Request, res: Response) => {
    try {
      // Connect to the database
      await ConnectMongoAtlas();

      // Retrieve Task Collection
      const { TaskCollection } = GetDatabaseCollections();

      // Get userID and username from the token via cookies
      const userID = req.user?._id;
      const username = req.user?.username;

      // Retrieve all inprogress tasks from database using the userID as key then convert Cursor data type from MongoDB into Array
      const inprogressTasks = (await TaskCollection.find({
        userID,
        isFinished: false,
      })
        .sort({ deadline: 1 })
        .toArray()) as WithId<TDatabaseTaskProps>[];
      // This is essential to explicitly and strictly state that the type of inprogressTasks will be WithId<TDatabaseTaskProps>[]

      // Use modifyData function to modify the keys
      const modifiedData = modifyData(inprogressTasks);

      // Return an empty array if there is no inprogress tasks for the user
      if (inprogressTasks.length === 0) {
        return res.status(404).json({
          inprogressTasks: [],
          username,
          message: "User has no in progress tasks",
        });
      } else {
        return res.status(200).json({
          modifiedData,
          username,
          message: "Successfully retrieved in progress tasks",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
);

// Finished Get Route to retrieve finished tasks
router.get(
  "/finished",
  AuthenticateUser,
  async (req: Request, res: Response) => {
    try {
      // Connect to the database
      await ConnectMongoAtlas();

      // Retrieve Task Collection
      const { TaskCollection } = GetDatabaseCollections();

      // Get userID and username from the token via cookies
      const userID = req.user?._id;
      const username = req.user?.username;

      // Retrieve all finished tasks from database using the userID as key then convert Cursor data type from MongoDB into Array
      const finishedTasks = (await TaskCollection.find({
        userID,
        isFinished: true,
      })
        .sort({ deadline: 1 })
        .toArray()) as WithId<TDatabaseTaskProps>[];
      // This is essential to explicitly and strictly state that the type of finishedTasks will be WithId<TDatabaseTaskProps>[]

      // Use modifyData function to modify the keys
      const modifiedData = modifyData(finishedTasks);

      // Return an empty array if there is no finished tasks for the user
      if (finishedTasks.length === 0) {
        return res.status(404).json({
          finishedTasks: [],
          username,
          message: "User has no in finished tasks",
        });
      } else {
        return res.status(200).json({
          modifiedData,
          username,
          message: "Successfully retrieved finished tasks",
        });
      }
    } catch (error) {
      console.error(error);
    }
  }
);

// View Task Routes
router
  .route("/:id")
  // Get Route to Retrieve a Specific Task
  .get(AuthenticateUser, async (req: Request, res: Response) => {
    // Retrieve task id and key/value pairs
    const { id } = req.params;
    // const { TaskName, TaskDeadline, TaskDescription } = req.body;

    // Retrieve userID and username from cookie
    const userID = req.user?._id;
    const username = req.user?.username;

    try {
      // Connect to Database
      await ConnectMongoAtlas();

      // Retrieve Task Collection
      const { TaskCollection } = GetDatabaseCollections();

      // Get the specified task
      const task = (await TaskCollection.find({
        userID,
        _id: new ObjectId(id),
      }).toArray()) as WithId<TDatabaseTaskProps>[];
      // This is essential to explicitly and strictly state that the type of task will be WithId<TDatabaseTaskProps>[]

      // Use modifyData function to modify the keys
      const modifiedData = modifyData(task);

      // Return an empty array if task is not found
      if (task.length === 0) {
        return res.status(404).json({
          task: [],
          username,
          message: "Task not found or Unauthorized access",
        });
      } else {
        return res.status(200).json({
          modifiedData,
          username,
          message: "Successfully retrieved the task",
        });
      }
    } catch (error) {
      console.error(error);
    }
  })
  // Put Route to Update the Task when Editing
  .put(
    AuthenticateUser,
    ValidateData(ZEditTaskSchemaServer),
    async (req: Request, res: Response) => {
      // Retrieve id and key/value pairs
      const { id } = req.params;
      const { TaskName, TaskDeadline, TaskDescription } = req.body;

      // Retrieve userID and username from cookie
      const userID = req.user?._id;

      try {
        // Connect to database
        await ConnectMongoAtlas();

        // Retrieve Task Collection
        const { TaskCollection } = GetDatabaseCollections();

        // Update Task from Database
        const result = await TaskCollection.updateOne(
          { _id: new ObjectId(id), userID },
          {
            $set: {
              name: TaskName,
              deadline: TaskDeadline,
              description: TaskDescription,
            },
          }
        );

        // Verify if task is in the database
        if (result.matchedCount === 0) {
          return res
            .status(404)
            .json({ message: "Task not found or Unauthorized access" });
        }

        return res.status(200).json({ message: "Task updated successfully" });
      } catch (error) {
        console.error(error);
      }
    }
  )
  // Delete route to remove a task from the database
  .delete(AuthenticateUser, async (req: Request, res: Response) => {
    // Retrieve task id
    const { id } = req.params;
    // const {TaskName, TaskDeadline, TaskDescription} = req.body;

    // Retrieve userID from cookie
    const userID = req.user?._id;

    try {
      // Connect to database
      await ConnectMongoAtlas();

      // Retrieve Task Collection
      const { TaskCollection } = GetDatabaseCollections();

      // Delete task from the database using userID and task id
      const result = await TaskCollection.deleteOne({
        _id: new ObjectId(id),
        userID,
      });

      // Check if the task has been deleted
      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: "Task to be deleted not found or Unauthorized access",
        });
      }

      return res.status(200).json({ message: "Task deleted successfully" });
    } catch (error) {
      console.error(error);
    }
  });

// Put Route to change status of task IP or Finished
router.put(
  "/:id/changeStatus",
  AuthenticateUser,
  async (req: Request, res: Response) => {
    // Retrieve id and isFinished property
    const { id } = req.params;
    const { isFinished } = req.body;

    // Retrieve userID from cookie
    const userID = req.user?._id;

    try {
      // Connect to database
      await ConnectMongoAtlas();

      // Retrieve Task Collection
      const { TaskCollection } = GetDatabaseCollections();

      // Update task by reversing its status
      const result = await TaskCollection.updateOne(
        {
          _id: new ObjectId(id),
          userID,
        },
        {
          $set: {
            isFinished: !isFinished,
          },
        }
      );

      // Verify if task is in the database
      if (result.matchedCount === 0) {
        return res
          .status(404)
          .json({ message: "Task not found or Unauthorized access" });
      }

      res.status(200).json({ message: "Task updated successfully" });
    } catch (error) {
      console.error(error);
    }
  }
);

export default router;
