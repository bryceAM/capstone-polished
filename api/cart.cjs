const express = require("express");
const cartRouter = express.Router();
const {
    getAllItemsInCart,
    getActiveCart,
    createActiveCart,
    addItemToCart,
    removeItemFromCart,
    updateQuantity,
    emptyCart
} = require("../db/models/cart.cjs");
const { queryTransaction } = require('../db/databaseHelpers.cjs');

cartRouter.route('/owner/:userId')
    .get(async (req, res, next) => {
        /*
            get the active cart of the user with the specified userId.
            there will only be one active cart at most for each person, so no need to use cartId.
        */
        const { userId } = req.params;

        try {
            const result = await getActiveCart(userId);

            res.send(result);
        } catch (err) {
            // propagate error up to axios-services
            next(err);
        };
    })
    .post(async (req, res, next) => {
        /*
            create a transactionId from the userId and a random decimal number.
            assign this transactionId to the id of the active cart.
            later this active cart will be added to the orders table in the database with this transactionId as the primary key of the orderId.
        */
        const { userId } = req.params;
        const transactionId = (Math.floor(Math.random() * 100000)) / 100000;
        const cartId = userId + transactionId;

        try {
            const result = await queryTransaction(() => createActiveCart(cartId));

            res.send(result);
        } catch (err) {
            // propagate error up to axios-services
            next(err);
        };
    });

cartRouter.delete('/remove/:itemId', async (req, res, next) => {
    /*
        removes all items, regardless of quantity, of id itemId from the active cart.
    */
    const { itemId } = req.params;

    try {
        const result = await queryTransaction(() => removeItemFromCart(itemId));

        res.send(result);
    } catch (err) {
        // propagate error up to axios-services
        next(err);
    };
});

cartRouter.route('/:cartId')
    .get(async (req, res, next) => {
        /*
            this will fire when an admin wants to see the items in someone's active cart.
            this will also fire when getActiveCart(userId) is called and the active cart object is returned, the active cart id destructured, and passed to this route to bring up the current user's active cart items.
        */
        const { cartId } = req.params;

        try {
            const result = await getAllItemsInCart(cartId)

            res.send(result)
        } catch (err) {
            // propagate error up to axios-services
            next(err);
        };
    })
    .post(async (req, res, next) => {
        /*
            add a product of specified quantity to the cart with the specified cartId.
        */
        const { cartId } = req.params;
        const { productId, quantity } = req.body;

        try {
            const result = await queryTransaction(() => addItemToCart(productId, cartId, quantity));

            res.send(result)
        } catch (err) {
            // propagate error up to axios-services
            next(err);
        };
    })
    .put(async (req, res, next) => {
        /*
            destructure the cartId and productId from params and body, respectively.
            update the quantity of the specified product in the specified cart.
            this will fire any time someone clicks to add a quantity of a certain product when said product is already in the active cart.
        */
        const { cartId } = req.params;
        const { productId, quantity } = req.body;

        try {
            const result = await queryTransaction(() => updateQuantity(productId, cartId, quantity));

            res.send(result);
        } catch (err) {
            // propagate error up to axios-services
            next(err)
        }
    })
    .delete(async (req, res, next) => {
        /*
            empty the contents of the cart with the specified cartId.
            this will fire primarily when an order is placed and the active cart is refreshed.
        */
        const { cartId } = req.params;

        try {
            const result = await emptyCart(cartId);

            res.send(result);
        } catch (err) {
            // propagate error up to axios-services
            next(err);
        };
    });