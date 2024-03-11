const client = require('../client.cjs');
const { queryTransaction } = require('../databaseHelpers.cjs');


async function createProduct({ name, description, imgURL, price, categoryID }) {
    /*
        create a new product in the database.
        if the product already exists, do nothing.
        on error, rollback the database before the creation of the product.
        if no error, store the newly-created product info in a variable.
        return that product for manipulation and testing purposes.
    */
    try {
        const product = await queryTransaction(
            async (client) => {
                const { rows: [productFromDB] } = await client.query(`
                    INSERT INTO products(name, description, imgURL, price, "categoryId") 
                    VALUES($1, $2, $3, $4, $5) 
                    ON CONFLICT (name) DO NOTHING 
                    RETURNING *;
                `, [name, description, imgURL, price, categoryID]);

                return productFromDB;
            }
        );

        return product;
    } catch (error) {
        // propagate error up to api/products.cjs
        throw error;
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

        if (!rows) {
            throw new Error('ProductsNotFoundError: Could not find products')
        }

        return rows;
    } catch (err) {
        // propagate error up to api/products.cjs
        throw err;
    };
};

/*
// under construction:
async function addProduct({ name, description, imgURL, price, categoryID }) {
  const users = await User.getAllUsers();
  // under construction: have to add curUser variable that stores user info upon login
  const user = users.filter((entry) => entry.username == curUser.username);

  if (user.isAdmin) {
    try {
      const result = await createProduct({
        name,
        description,
        imgURL,
        price,
        categoryID,
      });

      return result;
    } catch (error) {
      throw error;
    }
  } else {
    // return an error object to use in the front end to display the error message
    return {
      name: `InvalidAuthorizationError`,
      message: 'This account lacks administrative privilege',
    };
  };
};
*/

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
            WHERE id=$1;
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
        .map((key, index) => `"${key}"=$${index + 1}`)
        .join(',');

    if (setString.length === 0) {
        return;
    };

    try {
        const updates = await queryTransaction(
            async (client) => {
                const { rows } = await client.query(`
                    UPDATE products
                    SET ${setString}
                    WERE id=${id}
                    RETURNING *;
                `, Object.values(fields));

                return rows;
            }
        );

        return updates;
    } catch (err) {
        // propagate error to api/products.cjs
        throw err;
    };
};

module.exports = {
    getAllProducts,
    getProductById,
    updateProduct,
    createProduct
};