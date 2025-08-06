// import Login from "./pages/Login";
// import Signup from "./pages/Signup";
import { Routes, Route } from "react-router-dom";
import InProgress from "./pages/InProgress";

function App() {
  return (
    <>
      {/* <Login /> */}
      {/* <Signup /> */}
      <Routes>
        <Route path="/" element={<InProgress />} />
      </Routes>
    </>
  );
}

export default App;
