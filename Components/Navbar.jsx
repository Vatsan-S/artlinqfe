import React, { useEffect, useRef, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Link, useNavigate } from "react-router-dom";
import { UserOutlined, UploadOutlined } from "@ant-design/icons";
import { IoMdChatbubbles } from "react-icons/io";
import { HiHome } from "react-icons/hi";
import { Button, Form, Radio, Input, Select, Upload } from "antd";
import TextArea from "antd/es/input/TextArea";
import axios from "axios";
import { SphereSpinner } from "react-spinners-kit";
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
const Navbar = () => {
  // -----------------------------states--------------------------------
  const navigate = useNavigate()
  const [category, setCategory] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  //   -------------------------------fetch Token------------------------

  let token = localStorage.getItem("authToken");
  let userRole;
  let userID;
  if (token) {
    const decodedToken = jwtDecode(token);
    userRole = decodedToken.role;
    userID = decodedToken.userID;
    
  }
  // -----------------------------------upload function----------------------------------
  const uploadFiles = async(file) => {
   try {
    
    const payload = new FormData()
    payload.append("file", file[0].originFileObj);
    payload.append("upload_preset", "images_preset");
    
    const response = await axios.post(
      "https://api.cloudinary.com/v1_1/ddycjnke1/image/upload",
      payload
    );
    const { secure_url } = response.data;

    return secure_url;
   } catch (error) {
    console.log(error.response.data)
   }
  };
  // -----------------------------------modal--------------------------------------------
  const [form] = Form.useForm();

  const handleSubmit = async (value) => {
    setSuccessMsg("");
    setLoading(true);
    
    let img1;
    if (value.image1) {
      
      img1 = await uploadFiles(value.image1);
      
    }

    let img2;
    if (value.image2) {
      img2 = await uploadFiles(value.image2);
    }
    let img3;
    if (value.image3) {
      img3 = await uploadFiles(value.image3);
    }
    let img4;
    if (value.image4) {
      img4 = await uploadFiles(value.image4);
    }

    const payload = {
      image1: img1,
      image2: img2,
      image3: img3,
      image4: img4,
      artistID: userID,
      category: value.category,
      description: value.description,
      title: value.title,
    };

    await axios
      .post("http://localhost:4000/api/service/createService", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        
        setLoading(false);
        form.resetFields();
        setSuccessMsg("Service Created");
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
        setSuccessMsg("");
      });
    
  };

  // --------------------------------handling logout-------------------------------------------
  const handleLogout = ()=>{
    localStorage.removeItem("authToken")
    location.reload()
  }
  //   ======================================================jsx=================================================
  return (
    <div className="container-fluid">
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <Link to="/" className="navbar-brand" href="#">
            ArtLinQ
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            className="collapse navbar-collapse c_navbar"
            id="navbarSupportedContent"
          >
            <form className="d-flex" role="search">
              <input
                className="form-control me-2"
                type="search"
                placeholder="Search"
                aria-label="Search"
              />
              <button className="btn btn-outline-success" type="submit">
                Search
              </button>
            </form>
            {token ? (
              <>
                <ul className="navbar-nav  mb-2 mb-lg-0 c_navbarSides">
                  <li className="nav-item">
                    <Link
                      className="nav-link active"
                      aria-current="page"
                      href="#"
                    >
                      <div className="c_navicons" onClick={()=>{navigate('/')}}>
                        <HiHome />
                      </div>
                      <div className="navText" onClick={()=>{navigate('/')}}>
                        <p>Home</p>
                      </div>
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link"to='/chats'>
                      <div className="c_navicons">
                        <IoMdChatbubbles />
                      </div>
                      <div className="navText">
                        <p>Chats</p>
                      </div>
                    </Link>
                  </li>
                  <li className="nav-item navText">
                    <Link className="nav-link" href="#">
                      <div className="navText">
                        <p>Profile</p>
                      </div>
                    </Link>
                  </li>
                  <li className="nav-item navText" onClick={handleLogout}>
                    <Link className="nav-link" href="#" >
                      <div className="navText" >
                        <p>Logout</p>
                      </div>
                    </Link>
                  </li>
                  {userRole === "Artist" && (
                    <li className="nav-item">
                      <Link className="nav-link ">
                        <button
                          className="btn btn-primary"
                          data-bs-toggle="modal"
                          data-bs-target="#createService"
                        >
                          create Service
                        </button>
                      </Link>
                    </li>
                  )}
                  <li className="nav-item dropdown m_displayNone">
                    <a
                      className="nav-link dropdown-toggle d-flex c_profileLayout"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <div className="c_profile">
                        <UserOutlined />
                      </div>
                    </a>
                    <ul className="dropdown-menu">
                      <li onClick={handleLogout}>
                        <Link className="dropdown-item" href="#">
                          Log Out
                        </Link>
                      </li>
                      <li>
                        <Link className="dropdown-item" href="#">
                          View Profile
                        </Link>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <Link className="dropdown-item" href="#">
                          Something else here
                        </Link>
                      </li>
                    </ul>
                  </li>
                </ul>
              </>
            ) : (
              <>
                <Link to="/login">
                  <button className="btn-primary btn">Login</button>
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>
      {/* ---------------------------------modal zone-------------------------- */}
      <div className="modal" tabIndex="-1" id="createService">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Modal title</h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                data-bs-target="#createService"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
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
                  name="image1"
                  label="image1"
                  valuePropName="fileList"
                  getValueFromEvent={(e) => {
                    if (Array.isArray(e)) {
                      return e;
                    }
                    return e && e.fileList;
                  }}
                  rules={[
                    {
                      required: true,
                      message: "Please upload the first Image",
                    },
                  ]}
                >
                  <Upload
                    name="image1"
                    listType="picture"
                    maxCount={1}
                    
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
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
                  <Upload
                    name="image2"
                    listType="picture"
                    maxCount={1}
                    
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
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
                  <Upload
                    name="image3"
                    listType="picture"
                    maxCount={1}
                    
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
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
                  <Upload
                    name="image4"
                    listType="picture"
                    maxCount={1}
                   
                  >
                    <Button icon={<UploadOutlined />}>Click to Upload</Button>
                  </Upload>
                </Form.Item>

                <Form.Item
                  name="title"
                  label="Service Title"
                  rules={[
                    {
                      required: true,
                      message: "Please provide service title",
                    },
                  ]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Description"
                  rules={[
                    {
                      required: true,
                      message: "Please provide service description",
                    },
                  ]}
                  hasFeedback
                >
                  <TextArea />
                </Form.Item>

                <Form.Item
                  name="category"
                  label="Service Category"
                  className="custom-select-dropdown"
                  rules={[
                    {
                      required: true,
                      message: "Please select your service Category!",
                      whitespace: true,
                    },
                  ]}
                >
                  <Radio.Group className="c_radiogroup">
                    <Radio value="Visual">Visual</Radio>
                    <Radio value="Performing">Performing</Radio>
                    <Radio value="Literary">Literary</Radio>
                    <Radio value="Film and Media">Film and Media</Radio>
                    <Radio value="Design">Design</Radio>
                    <Radio value="Conceptual">Conceptual</Radio>
                    <Radio value="Craft">Craft</Radio>
                  </Radio.Group>
                </Form.Item>

                <p className="errMsg">{errMsg}</p>
                <p className="successMsg">{successMsg}</p>
                <Form.Item {...tailFormItemLayout}>
                  <>
                    {loading === false ? (
                      <>
                        <Button
                          type="primary"
                          htmlType="submit"
                          className="c_registerButton"
                        >
                          Register
                        </Button>
                        <Button
                          data-bs-dismiss="modal"
                          data-bs-target="#createService"
                        >
                          Close
                        </Button>
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
                  </>
                </Form.Item>
              </Form>
            </div>
          </div>
        </div>
      </div>
      {/* ---------------------------------modal ends here------------------------------------ */}
    </div>
  );
};

export default Navbar;
