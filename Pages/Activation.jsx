import axios from "axios";
import React, { useEffect, useState } from "react";
import { Button, Form, Input, Select } from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { WarningOutlined } from "@ant-design/icons";
import { SphereSpinner } from "react-spinners-kit";

const Activation = () => {
  const { randomString } = useParams();
  const navigate = useNavigate();
  const [errMsg, setErrMsg] = useState("");
  const [allowReset, setAllowReset] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [submitErrMsg, setSubmitErrMsg] = useState("");
  const [userID, setUserID] = useState('')
  // ------------------------validate random String-----------------------
  const initial = randomString.slice(0, 1);
//   console.log(initial);

  // ------------------------Validate Password change-------------------
  const validatePassword = async () => {
    setAllowReset(false)
    setLoading(true)
    setErrMsg('')
    await axios.post('https://artlinq-be.onrender.com/api/user/validatePassword',{randomString:randomString})
    .then((res)=>{
        // console.log(res)
        setUserID(res.data.userID)
        setAllowReset(true)
        setLoading(false)
    })
    .catch((err)=>{
        console.log(err)
        setLoading(false)
    })
  };

  // ------------------------validate activation-------------------------
  const validateActivation = async () => {
    setErrMsg("");
    await axios
      .post("https://artlinq-be.onrender.com/api/user/activate_registration", {
        randomString: randomString,
      })
      .then((res) => {
        // console.log(res)
        navigate("/login");
      })
      .catch((err) => {
        console.log(err);
        setErrMsg(err.response.data.message);
      });
  };
  useEffect(() => {
    if (initial === "P") {
      validatePassword();
    } else if (initial === "R") {
      validateActivation();
    }
  }, []);
  // ---------------------------------handle new password submit-------------------------------
  const handleSubmit = async (value) => {
    setSubmitLoading(true);
    setSubmitErrMsg("");
    const payload = {
      newPassword: value.password,
      userID: userID
    };
    await axios
      .post("https://artlinq-be.onrender.com/api/user/resetPassword", payload)
      .then((res) => {
        // console.log(res);
        setSubmitLoading(false);
        navigate('/login')
      })
      .catch((err) => {
        console.log(err);
        setSubmitLoading(false);
        setSubmitErrMsg(err.response.data.message);
      });
  };
  // ====================================================jsx===============================================
  return (
    <div className="container col-12 col-md-6 loginContainer">
      {loading === false ? (
        allowReset === true && (
          <>
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
                <Input.Password />
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
                        new Error(
                          "The new password that you entered do not match!"
                        )
                      );
                    },
                  }),
                ]}
              >
                <Input.Password />
              </Form.Item>
              <p className="errMsg">{submitErrMsg}</p>
              <Form.Item>
                <>
                  {submitLoading === false ? (
                    <>
                      <Button block type="primary" htmlType="submit">
                        Change Password
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button block type="primary" htmlType="submit">
                        <SphereSpinner
                          size={15}
                          color="#C2DEEB"
                          loading={submitLoading}
                        />
                        Loading
                      </Button>
                    </>
                  )}
                </>
              </Form.Item>
            </Form>
          </>
        )
      ) : (
        <>
          <SphereSpinner size={15} color="#C2DEEB" loading={loading} />
          Loading
        </>
      )}
      {errMsg && (
        <>
          <WarningOutlined /> {errMsg}
        </>
      )}
    </div>
  );
};

export default Activation;
