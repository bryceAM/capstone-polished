const client = require('../client.cjs');
const { randomBytes } = require('crypto')
const { hashPassword } = require('../databaseHelpers.cjs');
const SALT_COUNT = 10;

// destructure user info from user object sent via a register form submission
async function createUser({
    username,
    password,
    userEmail,
    userFirstName,
    userLastName,
    userLocation,
    isAdmin
}) {
    /*
        create and store a user in the database.
        do nothing on username conflict.
        if error, rollback database change of query transaction via queryTransaction()'s transactional handling.
    */
    try {
        const salt = randomBytes(SALT_COUNT);
        const hashedPassword = await hashPassword(password, salt, 64);
        const encodedHashedPassword = hashedPassword.toString('base64');

        const { rows: [user] } = await client.query(`
            INSERT INTO users(username, password, salt, userEmail, userFirstName, userLastName, userLocation, isAdmin)
            VALUES($1, $2, $3, $4, $5, $6, $7, $8)
            ON CONFLICT (username) DO NOTHING
            RETURNING *;
        `, [username, encodedHashedPassword, salt, userEmail, userFirstName, userLastName, userLocation, isAdmin])

        return user;
    } catch (err) {
        /*
            whether hashing fails or database seeding fails, both result in unsuccessful user creation, albeit different messages
            propagate error up to db/databaseHelpers.cjs, and db/init_db.cjs or api/users.cjs
        */
        throw new Error('Failed to create user:', err.message);
    };
};

async function getUserByUsername(username) {
    /*
        get user by username from the database.
        if no data on user, throw error, ending function early to save time.
    */
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM users
            WHERE username = $1;
        `, [username]);

        if (!rows || !rows.length) {
            throw new Error('UserNotFoundError: Could not find a user with those credentials')
        };

        const [user] = rows;

        return user;
    } catch (err) {
        // propagate error up to db/models/users.cjs's getUser() or api/users.cjs
        throw err;
    };
};

async function getUser({ username, password }) {
    /*
        get a user from the database.
        decode user's password from database with base64.
        compare login password with password from database, using Buffer.equals() to compare primitive values instead of reference.
        if the passwords are not a match, then exit the function by returning implicit undefined.
        delete password from the user object to return the user info securely.
    */
    if (!username || !password) return;

    try {
        const user = await getUserByUsername(username);
        const hashedPassword = await hashPassword(password, user.salt, 64);
        const hashedPasswordFromDB = Buffer.from(user.password, 'base64');
        const passwordsMatch = hashedPassword.equals(hashedPasswordFromDB);

        if (!passwordsMatch) return;
        delete user.password;

        return user;
    } catch (err) {
        // propagate error up to api/users.cjs
        throw err;
    };
};

async function getAllUsers() {
    /*
        query all users from the database, storing the user objects in an array.
    */
    try {
        const { rows } = await client.query(`
            SELECT *
            FROM users;
        `);

        return rows;
    } catch (err) {
        // propagate error up to db/init_db.cjs, api/users.cjs, or db/models/products.cjs
        throw err
    };
};

module.exports = {
    createUser,
    getUserByUsername,
    getUser,
    getAllUsers
}