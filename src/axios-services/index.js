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
        console.error(err);
    }
};

export {
    fetchProducts
};