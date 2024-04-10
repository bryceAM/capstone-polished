const client = require('./client.cjs');
const { createCategory } = require('./models/categories.cjs');
const { createProduct } = require('./models/products.cjs');
const { createUser, getAllUsers } = require('./models/users.cjs');
const { createOrder } = require('./models/orders.cjs');
const { createActiveCart, addItemToCart } = require('./models/cart.cjs');

async function buildTables() {
    /*
        drop all tables in specific succession to avoid foreign key constraint violations.
        create all tables in specific succesion to avoid psql errors.

    */
    let drop;
    let build;

    try {
        client.connect();

        console.log('starting dropping tables...');

        drop = await client.query(`
            DROP TABLE IF EXISTS product_to_category;
            DROP TABLE IF EXISTS active_cart_items;
            DROP TABLE IF EXISTS products;
            DROP TABLE IF EXISTS categories;
            DROP TABLE IF EXISTS product_category;
            DROP TABLE IF EXISTS active_cart;
            DROP TABLE IF EXISTS orders;
            DROP TABLE IF EXISTS users;
        `);

        console.log('finished dropping tables.');
        console.log('starting creating tables...');

        build = await client.query(`
            CREATE TABLE users (
                id SERIAL PRIMARY KEY,
                username varchar(255) UNIQUE NOT NULL,
                password varchar(255) UNIQUE NOT NULL,
                salt BYTEA NOT NULL,
                useremail varchar(255) UNIQUE NOT NULL,
                userfirstname varchar(255) UNIQUE NOT NULL,
                userlastname varchar(255) UNIQUE NOT NULL,
                useraddress varchar(255) NOT NULL,
                usercity varchar(255) NOT NULL,
                userstate varchar(255) NOT NULL,
                userzip varchar(255) NOT NULL,
                active BOOLEAN DEFAULT true,
                isadmin BOOLEAN DEFAULT false
            );

            CREATE TABLE categories (
                categoryid SERIAL PRIMARY KEY,
                categoryname VARCHAR(50) UNIQUE NOT NULL
            );

            CREATE TABLE products (
                id SERIAL PRIMARY KEY,
                name varchar(255) UNIQUE NOT NULL,
                description varchar(255) NOT NULL,
                imgurl varchar(255),
                price INTEGER NOT NULl,
                categoryid INTEGER REFERENCES categories(categoryid)
            );

            CREATE TABLE orders (
                id numeric(11, 5) PRIMARY KEY,
                "orderUserID" INTEGER REFERENCES users(id),
                ordershipname varchar(255) NOT NULL,
                ordershipaddress varchar(255) NOT NULL,
                ordershipaddress2 varchar(255),
                ordercity varchar(255) NOT NULL,
                orderstate varchar(255) NOT NULL,
                orderzip INTEGER,
                orderemail varchar(255) NOT NULL,
                ordershipped BOOLEAN DEFAULT false,
                ordertrackingnumber INTEGER,
                orderproducts integer[][]
            );

            CREATE TABLE active_cart (
                id numeric(11, 5) PRIMARY KEY,
                user_id INTEGER REFERENCES users(id)
            );

            CREATE TABLE active_cart_items (
                id SERIAL PRIMARY KEY,
                active_cart_id numeric(11, 5) REFERENCES active_cart(id),
                product_id INTEGER REFERENCES products(id),
                quantity INTEGER
            );
        `);

        console.log('finished creating tables.');
    } catch (err) {
        if (drop && drop.error) {
            err.name = 'DropTablesError';
            err.message = 'failed to drop tables';
        };

        if (build && build.error) {
            err.name = 'BuildTablesError';
            err.message = 'failed to build tables';
        };

        console.log(err);
    };
};

async function populateInitialData() {
    /*
        populate the database tables with initial data
        in order to test the application in development
    */
    try {
        console.log('starting to seed data...');

        async function createInitialCategories() {
            /*
                When map iterates over categoriesToCreate, it first invokes its callback function
                createCategory to become createCategory() and then automatically passes each element
                from the array, which its acting on, as an argument to that callback function.
            */
            try {
                console.log('starting to create categories...');

                const categoriesToCreate = ['Classical','Acoustic','Electric'];
        
                const categories = await Promise.all(
                    categoriesToCreate.map(createCategory)
                );
        
                console.log('categories created:', categories);
                console.log('finished creating categories.');
            } catch (err) {
                throw new Error(`CreateCategoriesError: ${err.message}`);
            };
        };

        async function createInitialProducts() {
            /*
                create all initial products in the database
            */
            try {
                console.log('starting to create products...');

                const productsToCreate = [
                    {
                        name: 'Air Guitar',
                        description: 'Sleek and lightweight design.',
                        imgURL:
                          'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 0,
                        categoryId: 2
                    },
                    {
                        name: 'The Chuck Berry',
                        description: 'Gunny sack not included.',
                        imgURL:
                          'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 599,
                        categoryId: 2
                    },
                    {
                        name: 'Fender Strat',
                        description: 'Made in USA.',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 1500,
                        categoryId: 2
                    },
                    {
                        name: 'Gibson Les Paul',
                        description: 'The OG shredder.',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 2300,
                        categoryId: 2
                    },
                    {
                        name: 'Jackson Dinky',
                        description: 'Smooth playing.',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 666,
                        categoryId: 2
                    },
                    {
                        name: 'FGN Illiad',
                        description: 'Japanese quality at a fraction of the price.',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 599,
                        categoryId: 2
                    },
                    {
                        name: 'B.C. Rich',
                        description: 'The mall ninja of guitars.',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 333,
                        categoryID: 2
                    },
                    {
                        name: 'Harmony Juno',
                        description: 'American made, dual p90s.',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 1100,
                        categoryId: 2
                    },
                    {
                        name: 'Harmony Rocket',
                        description: 'American made, dual p90s.',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 1100,
                        categoryId: 2
                    },
                    {
                        name: 'Epihpone Les Paul',
                        description: 'Pretty much the same but without the name',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 499,
                        categoryId: 2
                    },
                    {
                        name: 'Jackson Flying V',
                        description: 'Not reccomended for actual flight',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 1200,
                        categoryId: 2
                    },
                    {
                        name: 'Fender Acoustisonic',
                        description: 'Who is this for?',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 1300,
                        categoryId: 2
                    },
                    {
                        name: 'Fender HM Strat',
                        description: 'Start for metal or whatever',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 1400,
                        categoryId: 2
                    },
                    {
                        name: 'Taylor 210CE',
                        description: 'Acoustic',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 1100,
                        categoryId: 2
                    },
                    {
                        name: 'Schecter C-1',
                        description: 'Yuh',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 1100,
                        categoryId: 2
                    },
                    {
                        name: 'Gretsch Penguin',
                        description: 'Oh Lawd',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 2300,
                        categoryId: 2
                    },
                    {
                        name: 'EVH Wolgang Standard',
                        description: 'Functional',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 550,
                        categoryId: 2
                    },
                    {
                        name: 'PRS SE Classic',
                        description: 'Paul Reed Smith',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 800,
                        categoryId: 2
                    },
                    {
                        name: 'Fender American Professional',
                        description: 'For the professional american',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 1100,
                        categoryId: 2
                    },
                    {
                        name: 'Fender Telecaster',
                        description: 'Work Horse',
                        imgURL:
                            'https://www.firstbenefits.org/wp-content/uploads/2017/10/placeholder.png',
                        price: 1100,
                        categoryId: 2
                    },
                    {
                        name: 'Martin D28',
                        description: 'Martin.',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 2800,
                        categoryId: 2
                    },
                    {
                        name: 'Alverez RF26',
                        description: 'Affordable',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 250,
                        categoryId: 2
                    },
                    {
                        name: 'Blueridge BR-183',
                        description: 'Historic',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 1700,
                        categoryId: 2
                    },
                    {
                        name: 'Breedlove Oregon CE',
                        description: 'Colorful',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 3000,
                        categoryId: 2
                    },
                    {
                        name: 'Taylor 417 Grand Pacific',
                        description: 'Sings',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 3000,
                        categoryId: 2
                    },
                    {
                        name: 'Fender Precision Bass',
                        description: 'Accurate',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 1100,
                        categoryId: 2
                    },
                    {
                        name: 'Fender Jazz Bass',
                        description: 'Jazzy',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 1100,
                        categoryId: 2
                    },
                    {
                        name: 'Gibson SG',
                        description: 'Thunderstruck',
                        imgURL:
                            'https://media.guitarcenter.com/is/image/MMGS7/L93981000002000-00-720x720.jpg',
                        price: 1100,
                        categoryId: 2
                    }
                ];

                const products = await Promise.all(
                    productsToCreate.map(createProduct)
                );

                console.log('products created:', products);
                console.log('finished creating products.');
            } catch (err) {
                throw new Error(`CreateProductsError: ${err.message}`);
            };
        };

        async function createInitialUsers() {
            /*
                seed the database with some initial users you
                can use to test the database with during
                development
            */
            try {
                console.log('starting to create initial users...');

                const usersToCreate = [
                    {
                        username: 'hendrix123',
                        password: '123guitar',
                        userEmail: 'jimi@hendrix.com',
                        userFirstName: 'Jimi',
                        userLastName: 'Hendrix',
                        userAddress: '1524A Haight St.',
                        userCity: 'Seattle',
                        userState: 'Washington',
                        userZip: '98101'
                    },
                    {
                        username: 'spaceman',
                        password: '123queen',
                        userEmail: 'brian@queen.com',
                        userFirstName: 'Brian',
                        userLastName: 'May',
                        userAddress: 'Oxford St.',
                        userCity: 'London',
                        userState: 'England',
                        userZip: 'E1 7AY'
                    },
                    {
                        username: 'santana',
                        password: 'password123',
                        userEmail: 'carlos@santana.com',
                        userFirstName: 'Carlos',
                        userLastName: 'Santana',
                        userAddress: '2115 Jalisco St.',
                        userCity: 'Jalisco',
                        userState: 'Mexico',
                        userZip: '78954'
                    },
                    {
                        username: 'bob',
                        password: 'bob',
                        userEmail: 'bob@bob.com',
                        userFirstName: 'bob',
                        userLastName: 'bob',
                        userAddress: 'bob St.',
                        userCity: 'bob city',
                        userState: 'bob',
                        userZip: '13013',
                        isAdmin: true
                    }
                ];

                const users = await Promise.all(
                    usersToCreate.map(createUser)
                );

                console.log('users created:', users);
                console.log('finished creating users.');
            } catch (err) {
                throw new Error(`CreateUsersError: ${err.message}`);
            };
        };

        async function createInitialOrders() {
            /*
                creates two orders, where the inner arrays contained by
                orderProducts are individual product bundles where the
                first number is a productId from the database and the
                second number is a quantity.
            */
            try {
                console.log('starting to create initial orders...');

                const ordersToCreate = [
                    {
                        id: 3.189,
                        orderUserId: 3,
                        orderShipName: 'Test Order',
                        orderShipAddress: 'test',
                        orderShipAddress2: '',
                        orderCity: 'test',
                        orderState: 'test',
                        orderZip: 12345,
                        orderEmail: 'test@test.com',
                        orderShipped: true,
                        orderTrackingNumber: 4325,
                        orderProducts: [[1,2],[2,1]]
                    },
                    {
                        id: 2.890,
                        orderUserId: 2,
                        orderShipName: 'Test Order',
                        orderShipAddress: 'test',
                        orderShipAddress2: '',
                        orderCity: 'test',
                        orderState: 'test',
                        orderZip: 32134,
                        orderEmail: 'test',
                        orderShipped: false,
                        orderTrackingNumber: 4326,
                        orderProducts: [[2,1],[3,1]]
                    }
                ];

                const orders = await Promise.all(
                    ordersToCreate.map(createOrder)
                );

                console.log('orders created:', orders);
                console.log('finished creating orders.');
            } catch (err) {
                throw new Error(`CreateOrdersError: ${err.message}`);
            };
        };

        async function createInitialCarts() {
            try {
                console.log('starting to create initial active carts...');

                const users = await getAllUsers();
                let cartsToCreate = [];

                for (let i = 0; i < users.length; i++) {
                    cartsToCreate[i] = users[i].id;
                };

                const carts = await Promise.all(
                    cartsToCreate.map(createActiveCart)
                );

                const cartId = carts[0].id;
                const itemsInCarts = [
                    {
                        cartId: cartId,
                        productId: 1,
                        quantity: 3
                    },
                    {
                        cartId: cartId,
                        productId: 2,
                        quantity: 5,
                    }
                ];
                const items = await Promise.all(
                    itemsInCarts.map(addItemToCart)
                );

                console.log('carts initialized:', carts);
                console.log('items added to carts:', items);
                console.log('finished creating initial active carts.');
            } catch (err) {
                throw new Error(`CreateCartsError: ${err.message}`);
            };
        };

        await createInitialCategories();
        await createInitialProducts();
        await createInitialUsers();
        await createInitialOrders();
        await createInitialCarts();

        console.log('finished seeding data.');
    } catch (err) {
        console.log(err);
    };
};

buildTables()
    .then(populateInitialData)
    .catch(console.error)
    .finally(() => client.end());