// queried from table 'products'
const client = require('../client.cjs');

async function getAllProducts() {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM products;
      `);

      // error-first handling
      if (!rows) {
        throw new Error('ProductsNotFoundError: Could not find products')
      }
      
      // return rows if no error
      return rows;
    } catch (err) {
        // propagate error up to api/products.cjs
        throw err;
    };
};

async function getProductById(productId) {
    try {
        // should return array with only a single product
        const { rows: [product] } = await client.query(`
            SELECT *
            FROM products
            WHERE id=$1;
        `, [productId]);

        // error-first handling
        if (!product) {
            throw new Error('ProductNotFoundError: Could not find a product with that productId');
        };

        // return product if no error
        return product;
    } catch (err) {
        // propagate error to api/products.cjs
        throw err;
    }
};

module.exports = {
    getAllProducts,
    getProductById
};