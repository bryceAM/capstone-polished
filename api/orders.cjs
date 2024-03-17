const express = require('express');
const ordersRouter = express.Router();
const {
    getAllOrders,
    createOrder,
    getAllOrdersByUserId,
    getOrderByOrderId
} = require('../db/models/orders.cjs');
const { queryTransaction } = require('../db/databaseHelpers.cjs');

ordersRouter.route('/')
    .get(async (req, res, next) => {
        /*
            store all orders queried from database in result array.
            if an empty array [] is returned, throw custom missing order error.
            any other error will be handled naturally when orders returns an error object or promise rejection to result.
        */
        try {
            const result = await getAllOrders();

            if (result.length <= 0) {
                throw new Error('MissingOrdersError: No orders found');
            };

            res.send(result);
        } catch (err) {
            // propagate error up to axios-services
            next(err);
        };
    })
    .post(async (req, res, next) => {
        /*
            destructure order info from the request body.
            store order data in orderData variable for ease of manipulation.
            create new order, storing returned result from database in result.
            if nothing is returned to result, then throw a custom order failed error.
            propagate any error up to axios, whether the custom error or another error from database or database function.
        */
        try {
            const { orderUserID, orderShipName, orderShipAddress, orderShipAddress2, orderCity, orderState, orderZip, orderEmail, orderShipped, orderTrackingNumber } = req.body;
            const orderData = {
                orderUserID: orderUserID,
                orderShipName: orderShipName,
                orderShipAddress: orderShipAddress,
                orderShipAddress2: orderShipAddress2,
                orderCity: orderCity,
                orderState: orderState,
                orderZip: orderZip,
                orderEmail: orderEmail,
                orderShipped: orderShipped,
                orderTrackingNumber: orderTrackingNumber
            };

            const result = await queryTransaction(() => createOrder(orderData));

            if (!result) {
                throw new Error('OrderFailedError: No order created');
            };

            res.send(result);
        } catch (err) {
            // propagate error up to axios-services
            next(err);
        };
    })

ordersRouter.get('/:orderId', async (req, res, next) => {
    try {
        const { orderId } = req.params
        const result = getOrderByOrderId(orderId)

        res.send(result);
    } catch (err) {
        // propagate error up to axios-services
        next(err);
    };
});

module.exports = ordersRouter;