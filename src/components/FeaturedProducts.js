import React, { useContext, useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchProducts } from '../axios-services/index.js'

function FeaturedProducts() {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const getProducts = async () => {
            try {
                const response = await fetchProducts();

                if (response) {
                    setProducts(response.data);
                }
            } catch (err) {
                console.error(err);
            }
        };

        getProducts();
    }, []);

    const featuredProducts = useMemo(() => products.slice(0, 8), [products]);

    return (
        <div className="products">
            {products.length ? (
                featuredProducts.map((product) => {
                    return (
                        <div className="productCard" key={product.id}>
                            <div className="cardTitle">
                                <p style={{ marginBottom: 0, padding: 0 }}>
                                    {product.name} : {product.price}
                                    <br />
                                    {product.description}
                                </p>
                            </div>
                            {/* <Link to={`/Products/${product.id}`}>
                                <img className="imgSmall" src={product.imgurl} />
                            </Link> */}
                        </div>
                    );
                })
            ) : (
                <p>Error loading products</p>
            )}
        </div>
    )
}

export default FeaturedProducts;