import React from 'react';
import './HomePage.css';
import HeroImage from '../../assets/home01.png'; // replace with actual image path
import { Features } from './Feature';

const Home = () => {
  return (
    <>
    <div className="hero-section">
      <div className="hero-container">
        {/* Left Side - Image */}
        <div className="hero-image">
          <img src={HeroImage} alt="Hero" />
        </div>

        {/* Right Side - Content */}
        <div className="hero-content">
          <h1>BooksHive – Redefining the Library Experience</h1>
          <p>
           Your one-stop e-book library platform for learning and collaboration.
          </p>
          {/* <button className="cta-button">Get Consultation</button> */}
        </div>
      </div>

      {/* SVG curve */}
      <svg className="hero-curve" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 250">
        <path
          fill="#ffffff"
          d="M0,160 C480,280 960,40 1440,160 L1440,320 L0,320 Z"
        ></path>
      </svg>
    </div>
    <Features> </Features>
    </>
  );
};

export default Home;
