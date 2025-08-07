import { useEffect } from "react";
import NavigationBar from "../components/NavigationBar";
import TaskForm from "../components/TaskForm";
import { motion } from "framer-motion";
import { pageVariants } from "../utils/util";

export default function NewTask() {
  useEffect(() => {
    document.title = "New Task | Task Management System";
  }, []);
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
          <TaskForm />
        </main>
      </motion.div>
    </>
  );
}
