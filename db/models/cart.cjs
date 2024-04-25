const client = require('../client.cjs');


async function createActiveCart(userId) {
    /*
        each person has one active cart.
        this function creates a cart with the specified cartId.
        cartId = userId + transactionId
        cartId takes the form of a whole number with a decimal appended to it.
    */
    try {
        const transactionId = (Math.floor(Math.random() * 100000)) / 100000;
        const cartId = userId + transactionId;

        const { rows: [cart] } = await client.query(`
            INSERT INTO active_cart(id, user_id)
            VALUES($1, $2)
            RETURNING *;
        `, [cartId, userId]);

        return cart;
    } catch (err) {
        // propagate error to init_db.js, api/cart.cjs
        throw err;
    };
};

async function getActiveCart(userId) {
    /*
        gets the cart of a specified user
    */
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM active_cart
            WHERE user_id=${userId};
        `);

        return rows;
    } catch (err) {
        // propagate error to api/cart.cjs
        throw err;
    };
};

async function addItemToCart({productId, cartId, quantity}) {
    /*
        adds one or more of the same type of product from the database into the cart
        with the specified cart id. the cart id will need to be of the form 123456.12345
        and sent from the front-end.
    */
    try {
        const { rows } = await client.query(`
            INSERT INTO active_cart_items(product_id, active_cart_id, quantity)
            VALUES($1, $2, $3)
            RETURNING *;
        `, [productId, cartId, quantity]);

        return rows;
    } catch (err) {
        // propagate error to init_db.js, api/cart.cjs
        throw err;
    };
};

async function updateQuantity({productId, cartId, quantity}) {
    /*
        update the quantity of the specified product in the cart with the specified id.
    */
    try {
        const { rows } = await client.query(`
            UPDATE active_cart_items
            SET quantity = quantity + $3
            WHERE active_cart_id = $1 AND product_id = $2
            RETURNING *;
        `, [cartId, productId, quantity]);

        return rows;
    } catch (err) {
        // propagate error to api/cart.cjs
        throw err;
    };
};

async function removeItemFromCart(cartId, itemId) {
    /*
        remove an entire item entry (product bundle with one or more products of that type)
        of specified item id from an active cart of specified cart id.
    */
    try {
        const { rows } = await client.query(`
            DELETE FROM active_cart_items
            WHERE active_cart_id = $1 AND product_id = $2
            RETURNING *;
        `, [cartId, itemId]);

        return rows;
    } catch (err) {
        // propagate error to api/cart.cjs
        throw err;
    };
};

async function getAllItemsInCart(cartId) {
    /*
        get all items from the specified cart
    */
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM active_cart_items
            WHERE active_cart_id=${cartId};
        `);

        return rows;
    } catch (err) {
        // propagate error to api/cart.cjs
        throw err;
    };
};

async function emptyCart(cartId) {
    /*
        delete all items in the cart with the specified id.
    */
    try {
        const { rows } = await client.query(`
            DELETE FROM active_cart_items
            WHERE active_cart_id=$1
            RETURNING *;
        `, [cartId])

        return rows;
    } catch (err) {
        // propagate error to api/cart.cjs
        throw err;
    };
};

module.exports = {
    createActiveCart,
    getActiveCart,
    addItemToCart,
    updateQuantity,
    removeItemFromCart,
    getAllItemsInCart,
    emptyCart
}