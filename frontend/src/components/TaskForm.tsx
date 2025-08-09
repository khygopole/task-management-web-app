import { Upload } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { type TNewTaskSchema, ZNewTaskSchema } from "../utils/types";
import { useForm } from "react-hook-form";
import axios from "axios";
import clsx from "clsx";

export default function TaskForm() {
  // Setup Zod Schema for Inputs
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<TNewTaskSchema>({
    resolver: zodResolver(ZNewTaskSchema),
  });

  // Form Submission Handler
  const HandleSubmitTask = async (data: TNewTaskSchema) => {
    try {
      await axios.post("/tasks/newtask", data, {
        withCredentials: true,
      });
      // Notify user that task is created successfully
      alert("Task created successfully");
      // Reset the form fields
      reset();
    } catch (error: any) {
      alert(`Server error: ${error.response.data.message}`);
      console.error(error.response.data.message);
    }
  };

  return (
    <>
      <form
        onSubmit={handleSubmit(HandleSubmitTask)}
        className="bg-[#D9D9D9] w-120 h-138 flex flex-col rounded-3xl border-solid border-2 border-black"
      >
        <p className="font-bold text-lg text-center mt-2">CREATE A NEW TASK</p>
        <div className="mx-6">
          {errors.TaskName ? (
            <label className="text-red-500 text-xs italic w-full ml-24">
              {errors.TaskName.message}
            </label>
          ) : (
            <div className="w-full mb-6" />
          )}

          <div className="flex gap-x-2">
            <p className="font-bold">Task Name: </p>
            <input
              {...register("TaskName")}
              type="text"
              placeholder="Enter the task's name"
              className={clsx(
                "bg-white flex-1 border-2 border-solid border-black mr-2 placeholder:text-gray-600",
                { "placeholder:text-red-500 border-red-500": errors.TaskName }
              )}
            />
          </div>

          {errors.TaskDeadline ? (
            <label className="text-red-500 text-xs italic w-full ml-24">
              {errors.TaskDeadline.message}
            </label>
          ) : (
            <div className="w-full mb-6" />
          )}
          <div className="flex gap-x-6 mb-1">
            <p className="text-left font-bold">Deadline: </p>
            <input
              {...register("TaskDeadline")}
              type="datetime-local"
              className={clsx(
                "bg-white border-2 border-solid border-black flex-1 mr-2",
                { "border-red-500": errors.TaskDeadline }
              )}
            />
          </div>
        </div>

        {errors.TaskDescription ? (
          <label className="text-red-500 text-xs italic w-full ml-8">
            {errors.TaskDescription.message}
          </label>
        ) : (
          <div className="w-full mb-4" />
        )}
        <textarea
          {...register("TaskDescription")}
          placeholder="Enter the task's description"
          className={clsx(
            "h-80 w-auto mx-8 mb-4 bg-white overflow-y-scroll resize-none placeholder:text-gray-600",
            { "placeholder:text-red-500": errors.TaskDescription }
          )}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-green-600 flex justify-center items-center py-2 px-4 gap-x-1 rounded-3xl hover:bg-green-800 hover:cursor-pointer disabled:bg-green-800 w-auto transition-colors duration-400 ease-in-out ml-auto mr-8"
        >
          <Upload color="white" />
          <p className="text-white font-bold">Submit</p>
        </button>
      </form>
    </>
  );
}
