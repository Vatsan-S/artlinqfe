import React, { useState } from "react";
import { MailOutlined } from "@ant-design/icons";
import { Button, Form, Input, Flex } from "antd";
import { SphereSpinner } from "react-spinners-kit";
import { Link } from "react-router-dom";
import axios from "axios";
import Navbar from '../Components/Navbar';

const ForgotPassword = () => {
    
  // -----------------------------states---------------------------
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('')

  // ----------------------------handle Submit-----------------------
  const handleSubmit = async (value) => {
    setLoading(true)
setErrMsg('')
setMsg('')
    const payload ={
        email: value.email
    }
    await axios.post('https://artlinq-be.onrender.com/api/user/forgotPassword',payload)
    .then((res)=>{
        // console.log(res)
        setLoading(false)
        setMsg(res.data.message)
    })
    .catch((err)=>{
        console.log(err)
        setErrMsg(err.response.data.message)
        setLoading(false)
    })
  };

//   ======================================================jsx===================================================
  return (
    <div className="container-fluid  col-12">
      <Navbar/>
      <div className="loginContainer">
      <Form
        name="email"
        initialValues={{
          remember: true,
        }}
        style={{
          maxWidth: 360,
        }}
        onFinish={handleSubmit}
      >
        <p className="successMsg">{msg}</p>
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
            
          />
        </Form.Item>

        <Form.Item>
          <>
            {loading === false ? (
              <>
                <Button block type="primary" htmlType="submit">
                  Email Me
                </Button>
              </>
            ) : (
              <>
                <Button block type="primary" disabled={loading}>
                  <SphereSpinner size={15} color="#C2DEEB" loading={loading} />
                  Loading
                </Button>
              </>
            )}
          </>
          or <Link to="/login">Back to login!</Link>
        </Form.Item>
      </Form>
      </div>
    </div>
  );
};

export default ForgotPassword;
