import { CircleCheckBig, Clock, LogOut, SquarePlus } from "lucide-react";
import Logo from "../assets/Logo.png";
import { NavLink, useNavigate } from "react-router-dom";

export default function NavigationBar() {
  const navigateTo = useNavigate();

  const HandleLogout = () => {
    console.log("Logout successfully");
    // Insert Logout Operation here
    navigateTo("/login");
  };

  return (
    <nav className="bg-[#8D61C3] mx-2 mb-2 rounded-2xl">
      <div className="grid md:grid-cols-4 grid-cols-1">
        <div className="md:col-span-1 m-auto">
          <img
            src={Logo}
            alt="Logo"
            width={100}
            className="bg-white m-2 p-1 rounded-2xl "
          />
        </div>
        <div className="md:col-span-3">
          <ul className="flex md:justify-around items-center md:h-full md:my-0 md:flex-row flex-col gap-y-2 my-4">
            <li className="w-full md:w-auto">
              <NavLink
                to={"/inProgress"}
                className={({ isActive }) =>
                  `p-2 md:w-35 md:rounded-2xl hover:bg-[#FFEE04] flex justify-center gap-x-1 transition-colors duration-400 ease-in-out ${
                    isActive ? "bg-[#FFEE04]" : "bg-[#E29614]"
                  }`
                }
              >
                <Clock />
                <p>In Progress</p>
              </NavLink>
            </li>
            <li className="w-full md:w-auto">
              <NavLink
                to={"/finished"}
                className={({ isActive }) =>
                  `p-2 md:w-35 md:rounded-2xl hover:bg-[#FFEE04] flex justify-center gap-x-1 transition-colors duration-400 ease-in-out ${
                    isActive ? "bg-[#FFEE04]" : "bg-[#E29614]"
                  }`
                }
              >
                <CircleCheckBig />
                <p>Finished</p>
              </NavLink>
            </li>
            <li className="w-full md:w-auto">
              <NavLink
                to={"/newtask"}
                className={({ isActive }) =>
                  `p-2 md:w-35 md:rounded-2xl hover:bg-[#FFEE04] flex justify-center gap-x-1 transition-colors duration-400 ease-in-out ${
                    isActive ? "bg-[#FFEE04]" : "bg-[#E29614]"
                  }`
                }
              >
                <SquarePlus />
                <p>New Task</p>
              </NavLink>
            </li>
            <li className="w-full md:w-auto">
              <button
                onClick={HandleLogout}
                className="bg-[#E29614] p-2 md:w-35 md:rounded-2xl hover:bg-[#FFEE04] hover:cursor-pointer flex justify-center gap-x-1 w-full transition-colors duration-400 ease-in-out"
              >
                <LogOut />
                <p>Logout</p>
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
