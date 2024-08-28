import React, { useState } from "react";
import { Button, Form, Input, Select } from "antd";
import axios from "axios";
import { SphereSpinner } from "react-spinners-kit";
import { useNavigate } from "react-router-dom";
import Navbar from '../Components/Navbar';
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

// ----------------------------component----------------------------------
const App = () => {
  // -----------------------states-------------------------------------
  const navigate = useNavigate()
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState("");
  const [gender, setGender] = useState("");
  // -----------------------------------------------------------------------------
  const [form] = Form.useForm();


  //   ------------------------------handle submit-----------------------------
  const handleSubmit = async (value) => {
    setLoading(true);
    setErrMsg("");
    const payload = {
      userName: value.nickname,
      email: value.email,
      password: value.password,
      role: value.role,
      phone: value.phone,
      gender: value.gender,
    };
    console.log(payload)
    await axios
      .post("https://artlinq-be.onrender.com/api/user/register", payload)
      .then((res) => {
        console.log(res);
        setLoading(false);
        navigate('/login')
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setErrMsg(err.response.data.message);
      });
  };
  //  =======================================================jsx=====================================================
  return (
    <div className="container-fluid ">
      <Navbar/>
      <div className="loginContainer">
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={handleSubmit}
        style={{
          maxWidth: 600,
        }}
        scrollToFirstError
      >
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: "email",
              message: "The input is not valid E-mail!",
            },
            {
              required: true,
              message: "Please input your E-mail!",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            {
              required: true,
              message: "Please input your password!",
            },
          ]}
          hasFeedback
        >
          <Input.Password  />
        </Form.Item>

        <Form.Item
          name="confirm"
          label="Confirm Password"
          dependencies={["password"]}
          hasFeedback
          rules={[
            {
              required: true,
              message: "Please confirm your password!",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The new password that you entered do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="nickname"
          label="Nickname"
          tooltip="What do you want others to call you?"
          rules={[
            {
              required: true,
              message: "Please input your nickname!",
              whitespace: true,
            },
          ]}
        >
          <Input  />
        </Form.Item>
        <Form.Item
          name="role"
          label="Iam an"
          rules={[
            {
              required: true,
              message: "Please select your role!",
              whitespace: true,
            },
          ]}
        >
          <Select placeholder="select your role" value={role} >
            <Option value="Artist" onClick={e=>setRole(e.target.value)}>Artist</Option>
            <Option value="Customer" onClick={e=>setRole(e.target.value)}>Customer</Option>
          </Select>
        </Form.Item>

        <Form.Item name="phone" label="Phone Number">
          <Input
            style={{
              width: "100%",
            }}
           
          />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[
            {
              required: true,
              message: "Please select gender!",
            },
          ]}
        >
          <Select placeholder="select your gender" value={gender} >
            <Option value="Male" onClick={e=>setGender(e.target.value)}>Male</Option>
            <Option value="Female" onClick={e=>setGender(e.target.value)}>Female</Option>
            <Option value="Other" onClick={e=>setGender(e.target.value)}>Other</Option>
          </Select>
        </Form.Item>
        <p className="errMsg">{errMsg}</p>
        <Form.Item {...tailFormItemLayout}>
          <>
            {loading === false ? (
              <>
                <Button type="primary" htmlType="submit">
                  Register
                </Button>
              </>
            ) : (
              <>
                <Button type="primary" htmlType="submit" disabled={loading}>
                  <SphereSpinner size={15} color="#C2DEEB" loading={loading} />
                  Loading
                </Button>
              </>
            )}
          </>
        </Form.Item>
      </Form>
      </div>
    </div>
  );
};
export default App;
