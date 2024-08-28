import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Navbar from "../Components/Navbar";
import { Button, Modal, DatePicker, TimePicker, message } from "antd";
import moment from "moment";
import axios from "axios";
import Calendar from 'react-calendar';

const ServicePage = () => {
  // ------------------------------states--------------------------------
  const serviceData = useSelector((state) => state.serviceData);
  const [previewImg, setPreviewImg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookedDates, setBookedDates] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  useEffect(() => {
    fetchBookedDates();
  }, []);

  const fetchBookedDates = async () => {
    try {
      const response = await axios.post(
        "https://artlinq-be.onrender.com/api/appointments/fetchAllAppointments",
        { artistID: serviceData.artistID._id }
      );
      setBookedDates(response.data.appointments.map(app => moment(app.date)).startOf('day'));
    } catch (error) {
      console.log(error);
    }
  };

  const handleBookAppointment = async () => {
    if (!selectedDate || !selectedTime) {
      return message.error("Please select a date and time");
    }
    try {
      const payload = {
        userID: "your_user_id", // replace with actual userID
        artistID: serviceData.artistID._id,
        date: selectedDate.format("YYYY-MM-DD"),
        time: selectedTime.format("h:mm A"),
        description: "Custom description here",
      };
      await axios.post(
        "https://artlinq-be.onrender.com/api/appointments/createAppointment",
        payload
      );
      message.success("Appointment booked successfully!");
      setIsModalOpen(false);
      fetchBookedDates(); // Refresh booked dates
    } catch (error) {
      console.log(error);
      message.error("Failed to book appointment");
    }
  };

  const disabledDate = (current) => {
    // Disable past dates and already booked dates
    return current && (current < moment().endOf('day') || bookedDates.some(date => date.isSame(current, 'day')));
  };

  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="mt-4 d-flex flex-column flex-md-row container-fluid">
          <div className="col-12 col-md-6 d-flex flex-column flex-md-row">
            <div className="imageCollection d-flex gap-2 flex-row flex-md-column col-12 col-md-2">
              
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
            <Calendar />
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              Book Appointment
            </Button>
          </div>
        </div>
      </div>

      <Modal
        title="Book Appointment"
        visible={isModalOpen}
        onOk={handleBookAppointment}
        onCancel={() => setIsModalOpen(false)}
      >
        <DatePicker
          disabledDate={disabledDate}
          onChange={setSelectedDate}
          style={{ width: '100%' }}
        />
        <TimePicker
          onChange={setSelectedTime}
          format="h:mm A"
          style={{ width: '100%', marginTop: 16 }}
        />
      </Modal>
    </div>
  );
};

export default ServicePage;
