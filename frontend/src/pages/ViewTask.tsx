import { useLocation } from "react-router-dom";
import NavigationBar from "../components/NavigationBar";
import TaskCard from "../components/TaskCard";
import { useEffect, useState } from "react";
import { ZGetTasksSchema, type TTaskProps } from "../utils/types";
import { pageVariants } from "../utils/util";
import { motion } from "framer-motion";

export default function ViewTask() {
  // Get id and isFinished states
  const location = useLocation();
  const taskId = location.state?.id;
  // const taskIsFinished = location.state?.isFinished;
  // const [taskStatus, setTaskStatus] = useState<boolean>(taskIsFinished)

  const [task, setTask] = useState<TTaskProps[]>([]);
  const [hasBeenEdited, setHasBeenEdited] = useState<boolean>(false);

  useEffect(() => {
    // Set title
    document.title = `${location.pathname
      .slice(6)
      .replace(/%20/g, "")} | Task Management System`;

    const fetchTask = async () => {
      try {
        // Fetch the specified task using task id
        const response = await fetch(`/tasks/${taskId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch task");
        }

        // Get task properties
        const data = await response.json();

        data.modifiedData.forEach((task: TTaskProps) => {
          // Validate data received from server using schema
          const parseResult = ZGetTasksSchema.safeParse(task);

          if (!parseResult.success) {
            throw new Error("Incorrect data");
          } else {
            // Convert deadline from string to date object
            task.TaskDeadline = new Date(task.TaskDeadline);
          }
        });

        // Set task to stateful variable
        setTask(data.modifiedData);
      } catch (error) {
        console.error(error);
      }

      // Execute fetching
      fetchTask();
    };

    fetchTask();
  }, [hasBeenEdited]);

  // Function Handler for Editing the Task via TaskCard
  const HandleEdit = (
    _id: string,
    newTaskName: string,
    newTaskDeadline: Date,
    newTaskDescription: string
  ) => {
    setTask((prevTask) =>
      prevTask?.map((task) =>
        task._id === _id
          ? {
              ...task,
              TaskName: newTaskName,
              TaskDeadline: newTaskDeadline,
              TaskDescription: newTaskDescription,
            }
          : task
      )
    );
    // Update Status of Edit so that due tracking for highlight color in TaskCard will still reflect after editing
    setHasBeenEdited((prevStatus) => !prevStatus);
  };

  // Function Handler to Change the Status of a Task via TaskCard (IP or Finished)
  const HandleChangeStatus = (_id: string, newStatus: boolean) => {
    setTask((prevTask) =>
      prevTask?.map((task) =>
        task._id === _id
          ? {
              ...task,
              isFinished: newStatus,
            }
          : task
      )
    );
  };

  // Function Handler to Delete a Task via TaskCard
  const HandleDelete = (_id: string) => {
    setTask((prevTasks) => {
      const updatedTasks = prevTasks.filter((prevTask) => prevTask._id !== _id);

      return updatedTasks;
    });
  };

  return (
    <>
      <NavigationBar />
      <motion.div
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 30,
        }}
      >
        <main className="min-h-screen bg-white py-4 px-4 flex justify-center items-center">
          {task.map((task) => (
            <TaskCard
              key={task._id}
              {...task}
              onEdit={HandleEdit}
              onChangeStatus={HandleChangeStatus}
              onDelete={HandleDelete}
            />
          ))}
        </main>
      </motion.div>
    </>
  );
}
