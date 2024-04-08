import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchProduct } from '../axios-services/index.js';

function SingleProduct() {
    const { productId } = useParams();
    const [product, setProduct] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const getProduct = async () => {
            try {
                const response = await fetchProduct(productId);
                
                if (response) {
                    setProduct(response.data);
                }
            } catch (err) {
                console.error(err);
            };
        };

        getProduct();
    }, []);

    return (
        <>
            <div className="single-product-page">
                {product ?
                    <div className="single-product-card">
                        <p style={{ marginBottom: 0, padding: 0 }}>
                            {product.name} : ${product.price}
                            <br />
                            {product.description}
                            <br />
                            <img src={product.imgURL} width='150' />
                        </p>
                        <button className='add-to-cart'>Add To Cart</button>
                    </div> :
                    <p>Error loading product</p>
                }
                <button className='back-button' onClick={() => navigate(-1)}>Go Back</button>
            </div>
        </>
    );
}

export default SingleProduct;