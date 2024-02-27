import axios from 'axios';

axios.defaults.baseURL = process.env.URL || 'http://localhost:4000';

const fetchProducts = async () => {
    try {
        /*
            the below performs the same function as:
            
            const response = await fetch(...);
            if (!response.ok) { throw new Error(...) };
            const data = response.json();
            return data;
         */
        const data = await axios.get(`/api/products/`);
        return data;
    } catch (err) {
        // propagate the error up to the invoking function in React
        throw err;
    }
};

const fetchProduct = async (productId) => {
    try {
        const data = await axios.get(`/api/products/${productId}`);
        return data;
    } catch (err) {
        // propagate the error up to the invoking function in React
        throw err;
    }
}

export {
    fetchProducts,
    fetchProduct
};