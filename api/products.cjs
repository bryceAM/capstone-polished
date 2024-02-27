const express = require('express');
const productRouter = express.Router();
const {
    getAllProducts,
    getProductById
} = require('../db/models/products.cjs');

productRouter.use((req, res, next) => {
    console.log('a request is being made to /product');
    next();
});

productRouter.get('/', async (req, res, next) => {
    try {
        const allProducts = await getAllProducts();
        res.send(allProducts);
    } catch (err) {
        // propagate error up to axios-services
        next(err);
    }
});

productRouter.route('/:productId')
    .get(async (req, res, next) => {
        const { productId } = req.params;

        try {
            const product = await getProductById(productId);
            res.send(product);
        } catch (err) {
            // propagate error up to axios-services
            next(err);
        }
    })

module.exports = productRouter;