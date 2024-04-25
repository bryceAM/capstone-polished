import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
    fetchProduct,
    insertItemInCart,
    modifyQuantityInCart,
    fetchCart,
    fetchItemsInCart
} from '../axios-services/index.js';

function SingleProduct({ user }) {
    const { productId } = useParams();
    const [product, setProduct] = useState({});
    const [cart, setCart] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        /*
            retrieve a product by id in order to render its properties
            in the SingleProduct view.
        */
        const getProduct = async (productId) => {
            try {
                const response = await fetchProduct(productId);
                const product = response.data;

                if (product) setProduct(product);
            } catch (err) {
                console.error(err);
            };
        };

        getProduct(productId);
    }, []);

    useEffect(() => {
        /*
            retrieve the user's cart info to be used in the handleClick
            function later.
        */
        const getCart = async (userId) => {
            try {
                const response = await fetchCart(userId);
                const cart = response.data;

                if (cart) setCart(cart);
            } catch (err) {
                console.error(err);
            };
        };

        getCart(user.id);
    }, []);

    const handleClick = async (cartId, productId, quantity, product) => {
        /*
            adds the specified item to the user's cart.
            on success or error it notifies the user in a toast message.
        */
        try {
            const response = await fetchItemsInCart(cart.id);
            const foundProduct = response.find((product) => product['product_id'] == productId);
            
            try {
                if (foundProduct) {
                    await modifyQuantityInCart(cartId, productId, quantity);
                } else {
                    await insertItemInCart(cartId, productId, quantity);
                };
    
                toast.success(`${product.name} added to cart!`, {
                    position: "bottom-left",
                    autoClose: 2000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: false,
                    progress: undefined,
                });
            } catch (err) {
                throw err;
            };
        } catch (err) {
            toast.error(err.message, {
                position: "bottom-left",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
                progress: undefined,
            });
        };
    };

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
                        <button onClick={() => handleClick(cart.id, productId, 1, product)} className='add-to-cart'>Add To Cart</button>
                    </div> :
                    <p>Error loading product</p>
                }
                <button className='back-button' onClick={() => navigate(-1)}>Go Back</button>
            </div>
        </>
    );
}

export default SingleProduct;