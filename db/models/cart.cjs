const client = require('../client.cjs');
const { queryTransaction } = require('../databaseHelpers.cjs');

async function createActiveCart({ userId }) {
    /*
    
    */
    try {
        const cart = await queryTransaction(
            async (client) => {
                const { rows: [cartFromDB] } = await client.query(`
                    INSERT INTO active_cart(user_id)
                    VALUES($1)
                    RETURNING *;
                `, [userId]);

                return cartFromDB;
            }
        );

        return cart;
    } catch (err) {
        // propagate error to init_db.js, api/cart.cjs
        throw err;
    };
};

async function getActiveCart(userId) {
    /*
    
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

async function addItemToCart({ productId, cartId, quantity }) {
    /*
    
    */
    try {
        const addedItem = await queryTransaction(
            async (client) => {
                const { rows } = await client.query(`
                    INSERT INTO active_cart_items(product_id, active_cart_id, quantity)
                    VALUES($1, $2, $3)
                    RETURNING *;
                `, [productId, cartId, quantity]);

                return rows;
            }
        );

        return addedItem;
    } catch (err) {
        // propagate error to init_db.js, api/cart.cjs
        throw err;
    };
};

async function updateQuantity(activeCartItemId, quantity) {
    /*
    
    */
    try {
        const updatedQuantity = await queryTransaction(
            async (client) => {
                const { rows } = await client.query(`
                    UPDATE active_cart_items
                    SET quantity=${quantity}
                    WHERE id=${activeCartItemId}
                    RETURNING *;
                `);

                return rows;
            }
        );

        return updatedQuantity;
    } catch (err) {
        throw err;
    };
};

async function removeItemFromCart(activeCartItemId) {
    /*
    
    */
    try {
        const removedItem = await queryTransaction(
            async (client) => {
                const { rows } = await client.query(`
                    DELETE FROM active_cart_items
                    WHERE id=${activeCartItemId}
                    RETURNING *;
                `);

                return rows;
            }
        );

        return removedItem;
    } catch (err) {
        // propagate error to api/cart.cjs
        throw err;
    };
};

async function getAllItemsInCart(cartId) {
    /*
    
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

module.exports = {
    createActiveCart,
    getActiveCart,
    addItemToCart,
    updateQuantity,
    removeItemFromCart,
    getAllItemsInCart
}