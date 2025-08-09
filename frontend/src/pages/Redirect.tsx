import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
// Root page to direct user to login route when they access the root route

export default function RootRoute() {
  const navigate = useNavigate();

  useEffect(() => {
    // Get token from cookies
    const token = Cookies.get("token");

    // Navigate to Login Page if no token - InProgress Page if there is
    if (token) {
      navigate("/inprogress");
    } else {
      navigate("/login");
    }
  }, [navigate]);

  return <></>;
}
