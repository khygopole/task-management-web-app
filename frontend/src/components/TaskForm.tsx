import { Upload } from "lucide-react";

export default function TaskForm() {
  return (
    <>
      <div className="bg-[#D9D9D9] w-120 h-130 flex flex-col rounded-3xl border-solid border-2 border-black gap-y-2">
        <p className="font-bold text-lg text-center my-2">CREATE A NEW TASK</p>
        <div className="mx-6">
          <div className="flex gap-x-2 mb-2">
            <p className="font-bold">Task Name: </p>
            <input
              type="text"
              placeholder="Enter the task's name"
              className="bg-white flex-1 border-2 border-solid border-black"
            />
          </div>
          <div className="flex gap-x-6">
            <p className="text-left font-bold">Deadline: </p>
            <input
              type="datetime-local"
              className="bg-white border-2 border-solid border-black flex-1"
            />
          </div>
        </div>
        <textarea
          placeholder="Enter the task's description"
          className="h-80 w-auto mx-8 my-2 bg-white overflow-y-scroll resize-none"
        />
        <button className="bg-green-600 flex justify-center items-center py-2 px-4 gap-x-1 rounded-3xl hover:bg-green-800 hover:cursor-pointer w-auto transition-colors duration-400 ease-in-out ml-auto mr-8">
          <Upload color="white" />
          <p className="text-white font-bold">Submit</p>
        </button>
      </div>
    </>
  );
}
