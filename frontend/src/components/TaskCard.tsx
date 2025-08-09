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
import type { TTaskCardProps } from "../utils/types";

export default function TaskCard({
  _id,
  TaskName,
  TaskDeadline,
  TaskDescription,
  isFinished,
  onEdit,
  onChangeStatus,
  onDelete,
}: TTaskCardProps) {
  const navigateTo = useNavigate();

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

  // Apply useEffect for real-time tracking if a task is due - (Overdue - Red Border Outline : Not Overdue - Black Border Outline)
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

  // Function to Back away from ViewTask Page
  const HandleBack = () => {
    navigateTo(-1);
  };

  // Function to Toggle Edit
  const HandleEdit = () => {
    setIsEditing(true);
  };

  // Function to change the status of task (IP or Finished)
  const HandleChangeStatus = async (_id: string, newStatus: boolean) => {
    try {
      // Update the status from the client side
      if (onChangeStatus) {
        onChangeStatus(_id, !newStatus);
        setEditedTaskStatus(!newStatus);
      }

      // Change status on Database
      // Pass _id to change task status in the database through the server
      const response = await fetch(`/tasks/${_id}/changeStatus`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          isFinished: newStatus,
        }),
      });

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
      const response = await fetch(`/tasks/${_id}`, {
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

  const HandleSave = async (
    _id: string,
    editedTaskName: string,
    editedTaskDeadline: string,
    editedTaskDescription: string
  ) => {
    try {
      if (editedTaskName.trim().length === 0) {
        alert("Task name cannot be empty");
        setEditedTaskName(TaskName);
        throw new Error("Task name cannot be empty");
      }

      // Verify date since deadline must only be set for future not present or past
      const newTaskDeadline = new Date(editedTaskDeadline);
      // const verifyDeadline = newTaskDeadline;
      // verifyDeadline.setHours(23, 59, 59, 59);

      if (newTaskDeadline <= new Date()) {
        alert("Task deadline must be in the future");
        setEditedTaskDeadline(TaskDeadline.toISOString());
        throw new Error("Task deadline must be in the future");
      }

      // Update in Client
      if (onEdit) {
        onEdit(_id, editedTaskName, newTaskDeadline, editedTaskDescription);
      }

      // Only Call Route if there is/are any change(s) to update in the database through server
      if (
        editedTaskName !== TaskName ||
        newTaskDeadline.getTime() !== TaskDeadline.getTime() ||
        editedTaskDescription !== TaskDescription
      ) {
        // Pass _id and updated task properties
        const response = await fetch(`/tasks/${_id}`, {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            TaskName: editedTaskName,
            TaskDeadline: editedTaskDeadline,
            TaskDescription: editedTaskDescription,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to update the task");
        }
      }
      // Disable Edit mode after save
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    }
  };

  const HandleCancel = () => {
    // Reset the fields into their initial
    setEditedTaskName(TaskName);
    setEditedTaskDeadline(TaskDeadline.toISOString());
    setEditedTaskDescription(TaskDescription);
    // Disable editing status once cancelled
    setIsEditing(false);
  };

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
            <p className="text-center font-bold text-lg m-2">Editing Task...</p>
            <div className="mx-6 flex flex-col gap-y-2">
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
                <p className="text-center font-bold">Deadline: </p>
                <input
                  type="datetime-local"
                  value={formatDateInput(editedTaskDeadline)}
                  onChange={(e) =>
                    e.target.value && setEditedTaskDeadline(e.target.value)
                  }
                  className="bg-white border border-solid border-black"
                />
              </div>
            </div>
            <textarea
              value={editedTaskDescription}
              onChange={(e) => setEditedTaskDescription(e.target.value)}
              className="h-80 w-auto mx-8 my-2 bg-white overflow-y-scroll resize-none border border-solid border-black"
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
              <p className="whitespace-pre-wrap">{TaskDescription}</p>
            </div>
            <div className="flex justify-around my-auto">
              <button
                onClick={() => HandleEdit()}
                className="bg-[#8D61C3] flex justify-center items-center py-1 px-2 gap-x-1 rounded-3xl hover:bg-[#705591] hover:cursor-pointer w-20 transition-colors duration-400 ease-in-out"
              >
                <SquarePen color="white" />
                <p className="text-white font-bold">Edit</p>
              </button>
              {editedTaskStatus ? (
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
