const client = require('../client.cjs');

async function createProduct({ name, description, imgURL, price, categoryId }) {
    /*
        create a new product in the database.
        if the product already exists, do nothing.
        on error, rollback the database before the creation of the product (see queryTransaction()).
        if no error, store the newly-created product info in a variable.
        return that product for manipulation and testing purposes.
    */
    try {

        const { rows: [product] } = await client.query(`
            INSERT INTO products(name, description, imgurl, price, categoryid) 
            VALUES($1, $2, $3, $4, $5) 
            ON CONFLICT (name) DO NOTHING 
            RETURNING *;
        `, [name, description, imgURL, price, categoryId]);

        return product;
    } catch (err) {
        // propagate error up to api/products.cjs
        throw err;
    };
};

async function getAllProducts() {
    /*
        retrieve all products from database.
        if no products are found, throw error.
        return array of product objects.
    */
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM products;
        `);

        if (!rows || rows.length <= 0) {
            throw new Error('ProductsNotFoundError: Could not find products')
        };

        return rows;
    } catch (err) {
        // propagate error up to api/products.cjs
        throw err;
    };
};

/*
// under construction:
async function removeProduct(id) {
    const users = await getAllUsers();
    // under construction: have to add curUser variable that stores user info upon login
    const user = users.filter((entry) => entry.username == curUser.username);

    if (user.isAdmin) {
        try {
            const {
                rows: [product],
            } = await client.query(`
          delete from products
          where products.id=$1
          returning *;
        `, [id]);

            // should return the deleted object
            return product;
        } catch (error) {
            throw error;
        }
    } else {
        return {
            name: `InvalidAuthorizationError`,
            message: 'This account lacks administrative privilege',
        };
    };
};
*/

async function getProductById(productId) {
    /*
        retrieve a single product from the database with productId.
        if there is no such product, throw error.
        return the product if no error.
    */
    try {
        const { rows: [product] } = await client.query(`
            SELECT *
            FROM products
            WHERE id = $1;
        `, [productId]);

        if (!product) {
            throw new Error(`ProductNotFoundError: Could not find product: ${productId}`);
        };

        return product;
    } catch (err) {
        // propagate error to api/products.cjs
        throw err;
    };
};

async function updateProduct({ id, ...fields }) {
    /*
        create a setString to use for a query.
        if setString is empty, it means the fields to be updated were empty, so exit the function without doing anything.
        if setString is not empty, update products in the database with the relevant fields contained within setString.
        if an error occurs, this transactional query update will be rolled back.
        if no error occurs, return the updated data for manipulation and testing purposes.
    */
    const setString = Object.keys(fields)
        // removed the double quotes around the key, so postgres will treat the key names more forgivingly
        // .map((key, index) => `"${key}"=$${index + 1}`)
        .map((key, index) => `${key}=$${index + 1}`)
        .join(',');

    if (setString.length === 0) {
        return;
    };

    try {
        const { rows } = await client.query(`
            UPDATE products
            SET ${setString}
            WERE id=$${Object.keys(fields).length + 1}
            RETURNING *;
        `, [...Object.values(fields), id]);

        return rows;
    } catch (err) {
        // propagate error to api/products.cjs
        throw err;
    };
};

module.exports = {
    getAllProducts,
    getProductById,
    updateProduct,
    createProduct,
    // removeProduct
};