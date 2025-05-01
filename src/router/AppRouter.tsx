import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import PrivateRouter from "./PrivateRouter";

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} /> 
        <Route path="stock" element={<PrivateRouter />}>

        </Route>
      </Routes>
    </Router>
  );
}

export default App;