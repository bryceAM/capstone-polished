import React from 'react';
// import { FeaturedProducts } from './FeaturedProducts.js';
import '../styles/HomePage.css'

function HomePage({ DB }) {
    return (
        <div className="header">
            <img id="welcomeImg" alt="welcome" src="https://i.imgur.com/AleLEV6.png" />
            {/* <FeaturedProducts DB={DB} /> */}
        </div>
    );
};

export default HomePage;