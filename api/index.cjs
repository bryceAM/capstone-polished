
const apiRouter = require('express').Router();

apiRouter.get('/', (req, res, next) => {
  res.send({
    message: 'API is under construction!',
  });
});

// this makes all of the calls to the module /api/products.js to use the /api/products/ route
// for example, from cURLs, Postman, or 3rd party apps using our api
const productRouter = require('./products.cjs');
apiRouter.use('/products', productRouter);

module.exports = apiRouter;
