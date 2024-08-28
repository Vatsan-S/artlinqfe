import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import Register from "../Pages/Register";
import Activation from "../Pages/Activation";
import ForgotPassword from "../Pages/ForgotPassword";
import ServicePage from "../Pages/ServicePage";
import PrivateRoute from "../Components/PrivateRoute";
import Chatpage from "../Pages/Chatpage";
import AppointmentCalendar from "../Pages/AppointmentCalendar";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:randomString" element={<Activation />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/servicePage" element={<ServicePage />} />
          <Route element={<PrivateRoute />}>
            <Route path="/chats" element={<Chatpage />} />
            <Route path='/app' element={<AppointmentCalendar/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
