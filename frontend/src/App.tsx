import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { Routes, Route, useLocation } from "react-router-dom";
import InProgress from "./pages/InProgress";
import Finished from "./pages/Finished";
import ViewTask from "./pages/ViewTask";
import NewTask from "./pages/NewTask";
import { AnimatePresence } from "framer-motion";

function App() {
  const location = useLocation();
  return (
    <>
      {/* <Login /> */}
      {/* <Signup /> */}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/inprogress" element={<InProgress />} />
          <Route path="/finished" element={<Finished />} />
          <Route path="/newtask" element={<NewTask />} />
          <Route path="/view/:taskName" element={<ViewTask />} />
        </Routes>
      </AnimatePresence>
    </>
  );
}

export default App;
