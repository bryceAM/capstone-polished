const express = require('express');
const productRouter = express.Router();
const { getAllProducts } = require('../db/models/products.cjs')

productRouter.use((req, res, next) => {
    console.log('a request is being made to /product');
    next();
});

productRouter.get('/', async (req, res, next) => {
    try {
        const allProducts = await getAllProducts();
        res.send(allProducts);
    } catch (err) {
        console.error(err);
        next();
    }
});

module.exports = productRouter;