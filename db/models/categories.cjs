const client = require('../client.cjs');
async function createCategory({ categoryName }) {
    /*
        in init_db.js an object with a single camel-cased property name is passed to this function.
        insert the category to be created in the lower-cased categoryname database field.
        return the resulting category data for manipulation later.
        no transactional behavior is necessary, as this function is only called during developement
        to seed the database. if an error occurs, the tables can be dropped and rebuilt for testing.
    */
    try {
        const { rows: [category] } = await client.query(`
            INSERT INTO categories(categoryname)
            VALUES($1)
            RETURNING *;
        `, [categoryName]);

        return category;
    } catch (err) {
        // propagate error to init_db.js
        throw err;
    };
};

module.exports = {
    createCategory
}