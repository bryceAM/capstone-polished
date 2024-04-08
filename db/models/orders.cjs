const client = require('../client.cjs');

async function getAllOrders() {
    /*
        retrieve all orders from database.
        return array of orders.
    */
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM orders;
        `);

        return rows;
    } catch (err) {
        // propagate error to api/orders.cjs
        throw err;
    };
};

async function createOrder({
    orderUserId,
    orderShipName,
    orderShipAddress,
    orderShipAddress2,
    orderCity,
    orderState,
    orderZip,
    orderEmail,
    orderShipped,
    orderTrackingNumber
}) {
    /*
        retrieve order from database, using query transaction to handle transactional behavior of query.
        destructure order from database and return it.
        if error, the catch block will propagate it up the call stack and queryTransaction() will rollback the database to before the query.
    */
    try {
        const { rows: [order] } = await client.query(`
            INSERT INTO orders(orderuserid, orderShipName, orderShipAddress, orderShipAddress2, orderCity, orderState, orderZip, orderEmail, orderShipped, orderTrackingNumber)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
            RETURNING *;
        `, [orderUserId, orderShipName, orderShipAddress, orderShipAddress2, orderCity, orderState, orderZip, orderEmail, orderShipped, orderTrackingNumber]);

        return order;
    } catch (err) {
        // propagate error to api/orders.cjs
        throw err;
    };
};

async function getAllOrdersByUserId(userId) {
    /*
        get order from database by userID.
        if no orders, then return null instead of undefined so value can be checked.
        return array of orders.
    */
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM orders
            WHERE "orderUserID" = $1;
        `, [userId]);

        if (!rows || !rows.length) return null;

        return rows;
    } catch (err) {
        // propagate error to api/orders.cjs
        throw err;
    };
};

async function getOrderByOrderId(orderId) {
    /*
        get array of orders from database by orderID.
        if no orders, then return null instead of undefined so value can be checked.
        destructure single order from array.
        return single order.
    */
    try {
        const { rows } = await client.query(`
            SELECT * 
            FROM orders
            WHERE id = $1
        `, [orderId]);

        if (rows && !rows.length) {
            throw new Error(`OrderNotFoundError: Could not find order: ${orderId}`);
        };

        const [order] = rows;

        return order;
    } catch (err) {
        // propagate error to api/orders.cjs
        throw err;
    };
};


module.exports = {
    getAllOrders,
    createOrder,
    getAllOrdersByUserId,
    getOrderByOrderId
}