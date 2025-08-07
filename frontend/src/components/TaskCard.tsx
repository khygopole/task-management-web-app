import {
  ArrowLeft,
  CircleX,
  Clock,
  Save,
  SquareCheckBig,
  SquarePen,
  Trash2,
} from "lucide-react";
import { formatDateDisplay, formatDateInput } from "../utils/util";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import clsx from "clsx";
import type { TModifiedTaskProps } from "../utils/types";

export default function TaskCard({
  _id,
  TaskName,
  TaskDeadline,
  TaskDescription,
  isFinished,
  onEdit,
  onChangeStatus,
  onDelete,
}: TModifiedTaskProps) {
  const navigateTo = useNavigate();

  console.log(TaskName);
  // Sample Data
  // const TaskName = "Task Namexddddddddddddddddddddddddddddddddddddddddddddd";
  // const TaskDeadline = new Date("August 7, 2025 16:07:00");
  // const TaskDescription =
  //   "Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsum odio perferendis repudiandae optio quas corporis non. Consectetur amet nisi aperiam ad corrupti facere dignissimos voluptatum suscipit laborum quidem, omnis laboriosam.";
  // const isFinished = true;

  // Stateful Variables for Editing Properties
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [editedTaskName, setEditedTaskName] = useState(TaskName);
  const [editedTaskDeadline, setEditedTaskDeadline] = useState(
    TaskDeadline.toISOString()
  );
  const [editedTaskDescription, setEditedTaskDescription] =
    useState(TaskDescription);
  const [editedTaskStatus, setEditedTaskStatus] = useState(isFinished);

  // For Adaptive Color Outline
  const currentDate = new Date();
  const [highlightColor, setHighlightColor] = useState<String>(
    currentDate < TaskDeadline ? "border-black" : "border-[#FF0000]"
  );

  // Function to Back away from ViewTask Page
  const HandleBack = () => {
    console.log("Go back to previously accessed page");
    navigateTo(-1);
  };

  // Function to Toggle Edit
  const HandleEdit = () => {
    console.log("Edit prompt");
    setIsEditing(true);
  };

  // Function to change the status of task (IP or Finished)
  const HandleChangeStatus = (_id: string, newStatus: boolean) => {
    console.log("Reverse Status, value of isFinished");
    if (onChangeStatus) {
      onChangeStatus(_id, !newStatus);
    }

    // Change status on Database
  };

  // Function to delete the task
  const HandleDelete = (_id: string) => {
    console.log("Delete a task");
    // Delete task from the database

    // Delete task from client
    if (onDelete) {
      onDelete(_id);
    }
  };

  const HandleSave = (
    _id: string,
    editedTaskName: string,
    editedTaskDeadline: string,
    editedTaskDescription: string
  ) => {
    console.log("Save then submit to server");

    // Perform Update in Client then Database
    const newTaskDeadline = new Date(editedTaskDeadline);

    // Updated in Client
    if (onEdit) {
      onEdit(_id, editedTaskName, newTaskDeadline, editedTaskDescription);
    }

    setIsEditing(false);
  };

  const HandleCancel = () => {
    console.log("Set Editing to false");
    setIsEditing(false);
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
    <>
      <div
        className={clsx(
          `bg-[#D9D9D9] w-120 h-130 flex flex-col rounded-3xl border-solid border-2 ${highlightColor}`,
          { "border-green-600": isFinished }
        )}
      >
        {isEditing ? (
          <>
            <p className="text-center font-bold text-lg m-4">Editing Task...</p>
            <div className="mx-6">
              <div className="flex justify-center">
                <input
                  type="text"
                  value={editedTaskName}
                  onChange={(e) => setEditedTaskName(e.target.value)}
                  placeholder="Edit Task Name"
                  className="bg-white text-center font-bold border border-solid border-black w-full"
                />
              </div>
              <div className="flex justify-center gap-x-2">
                {/* <p className="text-center font-bold">{`Deadline: ${
                  formatDateDisplay(TaskDeadline).formattedDate
                } ${formatDateDisplay(TaskDeadline).formattedTime}`}</p> */}
                <p className="text-center font-bold">Deadline: </p>
                <input
                  type="datetime-local"
                  value={formatDateInput(editedTaskDeadline)}
                  onChange={(e) => setEditedTaskDeadline(e.target.value)}
                  className="bg-white border border-solid border-black"
                />
              </div>
            </div>
            <textarea
              value={editedTaskDescription}
              onChange={(e) => setEditedTaskDescription(e.target.value)}
              className="h-80 w-auto mx-8 my-2 bg-white overflow-y-scroll resize-none"
            />
            <div className="flex justify-end my-auto mr-8 gap-x-5">
              <button
                onClick={() =>
                  HandleSave(
                    _id,
                    editedTaskName,
                    editedTaskDeadline,
                    editedTaskDescription
                  )
                }
                className="bg-green-600 flex justify-center items-center py-1 px-2 gap-x-1 rounded-3xl hover:bg-green-800 hover:cursor-pointer w-25 transition-colors duration-400 ease-in-out"
              >
                <Save color="white" />
                <p className="text-white font-bold">Save</p>
              </button>

              <button
                onClick={() => HandleCancel()}
                className="bg-red-600 flex justify-center items-center py-1 px-2 gap-x-1 rounded-3xl hover:bg-red-800 hover:cursor-pointer w-25 transition-colors duration-400 ease-in-out"
              >
                <CircleX color="white" />
                <p className="text-white font-bold">Cancel</p>
              </button>
            </div>
          </>
        ) : (
          <>
            <button
              onClick={() => HandleBack()}
              className="col-span-1 mr-auto flex bg-[#E29614] hover:bg-[#FFEE04] hover:cursor-pointer rounded-3xl py-1 px-4 gap-x-1 items-center m-3 transition-colors duration-400 ease-in-out"
            >
              <ArrowLeft />
              <p className="font-bold">Back</p>
            </button>
            <div className="mx-6">
              <p className="text-center font-bold truncate">{TaskName}</p>
              <p className="text-center font-bold">{`Deadline: ${
                formatDateDisplay(TaskDeadline).formattedDate
              } ${formatDateDisplay(TaskDeadline).formattedTime}`}</p>
            </div>
            <div className="h-80 w-auto mx-8 my-2 bg-white overflow-y-scroll">
              <p className="">{TaskDescription}</p>
            </div>
            <div className="flex justify-around my-auto">
              <button
                onClick={() => HandleEdit()}
                className="bg-[#8D61C3] flex justify-center items-center py-1 px-2 gap-x-1 rounded-3xl hover:bg-[#705591] hover:cursor-pointer w-20 transition-colors duration-400 ease-in-out"
              >
                <SquarePen color="white" />
                <p className="text-white font-bold">Edit</p>
              </button>
              {isFinished ? (
                <button
                  onClick={() => HandleChangeStatus(_id, isFinished)}
                  className="bg-yellow-600 flex justify-center items-center py-1 px-2 gap-x-1 rounded-3xl hover:bg-yellow-800 hover:cursor-pointer w-20 transition-colors duration-400 ease-in-out"
                >
                  <Clock color="white" />
                  <p className="text-white font-bold">IP</p>
                </button>
              ) : (
                <button
                  onClick={() => HandleChangeStatus(_id, isFinished)}
                  className="bg-green-600 flex justify-center items-center py-1 px-2 gap-x-1 rounded-3xl hover:bg-green-800 hover:cursor-pointer w-20 transition-colors duration-400 ease-in-out"
                >
                  <SquareCheckBig color="white" />
                  <p className="text-white font-bold">Done</p>
                </button>
              )}
              <button
                onClick={() => HandleDelete(_id)}
                className="bg-red-600 flex justify-center items-center py-1 px-2 gap-x-1 rounded-3xl hover:bg-red-800 hover:cursor-pointer w-20 transition-colors duration-400 ease-in-out"
              >
                <Trash2 color="white" />
                <p className="text-white font-bold">Delete</p>
              </button>
            </div>
          </>
        )}
      </div>
    </>
  );
}
