import { Mail, KeyRound, User } from "lucide-react";
import LaunchBackground from "../assets/launch_background.jpg";
import Logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { pageVariants } from "../utils/util";
import { motion } from "framer-motion";
import { ZSignupSchema, type TSignupSchema } from "../utils/types";
import clsx from "clsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import Cookies from "js-cookie";
import axios from "axios";

export default function Signup() {
  // Navigation
  const navigateTo = useNavigate();

  // Set Schema for Signup Values using useForm and Zod
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    reset,
  } = useForm<TSignupSchema>({
    resolver: zodResolver(ZSignupSchema),
  });

  // Change Title Page then Verify token
  useEffect(() => {
    document.title = "Sign Up | Task Management System";

    // Verify if token is in cookies - navigate to inprogress if there is
    const token = Cookies.get("token");
    if (token) {
      navigateTo("/inprogress");
    }
  }, []);

  const HandleCreateAccount = async (data: TSignupSchema) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/users/signup",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      if (response.data.Status === "Success") {
        // Reset
        reset();
        alert("Account creation successful");
        // Navigate to Login Page After Account Creation
        navigateTo("/login");
      }
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        // Get Status and Error Response
        const status: number = error.response.status;
        const serverErrorMessage: string = error.response.data.error;
        // Set errors from server to client
        if (status === 409) {
          setError("email", { type: "server", message: serverErrorMessage });
        } else {
          setError("root", {
            type: "server",
            message: "Unexpected error occurred",
          });
        }
      }
    }
  };

  const GoToLogin = () => {
    navigateTo("/login");
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
          {/* Form */}
          <div className="flex flex-col items-center gap-y-3 m-7">
            <img src={Logo} alt="Logo" width={310} />
            <p className="text-3xl ">Sign Up</p>

            <form
              onSubmit={handleSubmit(HandleCreateAccount)}
              className="w-full"
            >
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

                {errors.username ? (
                  <label className="w-1/2 text-red-500 text-xs  italic">
                    {errors.username.message}
                  </label>
                ) : (
                  <div className="w-full m-2" />
                )}
                <div className="p-2 border-solid border-black border-2 flex gap-x-2 w-1/2">
                  <User />
                  <input
                    {...register("username")}
                    type="text"
                    placeholder="Username"
                    className={clsx(
                      "focus:outline-none w-full placeholder:text-black",
                      { "placeholder:text-red-500": errors.username }
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
                <div className="p-2 border-solid border-black border-2 flex gap-x-2 w-1/2">
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

                {errors.confirmPassword ? (
                  <label className="w-1/2 text-red-500 text-xs  italic">
                    {errors.confirmPassword.message}
                  </label>
                ) : (
                  <div className="w-full m-2" />
                )}
                <div className="p-2 border-solid border-black border-2 flex gap-x-2 w-1/2 mb-2">
                  <KeyRound />
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    placeholder="Confirm Password"
                    className={clsx(
                      "focus:outline-none w-full placeholder:text-black",
                      { "placeholder:text-red-500": errors.confirmPassword }
                    )}
                  />
                </div>
                <button
                  disabled={isSubmitting}
                  type="submit"
                  className="bg-[#8D61C3] w-1/2 p-2 text-white font-bold hover:bg-[#705591] disabled:bg-[#705591] hover:cursor-pointer my-2 transition-colors duration-400 ease-in-out"
                >
                  Create Account
                </button>
              </div>
            </form>
            <div className="flex flex-col w-full items-center">
              <p>Already have an account?</p>
              <button
                type="submit"
                onClick={GoToLogin}
                className="bg-[#8D61C3] w-auto px-8 py-2 text-white font-bold hover:bg-[#705591] hover:cursor-pointer my-2 transition-colors duration-400 ease-in-out"
              >
                Login
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    </>
  );
}
