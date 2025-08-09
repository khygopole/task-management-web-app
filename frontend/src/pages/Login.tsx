import { KeyRound, Mail } from "lucide-react";
import LaunchBackground from "../assets/launch_background.jpg";
import Logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { pageVariants } from "../utils/util";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ZLoginSchema } from "../utils/types";
import type { TLoginSchema } from "../utils/types";
import clsx from "clsx";
import Cookies from "js-cookie";
import axios from "axios";

export default function Login() {
  // Navigation
  const navigateTo = useNavigate();

  // Set Schema for Login Values using useForm and Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<TLoginSchema>({
    resolver: zodResolver(ZLoginSchema),
  });

  // Change Title Page and Verify Token
  useEffect(() => {
    document.title = "Login | Task Management System";

    // Retrieve token from cookies
    const token = Cookies.get("token");
    // Go to /inprogress route if there is token
    if (token) {
      navigateTo("/inprogress");
    }
  }, []);

  // Set Axios Credentials
  axios.defaults.withCredentials = true;

  const HandleLogin = async (data: TLoginSchema) => {
    try {
      const response = await axios.post("/users/login", data, {
        headers: { "Content-Type": "application/json" },
      });

      // Initializes Server Response Errors in the Client
      if (response.data.Status === "Success") {
        // Reset values
        reset();

        // Successful Login so Navigate to inprogress route
        navigateTo("/inprogress");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        // Get Status and Error Response
        const status: number = error.response.status;
        const serverErrorMessage: string = error.response.data.error;

        // Set any of the errors
        if (status === 404) {
          setError("email", { type: "server", message: serverErrorMessage });
        } else if (status === 401) {
          setError("password", { type: "server", message: serverErrorMessage });
        } else {
          console.error("Unexpected error");
        }
      }
    }
  };

  const GoToSignup = () => {
    navigateTo("/signup");
  };

  return (
    <>
      {/* Main Body */}
      <main className="grid grid-cols-1 md:grid-cols-2 h-screen">
        {/* Background Left */}
        <div
          //   className="hidden md:block bg-cover bg-center bg-no-repeat"
          className="bg-cover bg-center bg-no-repeat transition-all duration-300 ease-in-out 
                   opacity-0 max-h-0 overflow-hidden 
                   md:opacity-100 md:max-h-screen"
          style={{ backgroundImage: `url(${LaunchBackground})` }}
        />

        {/* Form */}
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
          <div className="flex flex-col items-center gap-y-3 m-7">
            <img src={Logo} alt="Logo" width={310} />
            <p className="text-3xl ">Login</p>

            <form onSubmit={handleSubmit(HandleLogin)} className="w-full">
              <div className="flex flex-col my-2 items-center w-full">
                {errors.email ? (
                  <label className="w-1/2 text-red-500 text-xs  italic">
                    {errors.email.message}
                  </label>
                ) : (
                  <div className="w-full m-2" />
                )}
                <div className="p-2 border-solid border-black border-2 flex gap-x-2 w-1/2">
                  <Mail />
                  <input
                    {...register("email")}
                    type="email"
                    placeholder="Email address"
                    className={clsx(
                      "focus:outline-none w-full placeholder:text-black",
                      { "placeholder:text-red-500": errors.email }
                    )}
                  />
                </div>

                {errors.password ? (
                  <label className="w-1/2 text-red-500 text-xs  italic">
                    {errors.password.message}
                  </label>
                ) : (
                  <div className="w-full m-2" />
                )}
                <div className="p-2 border-solid border-black border-2 flex gap-x-2 w-1/2 mb-2">
                  <KeyRound />
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="Password"
                    className={clsx(
                      "focus:outline-none w-full placeholder:text-black",
                      { "placeholder:text-red-500": errors.password }
                    )}
                  />
                </div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="bg-[#8D61C3] w-1/2 p-2 text-white font-bold hover:bg-[#705591] disabled:bg-[#705591] hover:cursor-pointer my-2 transition-colors duration-400 ease-in-out"
                >
                  Login
                </button>
              </div>
            </form>
            <div className="flex flex-col w-full items-center">
              <p>No account?</p>
              <button
                type="submit"
                onClick={GoToSignup}
                className="bg-[#8D61C3] w-auto px-8 py-2 text-white font-bold hover:bg-[#705591] hover:cursor-pointer my-2 transition-colors duration-400 ease-in-out"
              >
                Signup
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
