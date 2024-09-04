import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { UploadOutlined } from "@ant-design/icons";
import { SphereSpinner } from "react-spinners-kit";
import {
  Button,
  Modal,
  DatePicker,
  TimePicker,
  message,
  Select,
  Form,
  Upload,
  Input,
  Radio,
} from "antd";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import moment from "moment";
import { Link, useNavigate, useParams } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import Footer from "../Components/Footer";

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
};

const ServicePage = () => {
  // ------------------------------states--------------------------------
  const [form] = Form.useForm();
  const { id } = useParams();
  const navigate = useNavigate();

  const [previewImg, setPreviewImg] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState("");
  const [bookedDates, setBookedDates] = useState([]);
  const [serviceData, setServiceData] = useState({});
  const [loading, setLoading] = useState(false);
  const [timeslotDisable, setTimeslotDisable] = useState(true);
  const [optionList, setOptionList] = useState([]);
  const [description, setDescription] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [isEditServiceOpen, setIsEditServiceOpen] = useState(false);
  const [editLoading, setEditLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // ----------------------------edit service States------------------
  const [img1, setImg1] = useState("");
  const [img2, setImg2] = useState("");
  const [img3, setImg3] = useState("");
  const [img4, setImg4] = useState("");
  const [title, setTitle] = useState(serviceData.title);
  const [serviceDescription, setServiceDescription] = useState(
    serviceData.description
  );
  const [category, setcategory] = useState(serviceData.category);

  // ----------------------------extract data--------------------------
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await axios.post(
        "https://artlinq-be.onrender.com/api/service/getService",
        { id: id }
      );
      // console.log("result", result.data.serviceData.artistID.timeSlots);
      if (result.data.serviceData) {
        setServiceData(result.data.serviceData);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  // -------------------------extract token-------------------------------

  const token = localStorage.getItem("authToken");

  let decoded;
  let myService;
  if (token && serviceData.artistID) {
    decoded = jwtDecode(token);
    if (decoded.userID === serviceData.artistID._id) {
      myService = true;
    } else {
      myService = false;
    }
  }

  // ---------------------------------image seperation------------------------------
  const totalImages = Object.entries(serviceData)
    .filter(([key, value]) => key.startsWith("image"))
    .map(([key, value]) => value);
  // console.log(totalImages);

  // -----------------------------fetch Booked Dates--------------------------------------

  const fetchBookedDates = async () => {
    const payload = {
      artistID: serviceData.artistID._id,
    };
    try {
      const result = await axios.post(
        "https://artlinq-be.onrender.com/api/appoinments/fetchAllAppoinments",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookedDates(
        result.data.allAppoinment.map((ele) => moment(ele.date.split("T")[0]))
      );

      console.log("working");
    } catch (error) {
      console.log(error);
    }
  };
  // -------------------------------handle modal open and close, book appointment-------------------------------
  const handleFinish = (values) => {
    handleBookAppointment(values);
    form.resetFields();
    setTimeslotDisable(true);
  };
  const handleBookAppointment = async () => {
    if (!selectedDate) {
      return message.error("Please select a date and time");
    }
    try {
      const payload = {
        userID: decoded.userID,
        artistID: serviceData.artistID._id,
        date: selectedDate.format("YYYY-MM-DD"),
        time: selectedTime,
        description: description,
      };
      console.log("Pay", payload);
      const result = await axios.post(
        "https://artlinq-be.onrender.com/api/appoinments/createAppoinment",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(result);
      setIsModalOpen(false);
      fetchBookedDates();
    } catch (error) {
      console.log(error);
      message.error("Failed to book appointment");
    }
  };

  // ---------------------------------handle disabled dates-------------------------------
  const disabledDate = (current) => {
    // console.log("b",current.$d)
    // console.log('c',bookedDates[0]._d)
    const thisDay = bookedDates.filter(
      (ele) => ele.toDate().toISOString() == current.toDate().toISOString()
    );
    // console.log(thisDay.length)
    const timeSlotLength = serviceData.artistID.timeSlots.length;
    //  console.log(timeSlotLength)
    let block = false;
    if (thisDay.length >= timeSlotLength) {
      block = true;
    }
    return current && (current < moment().endOf("day") || block);
  };
  // -----------------------------handle Chat click-----------------------------
  const handleChat = async () => {
    try {
      navigate(`/chats/${serviceData.artistID._id}`);
    } catch (error) {
      console.log(error);
    }
  };
  // -------------------------------handle date selection------------------------------------
  const handleDateSelection = async (date) => {
    setSelectedDate(date);
    console.log("date", date);
    try {
      const result = await axios.post(
        "https://artlinq-be.onrender.com/api/appoinments/fetchTimeSlots",
        { date: date.format("YYYY-MM-DD"), userID: serviceData.artistID._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("r", result.data.timeSlots);
      setOptionList(result.data.timeSlots);
      setTimeslotDisable(false);
    } catch (error) {
      console.log(error);
    }
  };

  // -----------------------------------upload function----------------------------------
  const uploadFiles = async (file) => {
    try {
      const payload = new FormData();
      payload.append("file", file.originFileObj);
      payload.append("upload_preset", "images_preset");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/ddycjnke1/image/upload",
        payload
      );
      console.log(response);
      const { secure_url } = response.data;

      return secure_url;
    } catch (error) {
      console.log(error.response.data);
    }
  };

  // ------------------------------------------handle edit service-------------------
  const handleSubmit = async (value) => {
    setEditLoading(true);
    let image1;
    console.log("image1",img2);
    if (img1) {
      image1 = await uploadFiles(img1);
    }

    let image2;
    if (img2) {
      image2 = await uploadFiles(img2);
    }
    let image3;
    if (img3) {
      image3 = await uploadFiles(img3);
    }
    let image4;
    if (img4) {
      image4 = await uploadFiles(img4);
    }

    const payload = {
      serviceID: serviceData._id,
      category: category,
      description: serviceDescription,
      title: title,
    };
    
    if (image1) payload["image1"] = image1;
    if (image2) payload["image2"] = image2;
    if (image3) payload["image3"] = image3;
    if (image4) payload["image4"] = image4;
    console.log(payload);
    try {
      const result = await axios.post(
        "https://artlinq-be.onrender.com/api/service/editService",
        payload,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setEditLoading(false);
      setIsEditServiceOpen(false);
      location.reload()
    } catch (error) {
      setEditLoading(false);
      console.log(error);
    }
  };

  // ------------------------------------delete service------------------------------------
  const deleteService = async () => {
    setDeleteLoading(true);
    try {
      const result = await axios.post(
        "https://artlinq-be.onrender.com/api/service/deleteService",
        { serviceID: serviceData._id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setDeleteLoading(false);
      // console.log(result)
    } catch (error) {
      setDeleteLoading(false);
      console.log(error);
    }
  };
  // ========================================================================jsx===================================================
  return (
    <div>
      <Navbar />
      {Object.keys(serviceData).length > 0 ? (
        <>
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
                {token ? (
                  myService === true ? (
                    <div className="editActions">
                      <Link to="/manageBooking">
                        <Button>Manage Booking</Button>
                      </Link>
                      <Button onClick={() => setIsEditServiceOpen(true)}>
                        Edit Service
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Button
                        type="primary"
                        onClick={() => {
                          setIsModalOpen(true);
                          fetchBookedDates();
                        }}
                      >
                        Book Appointment
                      </Button>{" "}
                      <Button onClick={handleChat}>Chat</Button>
                    </>
                  )
                ) : (
                  <Link to="/login">
                    <Button>Login to Book Appointment</Button>
                  </Link>
                )}
              </div>
              <Modal
                title="Book Appointment"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={[
                  <Button
                    key="cancel"
                    onClick={() => {
                      setIsModalOpen(false);
                      form.resetFields();
                      setTimeslotDisable(true);
                    }}
                  >
                    Cancel
                  </Button>,
                  <Button
                    key="submit"
                    type="primary"
                    form="appointmentForm"
                    htmlType="submit"
                  >
                    Book Appointment
                  </Button>,
                ]}
              >
                <Form
                  form={form}
                  id="appointmentForm"
                  onFinish={handleFinish}
                  layout="vertical"
                >
                  <Form.Item
                    name="date"
                    label="Pick Your Date"
                    rules={[
                      { required: true, message: "Please select a date!" },
                    ]}
                  >
                    <DatePicker
                      disabledDate={disabledDate}
                      onChange={handleDateSelection}
                      style={{ width: "100%" }}
                    />
                  </Form.Item>

                  <Form.Item
                    name="timeSlot"
                    label="Pick Your Time Slot"
                    rules={[
                      {
                        required: true,
                        message: "Please select a time slot!",
                      },
                    ]}
                  >
                    {timeslotDisable ? (
                      <p>Select a Date to choose Time Slots</p>
                    ) : (
                      <Select
                        placeholder="Select Timings"
                        onChange={(e) => setSelectedTime(e)}
                        disabled={timeslotDisable}
                      >
                        {optionList.map((ele, index) => (
                          <Option key={index} value={ele}>
                            {ele}
                          </Option>
                        ))}
                      </Select>
                    )}
                  </Form.Item>

                  <Form.Item name="notes" label="Any Notes">
                    <TextArea
                      rows={2}
                      placeholder="Optional Description"
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Form.Item>
                </Form>
              </Modal>
              {/* -------------------------------edit modal starts here------------------------------ */}
              <Modal
                title="Edit Service"
                open={isEditServiceOpen}
                onCancel={() => setIsEditModalIsOpen(false)}
                footer={[
                  <>
                    {loading === false ? (
                      <>
                        {editLoading === false ? (
                          <Button
                            type="primary"
                            htmlType="submit"
                            form="EditService"
                            className="c_registerButton"
                          >
                            Edit Service
                          </Button>
                        ) : (
                          <Button type="primary" disabled={editLoading}>
                            <SphereSpinner
                              size={15}
                              color="#C2DEEB"
                              loading={editLoading}
                            />
                            Loading
                          </Button>
                        )}
                        <Button
                          key="cancel"
                          onClick={() => {
                            setIsEditServiceOpen(false);
                            form.resetFields();
                          }}
                        >
                          Cancel
                        </Button>
                        {deleteLoading === false ? (
                          <Button
                            key="Deletee"
                            style={{ color: "red" }}
                            onClick={() => {
                              setIsEditServiceOpen(false);
                              form.resetFields();
                              deleteService();
                              navigate("/");
                            }}
                          >
                            Delete
                          </Button>
                        ) : (
                          <Button type="primary" disabled={editLoading}>
                            <SphereSpinner
                              size={15}
                              color="#C2DEEB"
                              loading={editLoading}
                            />
                            Loading
                          </Button>
                        )}
                      </>
                    ) : (
                      <>
                        <Button
                          type="primary"
                          htmlType="submit"
                          disabled={loading}
                        >
                          <SphereSpinner
                            size={15}
                            color="#C2DEEB"
                            loading={loading}
                          />
                          Loading
                        </Button>
                      </>
                    )}
                  </>,
                ]}
              >
                <div className="modal-body">
                  <Form
                    {...formItemLayout}
                    form={form}
                    name="EditService"
                    onFinish={handleSubmit}
                    style={{
                      maxWidth: 600,
                    }}
                    scrollToFirstError
                  >
                    <p>Only upload image if you want to replace older ones</p>
                    <Form.Item
                      name="image1"
                      label="image1"
                      valuePropName="fileList"
                      getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                          return e;
                        }
                        return e && e.fileList;
                      }}
                    >
                      <Upload
                        name="image1"
                        listType="picture"
                        maxCount={1}
                        onChange={(e) => setImg1(e.file)}
                      >
                        <Button icon={<UploadOutlined />}>
                          Click to Upload
                        </Button>
                      </Upload>
                    </Form.Item>
                    <Form.Item
                      name="image2"
                      label="image2"
                      valuePropName="fileList"
                      getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                          return e;
                        }
                        return e && e.fileList;
                      }}
                    >
                      <Upload name="image2" listType="picture" maxCount={1} onChange={(e) => setImg2(e.file)}>
                        <Button icon={<UploadOutlined />}>
                          Click to Upload
                        </Button>
                      </Upload>
                    </Form.Item>
                    <Form.Item
                      name="image3"
                      label="image3"
                      valuePropName="fileList"
                      getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                          return e;
                        }
                        return e && e.fileList;
                      }}
                    >
                      <Upload name="image3" listType="picture" maxCount={1} onChange={(e) => setImg3(e.file)}>
                        <Button icon={<UploadOutlined />}>
                          Click to Upload
                        </Button>
                      </Upload>
                    </Form.Item>
                    <Form.Item
                      name="image4"
                      label="image4"
                      valuePropName="fileList"
                      getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                          return e;
                        }
                        return e && e.fileList;
                      }}
                    >
                      <Upload name="image4" listType="picture" maxCount={1} onChange={(e) => setImg4(e.file)}>
                        <Button icon={<UploadOutlined />}>
                          Click to Upload
                        </Button>
                      </Upload>
                    </Form.Item>

                    <Form.Item name="title" label="Service Title">
                      <Input
                        defaultValue={serviceData.title}
                        onChange={(e) => setTitle(e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item
                      name="description"
                      label="Description"
                      hasFeedback
                    >
                      <TextArea
                        defaultValue={serviceData.description}
                        onChange={(e) => setServiceDescription(e.target.value)}
                      />
                    </Form.Item>

                    <Form.Item
                      name="category"
                      label="Service Category"
                      className="custom-select-dropdown"
                    >
                      <Radio.Group
                        className="c_radiogroup"
                        defaultValue={serviceData.category}
                      >
                        <Radio
                          value="Visual"
                          onChange={(e) => setcategory(e.target.value)}
                        >
                          Visual
                        </Radio>
                        <Radio
                          value="Performing"
                          onChange={(e) => setcategory(e.target.value)}
                        >
                          Performing
                        </Radio>
                        <Radio
                          value="Literary"
                          onChange={(e) => setcategory(e.target.value)}
                        >
                          Literary
                        </Radio>
                        <Radio
                          value="Film and Media"
                          onChange={(e) => setcategory(e.target.value)}
                        >
                          Film and Media
                        </Radio>
                        <Radio
                          value="Design"
                          onChange={(e) => setcategory(e.target.value)}
                        >
                          Design
                        </Radio>
                        <Radio
                          value="Conceptual"
                          onChange={(e) => setcategory(e.target.value)}
                        >
                          Conceptual
                        </Radio>
                        <Radio
                          value="Craft"
                          onChange={(e) => setcategory(e.target.value)}
                        >
                          Craft
                        </Radio>
                      </Radio.Group>
                    </Form.Item>

                    <p className="errMsg">{errMsg}</p>
                    <p className="successMsg">{successMsg}</p>
                  </Form>
                </div>
              </Modal>
            </div>
          </div>
        </>
      ) : (
        <>Loading</>
      )}
      <Footer />
    </div>
  );
};

export default ServicePage;
