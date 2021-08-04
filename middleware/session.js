
const SESSION_SECRET = process.env.SESSION_SECRET

const ExpressSession = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(ExpressSession);
const redisStore = require('connect-redis')(ExpressSession);

const client = require('../config/redis');

const session = ExpressSession({
    secret: SESSION_SECRET,
    resave: true,
    autoSave: true,
    saveUninitialized: true,
    store: new redisStore({ client: client }),
    cookie: {
        maxAge: 7 * 86400 * 1000, // a session cookie will last for 7 days

    },

})


module.exports = {
    session
}

