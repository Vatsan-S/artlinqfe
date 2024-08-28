import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { Layout, Menu, theme, Space, Input, Button } from "antd";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
const { Header, Content, Footer, Sider } = Layout;
import { io } from "socket.io-client";

const Chatpage = () => {
  // ---------------------------states----------------------------------
  const [allChats, setAllchats] = useState([]);
  const [collapsed, setCollapsed] = useState(false);
  const [socket, setSocket] = useState(null);
  // -----------------------------getting token----------------------------
  const token = localStorage.getItem("authToken");
  const decoded = jwtDecode(token);
  // ----------------------------fetching all chats-------------------------
  const fetchAllChats = async () => {
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
      setAllchats(response.data.allChats);
    } catch (error) {
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
    const user = ele.users.filter((ele)=>ele._id!==decoded.userID)
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
      setCurrentChatMessages(result.data.allMessages);
    } catch (error) {
      console.log(error);
    }
  };
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
      setMsgContent('')
      console.log('Working')
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
            <Menu
              theme="dark"
              defaultSelectedKeys={[]}
              mode="inline"
              items={items}
              onClick={handleChatClick}
            />
          </Sider>
          <Layout
            style={{
              minHeight: "90vh",
            }}
          >
            <Header
              style={{
                padding: 0,
                background: colorBgContainer,
              }}
            />
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
                {currentChatMessages.map((ele, index) => {
                  return (
                    <h6
                      key={index}
                      className={
                        ele.sender === decoded.userID ? "showRight" : "showLeft"
                      }
                    >
                      {ele.content}
                    </h6>
                  );
                })}
                <div className="textInput"></div>
              </div>
            </Content>
            <Footer
              style={{
                textAlign: "center",
                padding: 8,
              }}
            >
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
            </Footer>
          </Layout>
        </Layout>
      </div>
    </div>
  );
};

export default Chatpage;
