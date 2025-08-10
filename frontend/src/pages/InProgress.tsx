import NavigationBar from "../components/NavigationBar";
import TaskItem from "../components/TaskItem";
import { ZGetTasksSchema, type TTaskProps } from "../utils/types";
import { motion } from "framer-motion";
import { pageVariants } from "../utils/util";
import { useEffect, useState } from "react";

export default function InProgress() {
  // Stateful Variables
  const [tasks, setTasks] = useState<TTaskProps[]>([]);

  // Fetch Data Once Page Mounts
  useEffect(() => {
    // Set Title
    document.title = "In Progress Tasks | Task Management System";

    const fetchTasks = async () => {
      try {
        // Include credentials for cookie authentication
        const response = await fetch("http://localhost:3000/tasks/inprogress", {
          method: "GET",
          credentials: "include",
        });

        // Receive the data in json
        const data = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch tasks");
        }

        data.modifiedData.forEach((task: TTaskProps) => {
          // Validate data received from server using Schema
          const parseResult = ZGetTasksSchema.safeParse(task);

          if (!parseResult.success) {
            throw new Error("Incorrect data");
          } else {
            // Convert TaskDeadline from string to Date object
            task.TaskDeadline = new Date(task.TaskDeadline);
          }
        });

        // Set the data into the stateful variable
        setTasks(data.modifiedData);
      } catch (error) {
        console.error(error);
      }
    };

    // Execute fetching
    fetchTasks();
  }, []);

  // Function Handler to Change the Status of a Task via TaskCard (IP or Finished)
  const HandleChangeStatus = (_id: string) => {
    setTasks((prevTasks) => {
      const updatedTasks = prevTasks.filter((prevTask) => prevTask._id !== _id);

      return updatedTasks;
    });
  };

  // Function Handler to Delete a Task via TaskCard
  const HandleDelete = (_id: string) => {
    setTasks((prevTasks) => {
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
        <main className="min-h-screen bg-white py-4 px-4">
          {tasks.length > 0 ? (
            <div className="flex flex-col gap-y-4">
              {tasks.map((task) => (
                <TaskItem
                  key={task._id}
                  {...task}
                  onChangeStatus={HandleChangeStatus}
                  onDelete={HandleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="flex justify-center items-center min-h-screen">
              <h1 className="italic text-center text-[#705591] font-bold">
                Looks like you have no task. Start creating one by pressing the
                New Task button.
              </h1>
            </div>
          )}
        </main>
      </motion.div>
    </>
  );
}
