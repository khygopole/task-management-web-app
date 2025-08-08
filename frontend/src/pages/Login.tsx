import { KeyRound, Mail } from "lucide-react";
import LaunchBackground from "../assets/launch_background.jpg";
import Logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { pageVariants } from "../utils/util";

export default function Login() {
  const navigateTo = useNavigate();

  const GoToSignup = () => {
    navigateTo("/signup");
    console.log("Go to Sign up");
  };

  const HandleLogin = () => {
    console.log("Verify account details if exists");
    navigateTo("/inprogress");
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

            <div className="flex flex-col gap-y-3 my-2 items-center w-full">
              <div className="p-2 border-solid border-black border-2 flex gap-x-2 w-1/2">
                <Mail />
                <input
                  type="email"
                  placeholder="Email address"
                  className="focus:outline-none w-full"
                />
              </div>

              <div className="p-2 border-solid border-black border-2 flex gap-x-2 w-1/2">
                <KeyRound />
                <input
                  type="password"
                  placeholder="Password"
                  className="focus:outline-none w-full"
                />
              </div>
              <button
                type="submit"
                onClick={() => HandleLogin()}
                className="bg-[#8D61C3] w-1/2 p-2 text-white font-bold hover:bg-[#705591] hover:cursor-pointer my-2 transition-colors duration-400 ease-in-out"
              >
                Login
              </button>
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
          </div>
        </motion.div>
      </main>
    </>
  );
}
