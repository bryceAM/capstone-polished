import React, { useContext } from 'react';
import Context from '../context.js';

function FeaturedProducts() {
    const { DB } = useContext(Context);

    return (
        <>
            <div>placeholder text: {DB}</div>
        </>
    )
}

export default FeaturedProducts;