import { BookOpen, Clock, SquareCheckBig, Trash2 } from "lucide-react";
import type { TTaskProps } from "../utils/types";
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
}: TTaskProps) {
  const navigateTo = useNavigate();
  const location = useLocation();
  // For Adaptive Color Outline
  const currentDate = new Date();
  const [highlightColor, setHighlightColor] = useState<String>(
    currentDate < TaskDeadline ? "border-black" : "border-[#FF0000]"
  );

  // const highlightColor = "border-[#FF0000]";

  const HandleView = (_id: string, TaskName: string, isFinished: boolean) => {
    console.log("View a Task");
    navigateTo(`/view/${encodeURIComponent(TaskName)}`, {
      state: { id: _id, isFinished: isFinished },
    });
  };

  const HandleChangeStatus = () => {
    console.log("Reverse Status, value of isFinished");
  };

  const HandleDelete = () => {
    console.log("Delete a task");
  };

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

  return (
    <div
      className={clsx(
        `bg-[#D9D9D9] border-2 border-solid  flex md:flex-row flex-col min-w-full md:h-25 rounded-4xl items-center gap-x-2 p-4 ${highlightColor}`,
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
      <p className="truncate md:w-3/5 w-full text-sm">{TaskDescription}</p>
      <div className="flex gap-x-2 mt-2">
        <button
          onClick={() => HandleView(_id, TaskName, isFinished)}
          className="bg-[#8D61C3] flex justify-center items-center py-1 px-2 gap-x-1 rounded-3xl hover:bg-[#705591] hover:cursor-pointer w-20 transition-colors duration-400 ease-in-out"
        >
          <BookOpen color="white" size={20} />
          <p className="text-white text-sm font-bold">View</p>
        </button>
        {location.pathname === "/inProgress" ? (
          <button
            onClick={() => HandleChangeStatus()}
            className="bg-green-600 flex justify-center items-center py-1 px-2 gap-x-1 rounded-3xl hover:bg-green-800 hover:cursor-pointer w-20 transition-colors duration-400 ease-in-out"
          >
            <SquareCheckBig color="white" size={20} />
            <p className="text-white text-sm font-bold">Done</p>
          </button>
        ) : (
          <button
            onClick={() => HandleChangeStatus()}
            className="bg-yellow-600 flex justify-center items-center py-1 px-2 gap-x-1 rounded-3xl hover:bg-yellow-800 hover:cursor-pointer w-20 transition-colors duration-400 ease-in-out"
          >
            <Clock color="white" size={20} />
            <p className="text-white text-sm font-bold">IP</p>
          </button>
        )}
        <button
          onClick={() => HandleDelete()}
          className="bg-red-600 flex justify-center items-center py-1 px-2 gap-x-1 rounded-3xl hover:bg-red-800 hover:cursor-pointer w-20 transition-colors duration-400 ease-in-out"
        >
          <Trash2 color="white" size={20} />
          <p className="text-white text-sm font-bold">Delete</p>
        </button>
      </div>
    </div>
  );
}
