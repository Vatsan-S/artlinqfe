import React, { useState } from "react";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input, Flex } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from '../Components/Navbar';
const Login = () => {
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const navigate = useNavigate()

  //   -------------------------------handle submit---------------------------------
  const handleSubmit = async (values) => {
    setErrMsg('')
   
    const payload = {
      email: loginEmail,
      password: loginPassword,
    };
    await axios
      .post("https://artlinq-be.onrender.com/api/user/login", payload)
      .then((res) => {
        // console.log(res)
        localStorage.setItem('authToken', res.data.token)
        navigate('/')
      })
      .catch((err) => {
        console.log(err)
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
          <Button block type="primary" htmlType="submit" >
            Log in
          </Button>
          or <Link to="/register">Register now!</Link>
        </Form.Item>
      </Form>
      </div>
    </div>
  );
};

export default Login;
