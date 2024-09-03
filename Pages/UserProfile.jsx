import React, { useState } from "react";
import Navbar from "../Components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { MdEdit } from "react-icons/md";
import { Button, Card, Form, Modal, Input, Select } from "antd";
import { Link, useNavigate } from "react-router-dom";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { setUserInfo } from "../Redux/Slice/userSlice";
import Footer from "../Components/Footer";
const { Meta } = Card;
const { Option } = Select;

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

const UserProfile = () => {
  const [form] = Form.useForm();
  const { userInfo } = useSelector((state) => state.User);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  // ------------------------------------extract token-------------------------
  const token = localStorage.getItem("authToken");

  // ---------------------------------edit user states-----------------------
  const [email, setEmail] = useState(userInfo.email);
  const [userName, setUserName] = useState(userInfo.userName);
  const [bio, setBio] = useState(userInfo.bio);
  const [phoneNumber, setPhoneNumber] = useState(userInfo.phone);
  const [gender, setGender] = useState(userInfo.gender);
  console.log(userInfo);

  // -------------------------------handle edit-------------------------------
  const handleFinish = async () => {
    try {
      const payload = {
        userName: userName,
        email: email,
        phone: phoneNumber,
        gender: gender,
        userID: userInfo._id,
        bio: bio,
      };
      console.log(payload);
      const result = await axios.post(
        "https://artlinq-be.onrender.com/api/user/editUser",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(result);
      dispatch(setUserInfo(result.data.userInfo));
      setIsModalOpen(false);
    } catch (error) {
      console.log(error);
    }
  };
  //   -----------------------------handle Card Click--------------------------
  const handleClick = async (id) => {
    navigate(`/servicePage/${id}`);
  };
  return (
    <div>
      <Navbar />
      <div className="container">
        <div className="topProfile d-flex gap-4">
          <div className="profilePicture d-flex justify-content-center align-items-center">
            {userInfo.userName.slice(0, 1).toUpperCase()}
          </div>
          <div className="profileTopContent">
            <h3 className="userName">
              {userInfo.userName.slice(0, 1).toUpperCase()}
              {userInfo.userName
                .slice(1, userInfo.userName.length)
                .toLowerCase()}
            </h3>
            <p className="bio">
              {userInfo.bio ? userInfo.bio : "Write a brief about yourself"}
            </p>
            <button
              className="edit btn btn-light d-flex align-items-center"
              onClick={() => setIsModalOpen(true)}
            >
              <MdEdit />
            </button>
          </div>
        </div>
        <div className="actions">
          <Link to="/manageBooking">
            <Button>Manage Appoinments</Button>
          </Link>
        </div>
        <div className="bottomProfile ">
          <div className="c_categoryTitle d-flex justify-content-between">
            <h5>Services</h5>
          </div>
          <div className="userServices d-flex gap-4">
            {userInfo.services.map((ele, index) => {
              return (
                <div
                  className="cardContainer"
                  key={index}
                  onClick={() => handleClick(ele._id)}
                >
                  <Card
                    hoverable
                    style={{
                      width: 240,
                      height: 300,
                    }}
                    cover={
                      <img
                        alt="example"
                        src={ele.image1}
                        style={{
                          width: 240,
                          height: 250,
                          objectFit: "cover",
                        }}
                      />
                    }
                  >
                    <Meta title={ele.title} />
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      <Modal
        title="Edit User Profile"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <>
            {loading === false ? (
              <div className="editActions">
                <Button
                  key="submit"
                  type="primary"
                  form="editUserForm"
                  htmlType="submit"
                >
                  Edit User
                </Button>
                <Button
                  key="cancel"
                  onClick={() => {
                    setIsModalOpen(false);
                    form.resetFields();
                  }}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <>
                <Button type="primary" htmlType="submit" disabled={loading}>
                  <SphereSpinner size={15} color="#C2DEEB" loading={loading} />
                  Loading
                </Button>
              </>
            )}
          </>,
        ]}
      >
        <Form
          form={form}
          id="editUserForm"
          onFinish={handleFinish}
          layout="vertical"
        >
          <Form.Item
            name="email"
            label="E-mail"
            rules={[
              {
                type: "email",
                message: "The input is not valid E-mail!",
              },
            ]}
          >
            <Input
              defaultValue={userInfo.email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Item>

          <Form.Item
            name="nickname"
            label="Nickname"
            tooltip="What do you want others to call you?"
          >
            <Input
              defaultValue={userInfo.userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="bio"
            label="Bio"
            tooltip="What do you want others to call you?"
            rules={[
              {
                message: "Please input your Bio!",
                whitespace: true,
              },
            ]}
          >
            <TextArea
              rows={2}
              defaultValue={userInfo.bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Form.Item>

          <Form.Item name="phone" label="Phone Number">
            <Input
              style={{
                width: "100%",
              }}
              defaultValue={userInfo.phone}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </Form.Item>

          <Form.Item name="gender" label="Gender">
            <Select
              placeholder="select your gender"
              defaultValue={userInfo.gender}
              value={gender}
            >
              <Option value="Male" onClick={(e) => setGender(e.target.value)}>
                Male
              </Option>
              <Option value="Female" onClick={(e) => setGender(e.target.value)}>
                Female
              </Option>
              <Option value="Other" onClick={(e) => setGender(e.target.value)}>
                Other
              </Option>
            </Select>
          </Form.Item>
          <p className="errMsg">{errMsg}</p>
        </Form>
      </Modal>
      <Footer />
    </div>
  );
};

export default UserProfile;
