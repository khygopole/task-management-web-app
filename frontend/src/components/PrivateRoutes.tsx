// Prevents from Unauthorized Access in some pages when not authenticated

import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function PrivateRoutes({
  children,
}: {
  children: React.ReactNode;
}): React.ReactNode | null {
  const navigateTo = useNavigate();

  useEffect(() => {
    // Retrieve token from cookies
    const token = Cookies.get("token");

    // Navigate to Login Page if there is no token in cookies
    if (!token) {
      navigateTo("/NotFound");
    }
  }, [navigateTo]);

  const token = Cookies.get("token");
  // If there is no token, return null. Return the children page if there is
  return token ? children : null;
}
