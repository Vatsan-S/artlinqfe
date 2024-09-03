import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Card } from "antd";
const { Meta } = Card;
import { SphereSpinner } from "react-spinners-kit";
import Footer from "../Components/Footer";
const ArtistPage = () => {
  // -------------------------------states-----------------------------
  const [userInfo, setUserInfo] = useState({});
  const { id } = useParams();
  const [loading, setLoading] = useState(false)

  // ---------------------------fetching user info---------------------
  useEffect(() => {
    fetchUserInfo();
  }, []);

    const fetchUserInfo = async () => {
      setLoading(true)
      try {
        
      const result = await axios.post(
        "https://artlinq-be.onrender.com/api/user/fetchUser",
        { id: id }
      );
      // console.log(result);
      setUserInfo(result.data.existingUser);
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(error);
    }
    };
  
// ================================================jsx=======================================================================
  return (
    <div>
      <Navbar />
      {Object.keys(userInfo).length > 0 ? (
        <>
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
                <p className="bio">{userInfo.bio && userInfo.bio}</p>
              </div>
            </div>
            <div className="bottomProfile ">
              <div className="c_categoryTitle d-flex justify-content-between">
                <h5>Services</h5>
              </div>
              <div className="userServices d-flex gap-4 ">
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
        </>
      ) : (
        <div className="spinner"><SphereSpinner
        size={15}
        color="#C2DEEB"
        loading={loading}
      />
      Loading</div>
      )}
      <Footer/>
    </div>
  );
};

export default ArtistPage;
