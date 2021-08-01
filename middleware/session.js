
const SESSION_SECRET = process.env.SESSION_SECRET


const ExpressSession = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(ExpressSession);

const session = ExpressSession({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: new MongoDBStore({ uri: process.env.MONGO_URL, collection: 'sessions' }),
    cookie: {
        maxAge: 7 * 86400 * 1000, // a session cookie will last for 7 days

    },

})


module.exports = {
    session
}

