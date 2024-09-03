import React from "react";
import { useNavigate } from "react-router-dom";

const ArtistList = ({ data }) => {
  console.log("artistData", data);
  const navigate = useNavigate();

  // ------------------------handling artist click----------------------
  const handleArtistClick = (ele) => {
    navigate(`/artist/${ele._id}`);
  };
  return (
    <div className="c_categoryList">
      <div className="c_categoryTitle d-flex justify-content-between">
        <h5>Artists</h5>
        {/* <p>See All</p> */}
      </div>
      <div className="c_cardsCollection">
        {data.map((ele, index) => {
          return (
            <div
              key={index}
              className="artistGroup d-flex flex-column justify-content-between align-items-center"
              onClick={() => {
                handleArtistClick(ele);
              }}
            >
              <div className="profileCircle">
                {ele.userName.slice(0, 1).toUpperCase()}
              </div>
              <p>{ele.userName}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ArtistList;
