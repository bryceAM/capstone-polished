const express = require('express');
const productsRouter = express.Router();
const {
    getAllProducts,
    getProductById,
    updateProduct
} = require('../db/models/products.cjs');
const {
    queryTransaction
} = require('../db/databaseHelpers.cjs');

productsRouter.use((req, res, next) => {
    console.log('a request is being made to /product');
    next();
});

productsRouter.route('/')
    .post(async (req, res, next) => {
        /*
            this post request is for admin purposes.
            destructure new product info from request body.
            create the product with the new product info.
            if there is an error, result will be set to the error object and we test this by seeing if result has an error message.
            if no error, send back the newly created product info in the reponse.
        */
        try {
            const { name, description, imgURL, price, categoryID } = req.body;
            const result = await queryTransaction(() => createProduct({ name, description, imgURL, price, categoryID }));

            res.send(result);
        } catch (err) {
            // propagate error up to axios-services
            next(err);
        };
    })
    .get(async (req, res, next) => {
        /*
            get all products from the database.
            send all products to the calling function in the response.
        */
        try {
            const allProducts = await getAllProducts();
            
            res.send(allProducts);
        } catch (err) {
            // propagate error up to axios-services
            next(err);
        };
    })

productsRouter.route('/:productId')
    .get(async (req, res, next) => {
        /*
            destructure productId from the params of the route.
            get product from the database by the product's ID.
            send product to the calling function in the response.
        */
        const { productId } = req.params;

        try {
            const result = await getProductById(productId);
            
            res.send(result);
        } catch (err) {
            // propagate error up to axios-services
            next(err);
        };
    })
    .patch(async (req, res, next) => {
        /*
            destructure productId from the params of the route.
            filter out all properties of the update object received from the request body that don't have values.
            create a properly-formatted update object for manipulation.
            update the product with the new update object.
        */
        try {
            const { productId } = req.params;
            const validUpdates = Object.entries(req.body).filter(([key, value]) => (key === 'name' || key === 'description' || key === 'price' || key === 'categoryID') && value);
            const updatedFields = Object.fromEntries(validUpdates);
            
            updatedFields.id = productId;
    
            const result = await queryTransaction(() => updateProduct(updatedFields));
    
            res.send(result);
        } catch (err) {
            // propagate error up to axios-services
            next(err);
        }
    })
    .delete(async (req, res, next) => {
        /*
            destructure productId from the params of the route.
            remove the product with said ID from the database.
            send back in the response any info about the product just removed.
        */
        try {
            const { productId } = req.params;
            const result = await queryTransaction(() => removeProduct(productId));
    
            res.send(result);
        } catch (err) {
            // propagate error up to axios-services
            next(err);
        }
    })

module.exports = productsRouter;