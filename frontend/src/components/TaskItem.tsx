import { BookOpen, Clock, SquareCheckBig, Trash2 } from "lucide-react";
import type { TTaskItemProps } from "../utils/types";
import { formatDateDisplay } from "../utils/util";
import { useEffect, useState } from "react";
import clsx from "clsx";
import { useLocation, useNavigate } from "react-router-dom";

export default function TaskItem({
  _id,
  TaskName,
  TaskDeadline,
  TaskDescription,
  isFinished,
  onChangeStatus,
  onDelete,
}: TTaskItemProps) {
  const navigateTo = useNavigate();
  const location = useLocation();
  // For Adaptive Color Outline
  const currentDate = new Date();
  const [highlightColor, setHighlightColor] = useState<String>(
    currentDate < TaskDeadline ? "border-black" : "border-[#FF0000]"
  );

  // useEffect to update the border color of a task in real-time depending on its status (Red - Overdue, Black - In Progress)
  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date();
      const isPastDue = currentDate > TaskDeadline;
      setHighlightColor((prevHighlightColor) => {
        const newHighlightColor = isPastDue
          ? "border-[#FF0000]"
          : "border-black";

        return prevHighlightColor === newHighlightColor
          ? prevHighlightColor
          : newHighlightColor;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [TaskDeadline]);

  // Function Handler to View a Task then goes to ViewTask Page
  const HandleView = (_id: string, TaskName: string, isFinished: boolean) => {
    // Encodes the taskname as param url
    navigateTo(`/view/${encodeURIComponent(TaskName)}`, {
      state: { id: _id, isFinished: isFinished },
    });
  };

  // Function to change the status of task (IP or Finished) which then removes the task from the page
  const HandleChangeStatus = async (_id: string, newStatus: boolean) => {
    try {
      // Remove the task from the page as its status has been changed then reverse its status
      if (onChangeStatus) {
        onChangeStatus(_id, !newStatus);
      }

      // Change status on Database
      // Pass _id to change task status in the database through the server
      const response = await fetch(
        `http://localhost:3000/tasks/${_id}/changeStatus`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            isFinished: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to change task status");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // Function to delete the task
  const HandleDelete = async (_id: string) => {
    try {
      // Go to delete route to delete the specified task from the database
      const response = await fetch(`http://localhost:3000/tasks/${_id}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) {
        alert("Failed to delete task");
        throw new Error("Failed to delete task");
      }

      // Delete task from client
      if (onDelete) {
        onDelete(_id);
      }
      alert("Task deleted successfully");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className={clsx(
        `bg-[#D9D9D9] border-2 border-solid  flex md:flex-row flex-col min-w-full md:h-25 h-60 rounded-4xl items-center gap-x-2 p-4 ${highlightColor}`,
        { "border-green-600": isFinished }
      )}
    >
      <div className="flex md:flex-col items-center gap-x-4">
        <p className="text-sm">Deadline</p>
        <p className="text-sm font-semibold">{`${
          formatDateDisplay(TaskDeadline).formattedDate
        }`}</p>
        <p className="text-sm font-semibold">{`${
          formatDateDisplay(TaskDeadline).formattedTime
        }`}</p>
      </div>
      <p className="font-bold text-center truncate md:w-1/4 w-full">
        {TaskName}
      </p>
      <div className="md:overflow-hidden md:overflow-ellipsis md:whitespace-pre-wrap md:w-3/5 w-2/3 md:h-full h-auto text-sm px-6 py-1 text-left whitespace-pre-wrap m-2 md:bg-transparent bg-white overflow-y-scroll md:m-4">
        {TaskDescription}
      </div>
      <div className="flex gap-x-2 mt-2">
        <button
          onClick={() => HandleView(_id, TaskName, isFinished)}
          className="bg-[#8D61C3] flex justify-center items-center py-1 px-2 gap-x-1 rounded-3xl hover:bg-[#705591] hover:cursor-pointer w-20 transition-colors duration-400 ease-in-out"
        >
          <BookOpen color="white" size={20} />
          <p className="text-white text-sm font-bold">View</p>
        </button>
        {location.pathname === "/inprogress" ? (
          <button
            onClick={() => HandleChangeStatus(_id, isFinished)}
            className="bg-green-600 flex justify-center items-center py-1 px-2 gap-x-1 rounded-3xl hover:bg-green-800 hover:cursor-pointer w-20 transition-colors duration-400 ease-in-out"
          >
            <SquareCheckBig color="white" size={20} />
            <p className="text-white text-sm font-bold">Done</p>
          </button>
        ) : (
          <button
            onClick={() => HandleChangeStatus(_id, isFinished)}
            className="bg-yellow-600 flex justify-center items-center py-1 px-2 gap-x-1 rounded-3xl hover:bg-yellow-800 hover:cursor-pointer w-20 transition-colors duration-400 ease-in-out"
          >
            <Clock color="white" size={20} />
            <p className="text-white text-sm font-bold">IP</p>
          </button>
        )}
        <button
          onClick={() => HandleDelete(_id)}
          className="bg-red-600 flex justify-center items-center py-1 px-2 gap-x-1 rounded-3xl hover:bg-red-800 hover:cursor-pointer w-20 transition-colors duration-400 ease-in-out"
        >
          <Trash2 color="white" size={20} />
          <p className="text-white text-sm font-bold">Delete</p>
        </button>
      </div>
    </div>
  );
}
