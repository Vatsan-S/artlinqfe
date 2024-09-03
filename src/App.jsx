import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../Pages/Login";
import Home from "../Pages/Home";
import Register from "../Pages/Register";
import Activation from "../Pages/Activation";
import ForgotPassword from "../Pages/ForgotPassword";
import ServicePage from "../Pages/ServicePage";
import PrivateRoute from "../Components/PrivateRoute";
import Chatpage from "../Pages/Chatpage";
import UserProfile from "../Pages/UserProfile";
import ArtistPage from "../Pages/ArtistPage";
import SeeallPage from "../Pages/SeeallPage";
import ManageBooking from "../Pages/ManageBooking";
import NotFound from "../Pages/NotFound";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} errorElement={<NotFound />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:randomString" element={<Activation />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/servicePage/:id" element={<ServicePage />} />
          <Route path="/artist/:id" element={<ArtistPage/>}/>
          <Route path="/serviceList/:type" element={<SeeallPage/>}/>
          
          <Route element={<PrivateRoute />}>
            <Route path="/chats" element={<Chatpage />} />
            <Route path="/chats/:userID" element={<Chatpage/>}/>
            <Route path="/userProfile" element={<UserProfile/>}/>
            <Route path="/manageBooking" element={<ManageBooking/>}/>
          </Route>
          <Route path='/404' element={<NotFound/>}/>
          <Route path='*' element={<Navigate to='/404'/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
