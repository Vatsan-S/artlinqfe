import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Card } from "antd";
import Footer from "../Components/Footer";
const { Meta } = Card;

const SeeallPage = () => {
  const { type } = useParams();
  const [allData, setAllData] = useState([]);

  // ---------------------fetch Data-------------------------
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const result = await axios.post(
        "https://artlinq-be.onrender.com/api/service/getServiceCategory",
        { type: type }
      );
      console.log(result);
      setAllData(result.data.allData);
    } catch (error) {
      console.log(error);
    }
  };
  
  const navigate = useNavigate()
    // -----------------------------handling card click-----------------------------
    const handleClick = (ele)=>{
// dispatch(updateServiceData(ele))

navigate(`/servicePage/${ele._id}`)
    }
  return (
    <div>
      <Navbar />
      <h6 className="container mt-5">{type} Services</h6>
      <div className="container d-flex gap-4 flex-wrap">
        
        {allData.map((ele, index) => {
          return (
            <div
              className="c_eachCard"
              key={index}
              onClick={() => handleClick(ele)}
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
                      height: 200,
                      objectFit: "cover",
                    }}
                  />
                }
              >
                <Meta title={ele.title} description={ele.artistID.userName} />
              </Card>
            </div>
          );
        })}
      </div>
      <Footer/>
    </div>
  );
};

export default SeeallPage;
