import React from 'react';
import { FaLinkedin } from "react-icons/fa";
import { FaBehance } from "react-icons/fa";

const Footer = () => {
    return (
        <div className='container-fluid p-5'>
            <hr />
            <div className="d-md-flex justify-content-between">
                <p>Note: this is a practice project</p>
                <div className="socialIcons d-flex gap-4">
                <a className='socialIcon' target='_blank' href="https://www.linkedin.com/in/vatsan/"><FaLinkedin /></a>
                <a className='socialIcon' target='_blank' href="https://www.behance.net/infocreatoca34"><FaBehance /></a>
                </div>
            </div>
        </div>
    );
};

export default Footer;