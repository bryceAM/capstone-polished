const client = require('../client.cjs');
const { queryTransaction } = require('../databaseHelpers.cjs');

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
    orderUserID,
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
        const order = await queryTransaction(
            async (client) => {
                const { rows: [orderFromDB] } = await client.query(`
                    INSERT INTO orders("orderUserID", orderShipName, orderShipAddress, orderShipAddress2, orderCity, orderState, orderZip, orderEmail, orderShipped, orderTrackingNumber)
                    VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
                    RETURNING *;
                `, [orderUserID, orderShipName, orderShipAddress, orderShipAddress2, orderCity, orderState, orderZip, orderEmail, orderShipped, orderTrackingNumber]);

                return orderFromDB;
            }
        );

        return order;
    } catch (err) {
        // propagate error to api/orders.cjs
        throw err;
    };
};

async function getAllOrdersByUserID(userID) {
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
        `, [userID]);

        if (!rows || !rows.length) return null;

        return rows;
    } catch (error) {
        // propagate error to api/orders.cjs
        throw err;
    };
};

async function getOrderByOrderID(orderID) {
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
      `, [orderID]);

        if (!rows || !rows.length) return null;
        
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
    getAllOrdersByUserID,
    getOrderByOrderID
}