import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Routes, Route, useLocation } from "react-router-dom";
import InProgress from "./pages/InProgress";
import Finished from "./pages/Finished";
import ViewTask from "./pages/ViewTask";
import NewTask from "./pages/NewTask";
import { AnimatePresence } from "framer-motion";
import RootRoute from "./pages/Redirect";
import NotFound from "./pages/NotFound";
import PrivateRoutes from "./components/PrivateRoutes";

function App() {
  const location = useLocation();

  return (
    <>
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<RootRoute />} />
          <Route path="*" element={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/inprogress"
            element={
              <PrivateRoutes>
                <InProgress />
              </PrivateRoutes>
            }
          />
          <Route
            path="/finished"
            element={
              <PrivateRoutes>
                <Finished />
              </PrivateRoutes>
            }
          />
          <Route
            path="/newtask"
            element={
              <PrivateRoutes>
                <NewTask />
              </PrivateRoutes>
            }
          />
          <Route
            path="/view/:taskName"
            element={
              <PrivateRoutes>
                <ViewTask />
              </PrivateRoutes>
            }
          />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
