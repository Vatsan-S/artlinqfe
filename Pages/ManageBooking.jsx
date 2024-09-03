import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import AppointmentTable from "../Components/AppointmentTable";
import { Button, DatePicker, Input, TimePicker } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { IoClose } from "react-icons/io5";
import moment from "moment";
import { setUserInfo } from "../Redux/Slice/userSlice";
import Footer from "../Components/Footer";
import { SphereSpinner } from "react-spinners-kit";


const ManageBooking = () => {
  // --------------------------extract token---------------------------
  const token = localStorage.getItem("authToken");
  const decoded = jwtDecode(token);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.User);

  const [data, setData] = useState([]);
  const [appointmentID, setAppointmentID] = useState("");
  const [selectedDates, setSelectedDates] = useState([]);
  const [timeSlots, setTimeSlots] = useState([]);
  const [bookedDates, setBookedDates] = useState([]);
  const [timeSlotSuccess, setTimeSlotSuccess] = useState('')
  const [ errMsgTimeSlot, setErrmsgTimeSlot] = useState('')
  const [datesSuccess, setDatesSuccess] = useState('')
  const [errMSgDates, SetErrMsgDates] = useState('')
  const [forceRerender, setForceRerender] = useState(false)


  const [canceLoading, setCancelLoading] = useState(false)
  const [datesLoading, setDatesLoading] = useState(false)
  const [timeSlotLoading, setTimeSlotLoading] = useState(false)
  // ----------------------------fetch User----------------------------------
  const fetchUser = async () => {
    try {
      const result = await axios.post(
        "https://artlinq-be.onrender.com/api/user/fetchUser",
        { id: decoded.userID }
      );
      console.log(result);
      if (result.data.existingUser) {
        console.log("Working");
        setTimeSlots(result.data.existingUser.timeSlots);
        // dispatch(setUserInfo(result.data.data.existingUser))
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);
  //  -------------------------cancel booking------------------------------
  const handleCancelBooking = async () => {
    setCancelLoading(true)
    try {
      const result = await axios.post(
        "https://artlinq-be.onrender.com/api/appoinments/cancelAppointment",
        { appointmentID: appointmentID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setCancelLoading(false)
      console.log(result);
      setAppointmentID("");
      fetchAppoinments();
    } catch (error) {
      setCancelLoading(false)
      console.log(error);
    }
  };
  // ------------------------fetch All Appoinments----------------------
  useEffect(() => {
    fetchAppoinments();
  }, [token]);

  const fetchAppoinments = async () => {
    try {
      const result = await axios.post(
        "https://artlinq-be.onrender.com/api/appoinments/fetchAllAppoinments",
        { artistID: decoded.userID },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(flattenData(result.data.allAppoinment));
      setData(flattenData(result.data.allAppoinment));
      setBookedDates(
        result.data.allAppoinment.map((ele) => moment(ele.date.split("T")[0]))
      );
    } catch (error) {
      console.log(error);
    }
  };
  // ----------------------------------flattenData for table-------------------------------
  const flattenData = (data) => {
    console.log("data", data);
    const flatData = data.map((ele) => {
      console.log("Working");
      const flattend = {
        appointmentID: ele.appoinmentID,
        date: ele.date,
        customerName: ele.userID.userName,
        description: ele.description,
        id: ele._id,
        time: ele.time,
      };
      if (ele.userID.phone) {
        flattend["phone"] = ele.userID.phone;
      } else {
        flattend["phone"] = "N/A";
      }
      console.log("flattend", flattend);
      return flattend;
    });

    return flatData;
  };
  console.log("data", data);
  // --------------------------------------handle date change-------------------
  const handleDateChange = (date) => {
    console.log(date);
    setSelectedDates(date);
  };
  // -------------------------------------block dates-----------------------------------
  const handleBlockDates = () => {
    setDatesSuccess('')
    SetErrMsgDates('')
    setDatesLoading(true)
    console.log("Selected Dates:", selectedDates);
    //use for loop to create Appointment to fill the count of appointments the artist have in a day, with payload saying dates blocked in description
    // well use map
    timeSlots.map(async (ele) => {
      const payload = {
        userID: decoded.userID,
        artistID: decoded.userID,
        date: selectedDates.format("YYYY-MM-DD"),
        time: ele,
        description: "Date Blocked",
      };
      try {
        const result = await axios.post(
          "https://artlinq-be.onrender.com/api/appoinments/createAppoinment",
          payload,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setDatesLoading(false)
        setForceRerender(!forceRerender)
        setDatesSuccess("Dates Blocked")
        console.log(result);
        
      } catch (error) {
        setDatesLoading(false)
        console.log(error);
        SetErrMsgDates(error.response.data.message)
      }
    });
  };

  //   --------------------------handling timeslot change-----------------------------
  const handleTimeSlot = (time) => {
    if (time) {
      const timeString = time.format("HH:mm");
      setTimeSlots([...timeSlots, timeString]);
    }
  };

  // ---------------------------handling timeslot update to server--------------------------
  const handleTimeSlotsUpdate = async () => {
    setTimeSlotSuccess('')
    setErrmsgTimeSlot('')
    setTimeSlotLoading(true)
    try {
      const result = await axios.post(
        "https://artlinq-be.onrender.com/api/user/updateTimeslots",
        { userID: decoded.userID, timeSlots: timeSlots },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("result", result);
      setTimeSlotSuccess(result.data.message)
      setTimeSlotLoading(false)
      dispatch(setUserInfo(result.data.userInfo));
    } catch (error) {
      setTimeSlotLoading(false)
      setErrmsgTimeSlot(error.response.data.message)
      console.log(error);
    }
  };

  //   ----------------------remove from time Slots-----------------------------------
  const handleSlotRemove = (ele) => {
    setTimeSlots((prevSlots) => prevSlots.filter((item) => item !== ele));
  };

  // ------------------------disable dates while blocking-----------------------------
  const disabledDate = (current) => {
    const thisDay = bookedDates.filter(
      (ele) => ele.toDate().toISOString() == current.toDate().toISOString()
    );
    const timeSlotLength = userInfo.timeSlots.length;
    let block = false;
    if (thisDay.length >= timeSlotLength) {
      block = true;
    }
    return current && (current < moment().endOf("day") || block);
  };
  return (
    <div>
      <Navbar />
      <div className="container p-4">
        <h4>Manage Booking</h4>
        {/* ------------------appointments table---------------------- */}
        <div className="appointmentContainer w-100 overflow-scroll mb-5">
          <AppointmentTable data={data} />
        </div>
        {/* ----------------cancel booking------------------- */}
        <div className="cancelAppointment mb-5">
          <h5>Cancel Appointment</h5>
          <Input
            style={{
              maxWidth: 360,
            }}
            type="text"
            className="InputWidth"
            placeholder="Enter Appointment ID"
            value={appointmentID}
            onChange={(e) => setAppointmentID(e.target.value)}
          />
          {canceLoading===false?<Button type="primary" onClick={handleCancelBooking}>
            Cancel Booking
          </Button>:<Button type="primary" disabled={canceLoading}>
          <SphereSpinner size={15} color="#C2DEEB" loading={canceLoading} />Loading
          </Button>}
        </div>

        {/* -------------------block date--------------------- */}
        <div className="blockDates mb-5">
          <p className="successMsg">{datesSuccess}</p>
          <p className="errMsg">{errMSgDates}</p>
          <h5>Block Dates</h5>
          <DatePicker
            onChange={handleDateChange}
            disabledDate={disabledDate}
            format="YYYY-MM-DD"
            picker="date"
          />
          {datesLoading ===false?<Button onClick={handleBlockDates}>Block Dates</Button>:<Button type="primary" disabled={datesLoading}>
          <SphereSpinner size={15} color="#C2DEEB" loading={datesLoading} />Loading
          </Button>}
        </div>
        {/* ------------------------------time slot updates----------------------- */}
        <div className="updateTimeSlot">
          <h5>Update Time Slots</h5>
          <p className="successMsg">{timeSlotSuccess}</p>
          <p className="errMsg">{errMsgTimeSlot}</p>
          <TimePicker format="HH:mm" onChange={handleTimeSlot} />
          <div className="TimeSlotContainer col-12 col-md-3">
            {timeSlots.map((ele, index) => {
              return (
                <div
                  className="timeSlot"
                  key={index}
                  onClick={() => handleSlotRemove(ele)}
                >
                  <p>{ele}</p>
                  <p>
                    <IoClose />
                  </p>
                </div>
              );
            })}
          </div>
          {timeSlotLoading===false?<Button type="primary" onClick={handleTimeSlotsUpdate}>
            Update time Slot
          </Button>:<Button type="primary" disabled={timeSlotLoading}>
          <SphereSpinner size={15} color="#C2DEEB" loading={timeSlotLoading} />Loading
          </Button>}
        </div>
      </div>
      <Footer/>
    </div>
  );
};

export default ManageBooking;
