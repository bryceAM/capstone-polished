const client = require('../client.cjs');
const { queryTransaction } = require('../databaseHelpers.cjs');
async function createCategory({ categoryName }) {
    /*
        in init_db.js an object with a single camel-cased property name is passed to this function.
        insert the category to be created in the lower-cased categoryname database field.
        return the resulting category data for manipulation later.
    */
    try {
        const category = await queryTransaction(
            async (client) => {
                const { rows: [categoryFromDB] } = await client.query(`
                    INSERT INTO categories(categoryname)
                    VALUES($1)
                    RETURNING *;
                `, [categoryName]);
    
                return categoryFromDB;
            }
        );

        return category;
    } catch (err) {
        // propagate error to init_db.js
        throw err;
    };
};

module.exports = {
    createCategory
}