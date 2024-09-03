import React, { useEffect, useState } from "react";
import Navbar from "../Components/Navbar";
import CategoryList from "../Components/CategoryList";
import axios from "axios";
import ArtistList from "../Components/ArtistList";
import { useDispatch } from "react-redux";
import { updateServiceData } from "../Redux/Slice/serviceSlice";
import Footer from "../Components/Footer";

const Home = () => {
  // -------------------------------stats-----------------------------------
  const dispatch = useDispatch();

  const [allServices, setAllServices] = useState([]);
  const [allArtist, setAllArtist] = useState([]);
  const [visualArt, setVisualArt] = useState([]);
  const [performingArt, setPerformingArt] = useState([]);
  const [loading, setLoading] = useState(false)
  // -----------------------------fetch all services and all artists--------------------------

  const fetchData = async () => {
    setLoading(true)
    try {
      
      const response = await axios.get(
        "https://artlinq-be.onrender.com/api/service/getAllData"
      );
      console.log(response.data.allServices);
      dispatch(updateServiceData(response.data.allServices));
      setAllServices(response.data.allServices.slice(0, 5));
      setAllArtist(response.data.allArtist.slice(0, 7));
      setVisualArt(
        response.data.allServices.filter((ele) => ele.category === "Visual")
      );
      setPerformingArt(
        response.data.allServices.filter((ele) => ele.category === "Performing")
      );
      setLoading(false)
    } catch (error) {
      console.log(error);
      setLoading(false)
    }
  };
  useEffect(() => {
    fetchData();
  }, []);
  return (
    <div className="container-fluid col-12 ">
      <Navbar />
    
      <div className="banner container">
        <img className="webDisplay" src="https://res.cloudinary.com/ddycjnke1/ArtLinQ_zls25r" alt="" />
        <img className="mobDisplay" src="https://res.cloudinary.com/ddycjnke1/ArtLinQ_m_mzjiy4" alt="" />
      </div>
      <div className="homeBody container">
        <CategoryList data={allServices} type="All Services"  loading={loading}/>
        <ArtistList data={allArtist} />
        <CategoryList data={visualArt} type="Visual Art Services" loading={loading}/>
        <CategoryList data={performingArt} type="Performing Services" loading={loading}/>
      </div>
      <Footer/>
    </div>
  );
};

export default Home;
