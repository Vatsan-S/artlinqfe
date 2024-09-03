import React, { useState } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from '../Components/Navbar';
import { useDispatch } from "react-redux";
import { setUserInfo } from "../Redux/Slice/userSlice";
import Footer from "../Components/Footer";
import { SphereSpinner } from "react-spinners-kit";
const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  //   -------------------------------handle submit---------------------------------
  const handleSubmit = async (values) => {
    setErrMsg('')
   setLoading(true)
    const payload = {
      email: loginEmail,
      password: loginPassword,
    };
    await axios
      .post("https://artlinq-be.onrender.com/api/user/login", payload)
      .then((res) => {
        console.log(res)
        dispatch(setUserInfo(res.data.existingUser))
        localStorage.setItem('authToken', res.data.token)
        setLoading(false)
        navigate('/')
      })
      .catch((err) => {
        console.log(err)
        setLoading(false)
        setErrMsg(err.response.data.message)
      });
  };
  return (
    <div className="container-fluid col-12  ">
      <Navbar/>
      <div className="loginContainer">
      <Form
        name="login"
        initialValues={{
          remember: true,
        }}
        style={{
          maxWidth: 360,
        }}
        onFinish={handleSubmit}
      >
        <p className="errMsg">{errMsg}</p>
        <Form.Item
          name="email"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please type your Email!",
            },
          ]}
        >
          
          <Input
            prefix={<MailOutlined />}
            placeholder="Email"
            value={loginEmail}
            onChange={(e) => setLoginEmail(e.target.value)}
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
            value={loginPassword}
            onChange={(e) => setLoginPassword(e.target.value)}
          />
        </Form.Item>
        <Form.Item>
          <Flex justify="flex-end">
            <Link to="/forgotPassword">Forgot password</Link>
          </Flex>
        </Form.Item>

        <Form.Item>
          {loading===false?<Button block type="primary" htmlType="submit" >
            Log in
          </Button>:<Button block disabled={loading}><SphereSpinner size={15} color="#C2DEEB" loading={loading} />Loading</Button>}
          or <Link to="/register">Register now!</Link>
        </Form.Item>
      </Form>
      </div>
      <Footer/>
    </div>
  );
};

export default Login;
