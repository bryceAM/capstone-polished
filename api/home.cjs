const express = require('express');
const homeRouter = express.Router();
const { getAllProducts } = require('../db/models/products.cjs');

homeRouter.use((req, res, next) => {
    console.log('a request is being made to /home');

    next();
});

homeRouter.get('/', async (req, res, next) => {
    try {
        const allProducts = await getAllProducts();

        res.send(allProducts);
    } catch (err) {
        // propagate error up to axios-services
        next(err);
    };
});

module.exports = homeRouter;