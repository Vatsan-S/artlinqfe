import React from "react";
import { Card } from "antd";
const { Meta } = Card;
import { IoChevronForwardCircleSharp } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { updateServiceData } from "../Redux/Slice/serviceSlice";
import { useNavigate } from "react-router-dom";
import EcommerceLoading from "./Loading";

const CategoryList = ({ data, type, loading }) => {
const dispatch = useDispatch()
const navigate = useNavigate()
    // -----------------------------handling card click-----------------------------
    const handleClick = (ele)=>{
// dispatch(updateServiceData(ele))

navigate(`/servicePage/${ele._id}`)
    }
  return (
    <div className="c_categoryList">
        <div className="c_categoryTitle d-flex justify-content-between">
        <h5>{type}</h5>
        <p onClick={()=>{navigate(`/serviceList/${type.split(' ')[0]}`)}}>See All</p>
        </div>
        {loading === false ? <div className="c_cardsCollection">
      {data.map((ele, index) => {
        return (
          <div className="c_eachCard" key={index} onClick={()=>handleClick(ele)}>
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
                    objectFit: 'cover'
                  }}
                />
              }
              
            >
              <Meta
                title={ele.title}
                description={ele.artistID.userName}
              />
            </Card>
          </div>
        );
      })}
      {/* <div className="c_chevron  d-flex align-items-center justify-content-center"><IoChevronForwardCircleSharp /></div> */}
    </div>:<div ><EcommerceLoading/></div>}
    </div>
  );
};

export default CategoryList;
