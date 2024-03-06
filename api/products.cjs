const express = require('express');
const productsRouter = express.Router();
const {
    getAllProducts,
    getProductById,
    updateProduct
} = require('../db/models/products.cjs');

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
            const result = await createProduct({ name, description, imgURL, price, categoryID });

            if (result.message) {
                throw new Error(`${result.name}: ${result.message}`);
            }

            res.send({ name: name, description: description, price: price, categoryID: categoryID });
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
        const { productId } = req.params;

        try {
            const product = await getProductById(productId);
            
            res.send(product);
        } catch (err) {
            // propagate error up to axios-services
            next(err);
        };
    })
    .patch(async (req, res, next) => {
        const { productId } = req.params;
        const validUpdates = Object.entries(req.body).filter(([key, value]) => (key === 'name' || key === 'description' || key === 'price' || key === 'categoryID') && value);
        const updatedFields = Object.fromEntries(validUpdates);
        
        updatedFields.id = productId;

        // pass the updated product object into updateProduct() function
        const result = await updateProduct(updatedFields);

        if (result.message) {
            // handle the error message if the user is not an admin or if there was another error
            next({ name: result.name, message: result.message });
        } else {
            // send back an object containing the result if no error messages
            res.send({ name: result.name, description: result.description, price: result.price, categoryID: result.categoryID });
        }
    })
    .delete(async (req, res, next) => {
        const { productId } = req.params;
        const result = await Products.removeProduct(productId);

        if (result.message) {
            // handle the error message if the user is not an admin or if there was another error
            next({ name: result.name, message: result.message });
        } else {
            // send back an object containing the result if no error messages
            res.send({ name: result.name, description: result.description, price: result.price, categoryID: result.categoryID });
        }
    })

module.exports = productsRouter;