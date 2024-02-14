import React from 'react';
import { default as FeaturedProducts } from './FeaturedProducts.js';
import '../styles/HomePage.css'

function HomePage() {

    return (
        <div className="header">
            <FeaturedProducts />
        </div>
    );
};

export default HomePage;