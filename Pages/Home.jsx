import React, { useEffect, useState } from 'react';
import Navbar from '../Components/Navbar';
import CategoryList from '../Components/CategoryList';
import axios from 'axios';
import ArtistList from '../Components/ArtistList';

const Home = () => {
    // -------------------------------stats-----------------------------------
    const [allServices, setAllServices] = useState([])
    const [allArtist, setAllArtist] = useState([])
    const [visualArt, setVisualArt] = useState([])
    const [performingArt, setPerformingArt] = useState([])
    // -----------------------------fetch all services and all artists--------------------------

    const fetchData = async()=>{
        try {
            const response = await axios.get('https://artlinq-be.onrender.com/api/service/getAllData')
            console.log(response.data.allServices)
            setAllServices(response.data.allServices.slice(0,5))
            setAllArtist(response.data.allArtist.slice(0,5))
            setVisualArt(response.data.allServices.filter((ele)=>ele.category === "Visual"))
            setPerformingArt(response.data.allServices.filter((ele)=>ele.category==="Performing"))
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(()=>{
        fetchData()
    },[])
    return (
        <div className='container-fluid col-12 '>
            <Navbar/>
            <div className="homeBody container">
                <CategoryList data={allServices} type='All Services'/>
                <ArtistList data={allArtist} />
                <CategoryList data={visualArt} type='Visual Art Services'/>
                <CategoryList data={performingArt} type='Performing Services'/>
            </div>
        </div>
    );
};

export default Home;