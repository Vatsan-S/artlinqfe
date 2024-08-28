import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import { Button, Modal, DatePicker, TimePicker, message } from "antd";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import moment from "moment";


const ServicePage = () => {
  // ------------------------------states--------------------------------
  const serviceData = useSelector((state) => state.serviceData);
  const [previewImg, setPreviewImg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedDates, setBookedDates] = useState([]);

  // -------------------------extract token-------------------------------

  const token = localStorage.getItem("authToken");
  const decoded = jwtDecode(token);
  // ---------------------------------image seperation------------------------------
  const totalImages = Object.entries(serviceData)
    .filter(([key, value]) => key.startsWith("image"))
    .map(([key, value]) => value);
  // console.log(totalImages);

// -----------------------------fetch Booked Dates--------------------------------------
useEffect(()=>{
  fetchBookedDates()
},[])

const fetchBookedDates = async()=>{
  const payload ={
    artistID: serviceData.artistID._id
  }
    try {
      const result = await axios.post('https://artlinq-be.onrender.com/api/appoinments/fetchAllAppoinments',payload, {
        headers:{
          "Authorization": `Bearer ${token}`
        }
      })
      // console.log(result.data)
      // result.data.allAppoinment.map((ele)=>console.log(ele.date.split('T')[0]))
      setBookedDates(result.data.allAppoinment.map((ele)=>moment(ele.date.split('T')[0])))
    } catch (error) {
      console.log(error)
    }
}
  // -------------------------------handle modal open and close-------------------------------
  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      return message.error("Please select a date and time");
    }
    try {
      const payload = {
        userID: decoded.userID,
        artistID: serviceData.artistID._id,
        date: selectedDate.format("YYYY-MM-DD"),
        time: selectedTime.format("h:mm A"),
        description: "Custom description here",
      };
      console.log("Payload", payload)
      const result = await axios.post(
        "https://artlinq-be.onrender.com/api/appoinments/createAppoinment",
        payload,{
          headers:{
            "Authorization":`Bearer ${token}`
          }
        }
      );
      console.log(result)
      setIsModalOpen(false);
      fetchBookedDates(); 
    } catch (error) {
      console.log(error);
      message.error("Failed to book appointment");
    }
  };

  // ---------------------------------handle disabled dates-------------------------------
  const disabledDate = (current)=>{
    // console.log(current.$d)
    // console.log(bookedDates[0]._d)
    // console.log("a",bookedDates.some(date => date.isSame(current.$d, 'day')))
    return current && (current < moment().endOf('day') || bookedDates.some(date => date.isSame(current.$d, 'day')));
  }
  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="mt-4 d-flex flex-column flex-md-row container-fluid">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row">
            <div className="imageCollection d-flex gap-2 flex-row flex-md-column col-12 col-md-2">
              {totalImages.map((ele, index) => {
                return (
                  <div
                    key={index}
                    className="shortImages"
                    onClick={() => setPreviewImg(ele)}
                  >
                    <img src={ele} alt="" />
                  </div>
                );
              })}
            </div>
            <div className="imagePreview col-12 col-md-10">
              <img
                src={previewImg === "" ? serviceData.image1 : previewImg}
                className="previewImg"
                alt=""
              />
            </div>
          </div>
          <div className="col-12 col-md-6">
            <p>Category: {serviceData.category}</p>
            <h1>{serviceData.title}</h1>
            <p> {serviceData.artistID.userName}</p>
            <p>{serviceData.description}</p>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              Book Appointment
            </Button>
          </div>
        </div>
      </div>
      <Modal
        title="Book Appointment"
        open={isModalOpen}
        onOk={handleBookAppointment}
        onCancel={() => setIsModalOpen(false)}
      >
        <DatePicker
          disabledDate={disabledDate}
          onChange={setSelectedDate}
          style={{ width: '100%' }}
        />
        
      </Modal>
    </div>
  );
};

export default ServicePage;
