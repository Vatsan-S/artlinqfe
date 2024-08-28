import React from 'react';

const ArtistList = ({data}) => {
    console.log(data)
    return (
        <div className='c_categoryList'>
            <div className="c_categoryTitle d-flex justify-content-between">
        <h5>Artists</h5>
        <p>See All</p>
        </div>
        <div className="c_cardsCollection">
            {data.map((ele,index)=>{
                return(
                    <div key={index} className="artistGroup d-flex flex-column justify-content-between align-items-center">
                        <div className="profileCircle">{ele.userName.slice(0,1).toUpperCase()}</div>
                        <p>{ele.userName}</p>
                    </div>
                )
            })}
            </div>
        </div>
    );
};

export default ArtistList;