import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { Layout, Menu, theme, Space, Input, Button } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const { Header, Content, Footer, Sider } = Layout;
import { io } from "socket.io-client";
import { useParams } from "react-router-dom";
import { SphereSpinner } from "react-spinners-kit";

const Chatpage = () => {
  // ---------------------------states----------------------------------
  const [allChats, setAllchats] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [socket, setSocket] = useState(null);
  const [loading, setLoading] = useState(false);
  const [chatUsersLoading, setChatUsersLoading] = useState(false);
  // -----------------------------getting token----------------------------
  const token = localStorage.getItem("authToken");
  const decoded = jwtDecode(token);

  const { userID } = useParams();
  // ----------------------------fetching all chats-------------------------
  const fetchAllChats = async () => {
    setChatUsersLoading(true);
    try {
      const response = await axios.get(
        "https://artlinq-be.onrender.com/api/chats/fetchAllChats",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response.data.allChats);
      setChatUsersLoading(false);
      setAllchats(response.data.allChats);
    } catch (error) {
      setChatUsersLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    fetchAllChats();
    const newSocket = io("https://artlinq-be.onrender.com");
    setSocket(newSocket);
    // console.log("newSocket", newSocket);
    return () => newSocket.close();
  }, []);

  //   -------------------------------------chat list functionalities---------------------------------------------
  function getItem(label, key) {
    return {
      key,
      label,
    };
  }

  const items = allChats.map((ele) => {
    const user = ele.users.filter((user) => user._id !== decoded.userID);
    return getItem(user[0].userName, ele._id, ele);
  });

  const {
    token: { colorBgContainer },
  } = theme.useToken();
  // -----------------------------------------updateing socket------------------------------
  useEffect(() => {
    if (socket) {
      socket.on("chat message", (msg) => {
        setCurrentChatMessages((previousMsgs) => [...previousMsgs, msg]);
      });
    }
  }, [socket]);
  //   ------------------------------------handling chat click-----------------------------------
  const [currentChatMessages, setCurrentChatMessages] = useState([]);
  const [chatName, setChatName] = useState("");
  const [chatID, setChatID] = useState("");
  const [msgContent, setMsgContent] = useState("");

  const handleChatClick = async (ele) => {
    // find the opposite user
    setChatID(ele.key);
    const specificChat = allChats.filter((item) => item._id === ele.key);

    const otherUser = specificChat[0].users.filter(
      (ele) => ele._id !== decoded.userID
    );

    setChatName(otherUser[0].userName);
    setLoading(true);
    try {
      const payload = {
        chat: ele.key,
      };
      const result = await axios.post(
        "https://artlinq-be.onrender.com/api/chats/fetchAllMessages",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setLoading(false);
      setCurrentChatMessages(result.data.allMessages);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  console.log(items);
  console.log(chatID);
  // --------------------------------------------handling specific Chat------------------------------------------------
  useEffect(() => {
    const updateChat = async () => {
      setLoading(true);
      try {
        const result = await axios.post(
          "https://artlinq-be.onrender.com/api/chats/accessChat",
          { userID: userID },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("result", result);
        setChatID(result.data.chat._id);
        const chatUserName = result.data.chat.users.filter(
          (user) => user._id !== decoded.userID
        );
        console.log(chatUserName[0].userName);
        setChatName(chatUserName[0].userName);
        const fetchAllMessage = await axios.post(
          "https://artlinq-be.onrender.com/api/chats/fetchAllMessages",
          { chat: result.data.chat._id },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setLoading(false);
        setCurrentChatMessages(fetchAllMessage.data.allMessages);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    };
    if (userID) {
      updateChat();
    }
  }, [userID]);
  // ------------------------------------------handle send message-----------------------------------------------------
  const handleSendMessage = async () => {
    if (!msgContent.trim()) {
      return console.log("No content");
    }
    const payload = {
      chat: chatID,
      sender: decoded.userID,
      content: msgContent,
    };
    try {
      const result = await axios.post(
        "https://artlinq-be.onrender.com/api/chats/sendMessage",
        payload,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMsgContent("");
      console.log("Working");
      socket.emit("chat message", payload);
    } catch (error) {
      console.log(error);
    }
  };
  // =================================================================jsx===================================================
  return (
    <div>
      <Navbar />
      <div className="container-fluid ">
        <Layout
          style={{
            minHeight: "90vh",
            display: "flex",
          }}
        >
          <Sider
            collapsible
            collapsed={collapsed}
            onCollapse={(value) => setCollapsed(value)}
          >
            {chatUsersLoading === false ? (
              <Menu
                theme="dark"
                defaultSelectedKeys={[`${chatID}`]}
                mode="inline"
                items={items}
                onClick={handleChatClick}
              />
            ) : (
              <div className="spinner">
                <SphereSpinner size={15} color="white" loading={chatUsersLoading} />
                <span style={{color:'white'}}>Loading</span>
              </div>
            )}
          </Sider>
          <Layout
            style={{
              minHeight: "90vh",
            }}
          >
            <Header
              style={{
                background: colorBgContainer,
                display: "flex",
                alignItems: "center",
                padding: 15,
              }}
            >
              <h5 className="chatName">{chatName}</h5>
            </Header>
            <Content
              style={{
                margin: "0 16px",
              }}
            >
              <div
                className="chatBox"
                style={{
                  padding: 16,
                  minHeight: 360,
                }}
              >
                {loading === false ? (
                  <div className="chatDiv">
                    {currentChatMessages.map((ele, index) => {
                      return (
                        <h6
                          key={index}
                          className={
                            ele.sender === decoded.userID
                              ? "showRight"
                              : "showLeft"
                          }
                        >
                          {ele.content}
                        </h6>
                      );
                    })}
                  </div>
                ) : (
                  <>
                    <SphereSpinner
                      size={15}
                      color="#C2DEEB"
                      loading={loading}
                    />
                    Loading
                  </>
                )}
                {chatID !== "" ? (
                  <div className="textInput">
                    <Space.Compact
                      style={{
                        width: "100%",
                      }}
                    >
                      <Input
                        placeholder="Type your message Here"
                        value={msgContent}
                        onChange={(e) => setMsgContent(e.target.value)}
                        required
                      />
                      <Button type="primary" onClick={handleSendMessage}>
                        Send
                      </Button>
                    </Space.Compact>
                  </div>
                ) : (
                  <></>
                )}
              </div>
            </Content>
            <Footer
              style={{
                textAlign: "center",
                padding: 8,
              }}
            ></Footer>
          </Layout>
        </Layout>
      </div>
    </div>
  );
};

export default Chatpage;
