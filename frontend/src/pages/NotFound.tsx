import { useEffect } from "react";
import Logo from "../assets/Logo.png";
import { useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigateTo = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => {
      // After 3 seconds, redirect user to root path
      navigateTo("/");
    }, 3000);

    // Clean the timeout function
    return () => {
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
      <img src={Logo} width={300} />

      <h1 className="text-8xl sm:text-9xl font-extrabold text-[#705591] tracking-wider mb-4">
        404
      </h1>
      <p className="text-xl sm:text-2xl font-semibold text-gray-600 mb-6 max-w-md">
        The page you're looking for doesn't exist.
      </p>
      <p className="text-xl sm:text-2xl font-semibold text-gray-600 mb-6 max-w-md">
        Redirecting you...
      </p>
      <div
        className="
            inline-block h-30 w-30 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]
          "
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
    </div>
  );
}
