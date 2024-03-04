const client = require('./client.cjs');
const { scrypt } = require('crypto')

async function hashPassword(password, salt, keyLength = 64) {
    /*
        helper function to hash passwords for secure storage and comparison to entered user credentials on login.
        if error, send error object back through promise rejection.
        if no error, send resolved promise back.
        return the hashed password, automatically destructured from the Promise.
    */
    try {
        const hashedPassword = await new Promise((resolve, reject) => {
            scrypt(password, salt, keyLength, (err, derivedKey) => {

                if (err) {
                    err.message = 'Failed to hash password';
                    reject(err);
                }

                resolve(derivedKey);
            });
        });

        return hashedPassword;
    } catch (err) {
        // propagate the error up to the db/models/users.cjs functions using it
        throw err;
    };
};

async function queryTransaction(queryFunction) {
    /*
        this is a helper function that accepts a query function.
        begin a query transaction with BEGIN keyword.
        call the query function passed to this helper function that should handle the meat of the query.
        end the query with the COMMIT keyword.
        return the result if successful.
    */
    try {
        await client.query(`BEGIN;`);
        const result = await queryFunction(client);
        await client.query(`COMMIT;`);

        return result;
    } catch (error) {
        // roll the database back before throwing the error if the query function call made an unsuccessful query
        await client.query(`ROLLBACK;`);
        throw error;
    };
};

module.exports = {
    hashPassword,
    queryTransaction
}