const express = require('express');
const usersRouter = express.Router();
const jwt = require('jsonwebtoken');
const { JWT_SECRET = 'who knows' } = process.env;
const {
    createUser,
    getUserByUsername,
    getUser,
    getAllUsers
} = require('../db/models/users.cjs');
const { queryTransaction } = require('../db/databaseHelpers.cjs');
const { getAllOrdersByUserID } = require('../db/models/orders.cjs');

usersRouter.post('/login', async (req, res, next) => {
    /*
        destructure username and password from the request body.
        if username or password don't exist, throw an error.
        if user cannot be found, throw an error.
        if no error, sign a token.
        send back the fetched user, a login message, and the signed token in the response.
    */
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            throw new Error('MissingCredentialsError: You need both a username and password to login');
        };

        const user = await getUser({ username, password });

        if (!user) {
            throw new Error('InvalidCredentialsError: Username or password is incorrect');
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1w' }
        );

        res.send({ user, message: 'logged in!', token });
    } catch (err) {
        // propagate the error up to axios-services
        next(err);
    };
});

usersRouter.post('/register', async (req, res, next) => {
    /*
        destructure register-form submitted data from the request body.
        check if the user trying to be created already exists.
        if exists, throw error.
        if the password is too short, throw error.
        create the user with the submitted data.
        if the user object is null or undefined after creation, throw error.
        sign a new token upon successful user creation.
        send the user, message, and signed token back in the response to the calling function.
    */
    try {
        const { username, password, userEmail, userFirstName, userLastName, userAddress, userAddress2, userCity, userState, userZip } = req.body;

        const userExists = await getUserByUsername(username);

        if (userExists) {
            res.status(401);
            throw new Error('UserExistsError: A user by that name already exists');
        };

        if (password.length < 6) throw new Error('PasswordLengthError: Password needs to be at least 6 characters');

        const user = await queryTransaction(() => createUser({
            username, password, userEmail, userFirstName, userLastName, userAddress, userAddress2, userCity, userState, userZip
        }));

        if (!user) throw new Error('UserCreationError: Unable to create user');

        const token = jwt.sign(
            { id: user.id, username: user.username },
            JWT_SECRET,
            { expiresIn: '1w' }
        );

        res.send({ user, message: "new user registered!", token })
    } catch (err) {
        // propagate error up to axios-services
        next(err);
    };
});

usersRouter.get("/:username/orders", async (req, res, next) => {
    /*
        destructure the username from the params.
        retrieve the user associated with the username.
        if the user does not exist, throw error.
        if there is no user in the request or the user id from params doesn't match the user id of the request, throw error.
        if there is a user in the request and the user id from params matches the user id of the request, retrieve all of the user's orders.
        send the array of order objects in the response to the calling function.
    */
    try {
        const { username } = req.params;
        const user = await getUserByUsername(username);

        if (!user) {
            throw new Error(`NoUserError: Could not find user: ${username}`);
        };
        
        if(user.id === req.user.id) {
            const orders = await getAllOrdersByUserID(user.id);
            
            res.send(orders);
        } else {
            throw new Error('UnauthorizedAccessError: Not authorized to view content');
        };

    } catch (err) {
        // propagate error up to axios-services
        next(err);
    };
});

usersRouter.get('/token/:token', async (req, res, next) => {
    /*
        destructure the token from the params.
        return the user to result if verification is successful.
        send certain user info back in the response.
    */
    const { token } = req.params;

    try {
        const result = jwt.verify(token, JWT_SECRET);

        res.send(result);
    } catch (err) {
        // propagate error up to axios-services
        next(err);
    };
});

usersRouter.get('/me', async (req, res, next) => {
    try {
        res.send(req.user);
    } catch (err) {
        // propagate error up to axios-services
        next(err);
    };
});

usersRouter.get('/', async (req, res, next) => {
    /*
        retrieve all users from the database.
        send an array of all user objects back in the response.
    */
    try {
        const allUsers = await getAllUsers();

        res.send(allUsers);
    } catch (err) {
        // propagate error up to axios-services
        next(err);
    };
});

usersRouter.get('/:username', async (req, res, next) => {
    const { username } = req.params;

    try {
        const result = await getUserByUsername(username);

        delete result.password;

        res.send(result);
    } catch (err) {
        // propagate error up to axios-services
        next(err);
    };
});

module.exports = usersRouter;