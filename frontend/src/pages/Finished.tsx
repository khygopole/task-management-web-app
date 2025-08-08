import NavigationBar from "../components/NavigationBar";
import TaskItem from "../components/TaskItem";
import type { TTaskProps } from "../utils/types";
import { motion } from "framer-motion";
import { pageVariants } from "../utils/util";

export default function Finished() {
  const SampleData: TTaskProps[] = [
    {
      _id: "xdd1",
      TaskName:
        "Task 12345678910000000xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      TaskDescription:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum delectus impedit, iure minima magni necessitatibus, doloribus optio magnam nihil eos fugiat tempore error similique repellat commodi et sunt sint. Eos.",
      TaskDeadline: new Date("August 7, 2025 13:16:00"),
      isFinished: true,
    },
    {
      _id: "xdd2",
      TaskName:
        "Task 12345678910000000xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      TaskDescription:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum delectus impedit, iure minima magni necessitatibus, doloribus optio magnam nihil eos fugiat tempore error similique repellat commodi et sunt sint. Eos.",
      TaskDeadline: new Date("December 25, 2025 04:00:00"),
      isFinished: true,
    },
    {
      _id: "xdd3",
      TaskName: "Task  2",
      TaskDescription:
        "Lorem, ipsum dolor sit amet consectetur adipisicing elit. Laborum delectus impedit, iure minima magni necessitatibus, doloribus optio magnam nihil eos fugiat tempore error similique repellat commodi et sunt sint. Eos.",
      TaskDeadline: new Date("January 1, 2026 08:00:00"),
      isFinished: true,
    },
  ];
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
          <div className="flex flex-col gap-y-4">
            {SampleData.map((task) => (
              <TaskItem key={task._id} {...task} />
            ))}
          </div>
        </main>
      </motion.div>
    </>
  );
}
