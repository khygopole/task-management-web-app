import Logo from "../assets/Logo.png";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 sm:p-6 text-center">
      <img src={Logo} width={300} />

      <h1 className="text-8xl sm:text-9xl font-extrabold text-[#705591] tracking-wider mb-4">
        404
      </h1>
      <p className="text-xl sm:text-2xl font-semibold text-gray-600 mb-6 max-w-md">
        The page you're looking for doesn't exist.
      </p>
    </div>
  );
}
