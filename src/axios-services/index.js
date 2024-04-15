import axios from 'axios';
// axios services functions will communicate between the front-end and the API

axios.defaults.baseURL = process.env.URL || 'http://localhost:4000';

// CART

const fetchCart = async (userId) => {
    /*
        this function uses api/cart get route to get the active
        cart of the user with the specified user id.
    */
    try {
        const data = await axios.get(`/api/cart/owner/${userId}`);

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

const createCart = async (userId) => {
    /*
        this function uses api/cart post route to create a cart
        for a user with the specified user id.
    */
    try {
        const data = await axios.post(`/api/cart/owner/${userId}`);

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

const removeItemFromCart = async (cartId, itemId) => {
    /*
        this function uses api/cart delete route to delete an
        item, representing either a single product or a product
        bundle, from a cart with the specified cart id.
    */
    try {
        const data = await axios.delete(`/api/cart/remove/`, {
            cartId: cartId,
            itemId: itemId
        });

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    }
}

const fetchItemsInCart = async (cartId) => {
    /*
        this function uses api/cart get route to get all items from a
        cart with the specified cart id.
    */
    try {
        const data = await axios.get(`/api/cart/${cartId}`);

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

const insertItemInCart = async (cartId, productId, quantity) => {
    /*
        this function uses api/cart post route to add a specified product
        and quantity into the cart with the specified cart id.
    */
    try {
        const data = await axios.post(`/api/cart/${cartId}`, {
            productId: productId,
            quantity: quantity
        });

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

const modifyQuantityInCart = async (cartId, productId, quantity) => {
    /*
        this function uses api/cart put route to modify the quantity
        of a product within the specified cart.
    */
    try {
        const data = await axios.put(`/api/cart/${cartId}`, {
            productId: productId,
            quantity: quantity
        });

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

const emptyCart = async (cartId) => {
    /*
        this function uses api/cart delete route to delete all items
        from the cart of the specified id.
    */
    try {
        const data = await axios.delete(`/api/cart/${cartId}`);

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

// PRODUCTS

const insertProduct = async (name, description, imgURL, price, categoryId) => {
    /*
        this function uses api/products/ post route to create a new product
        in the database.
    */
    try {
        const data = await axios.post(`/api/products/`, {
            name: name,
            description: description,
            imgURL: imgURL,
            price: price,
            categoryId: categoryId
        });

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

const fetchProducts = async () => {
    /*
        the below performs the same function as:
        
        const response = await fetch(...);
        if (!response.ok) { throw new Error(...) };
        const data = response.json();
        return data;
    */
    try {
        const data = await axios.get(`/api/products/`);

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

const fetchProduct = async (productId) => {
    /*
        this function uses the api/products get route
        to get the product by the product id and return it
        to the front end to be manipulated.
    */
    try {
        const data = await axios.get(`/api/products/${productId}`);

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

const modifyProduct = async (productId, name, description, price, categoryId) => {
    /*
        this function uses the api/products patch route to update
        a product in the database using an updates object. if any
        of the fields in the body object are null or undefined, the
        logic in the corresponding api route with filter them
        out.
    */
    try {
        const data = await axios.put(`/api/products/${productId}`, {
            name: name,
            description: description,
            price: price,
            categoryId: categoryId
        });

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

const removeProduct = async (productId) => {
    /*
        this function uses the api/products delete route to
        delete a product from the database using its id from
        the products table.
    */
    try {
        const data = await axios.delete(`/api/products/${productId}`);

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

export {
    fetchCart,
    createCart,
    removeItemFromCart,
    fetchItemsInCart,
    insertItemInCart,
    modifyQuantityInCart,
    emptyCart,

    insertProduct,
    fetchProducts,
    fetchProduct,
    modifyProduct,
    removeProduct
}