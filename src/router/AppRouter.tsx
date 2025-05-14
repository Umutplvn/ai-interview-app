import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Header from "../components/Header";
import Home from "../pages/Home";
import Interview from "../pages/Interview";
import Login from "../pages/Login";
import Main from "../pages/Main";
import SignUp from "../pages/SignUp";
import PrivateRouter from "./PrivateRouter";

function App() {
  return (
    <Router>
    <Header/>
      <Routes>
      <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        <Route path="/register" element={<SignUp />} /> 
        <Route path="/main" element={<PrivateRouter />}>
        <Route index element={<Main />} /> 
        <Route path="interview" element={<Interview/>} /> 

        </Route>
      </Routes>
    </Router>
  );
}

export default App;