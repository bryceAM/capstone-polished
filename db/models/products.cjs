// queried from table 'products'
const client = require('../client.cjs');

async function getAllProducts() {
    try {
        const { rows } = await client.query(`
        SELECT *
        FROM products;
      `);

        return rows;
    } catch (err) {
        // propagate error up to api/products.js
        throw err;
    };
};

module.exports = {
    getAllProducts
};