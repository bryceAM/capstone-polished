
const apiRouter = require('express').Router();

apiRouter.get('/', (req, res, next) => {
  res.send({
    message: 'API is under construction!',
  });
});

const homeRouter = require('./home.cjs');
apiRouter.use('/', homeRouter);

const productsRouter = require('./products.cjs');
apiRouter.use('/products', productsRouter);

const usersRouter = require('./users.cjs');
apiRouter.use('/users', usersRouter);

const ordersRouter = require('./orders.cjs');
apiRouter.use('/orders', ordersRouter);

const cartRouter = require('./cart.cjs');
apiRouter.use('/cart', cartRouter);

module.exports = apiRouter;
