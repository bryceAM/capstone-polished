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
    };
};

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

// ORDERS

const fetchOrders = async () => {
    /*
        this function uses an api/orders get route to get all orders from the
        database.
    */
    try {
        const data = await axios.get(`/api/orders/`);

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

const insertOrder = async (cartId, orderUserId, orderShipName, orderShipAddress, orderShipAddress2, orderCity, orderState, orderZip, orderEmail, orderShipped, orderTrackingNumber, orderProducts) => {
    /*
        this function uses api/orders post route to insert a new order
        in the database
    */
    try {
        const data = await axios.post(`/api/orders/`, {
            cartId: cartId,
            orderUserId: orderUserId,
            orderShipName: orderShipName,
            orderShipAddress: orderShipAddress,
            orderShipAddress2: orderShipAddress2,
            orderCity: orderCity,
            orderState: orderState,
            orderZip: orderZip,
            orderEmail: orderEmail,
            orderShipped: orderShipped,
            orderTrackingNumber: orderTrackingNumber,
            orderProducts: orderProducts
        });

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

const fetchOrder = async (orderId) => {
    /*
        this function uses an api/orders get route to get an order with the
        specified order id from the database.
    */
    try {
        const data = await axios.get(`/api/orders/id/${orderId}`);

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

// USERS

const loginUser = async (username, password) => {
    /*
        this function uses an api/users post route to log a user into
        the website.
    */
    try {
        const data = await axios.post(`/api/users/login/`, {
            username: username,
            password: password
        });
        
        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

const insertUser = async (username, password, userEmail, userFirstName, userLastName, userAddress, userAddress2, userCity, userState, userZip) => {
    /*
        this function uses an api/users post route to create a new
        user in the database.
    */
    try {
        const data = await axios.post(`/api/users/register/`, {
            username: username,
            password: password,
            userEmail: userEmail,
            userFirstName: userFirstName,
            userLastName: userLastName,
            userAddress: userAddress,
            userAddress2: userAddress2,
            userCity: userCity,
            userState: userState,
            userZip: userZip
        });

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

const fetchOrdersByUser = async (username) => {
    /*
        this function uses an api/users get route to retrieve all orders of
        a user with the specified username.
    */
    try {
        const data = await axios.get(`/api/users/${username}/orders`);

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

const verifyUser = async (token) => {
    /*
        this function uses an api/users get route to verify a user
        and return important user credentials.
    */
    try {
        const data = await axios.get(`/api/users/token/${token}`);

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

const fetchUsers = async () => {
    /*
        this function uses an api/users get route to return all users from
        the database.
    */
    try {
        const data = await axios.get(`/api/users/`);

        return data;
    } catch (err) {
        // propagate the error up to the component
        throw err;
    };
};

const fetchUser = async (username) => {
    /*
        this function uses an api/users get route to return a user
        from the database with the specified username.
    */
    try {
        const data = await axios.get(`/api/users/${username}`);

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

    fetchOrder,
    fetchOrders,
    insertOrder,

    insertProduct,
    fetchProducts,
    fetchProduct,
    modifyProduct,
    removeProduct,

    loginUser,
    insertUser,
    fetchOrdersByUser,
    verifyUser,
    fetchUsers,
    fetchUser
}