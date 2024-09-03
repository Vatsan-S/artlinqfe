import React from "react";
import Navbar from "../Components/Navbar";
import Footer from "../Components/Footer";

const NotFound = () => {
  console.log("Not found");
  return (
    <div>
      
      <Navbar />
      <img
        src="https://img.freepik.com/free-vector/404-error-with-tired-person-concept-illustration_114360-7889.jpg?t=st=1725342251~exp=1725345851~hmac=759713d41f8e557e00927235d68088a89c732b38daf1a7de2defc46964e4dfc5&w=740"
        alt=""
      />
      <Footer />
    </div>
  );
};

export default NotFound;
