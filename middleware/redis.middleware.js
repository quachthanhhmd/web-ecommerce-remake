const RedisClient = require("../config/redis");


const homeCache = (req, res, next) => {

    console.log("Key: /");

    RedisClient.get("/", (err, data) => {

        if (err) {
            throw new Error(err);
        }

        if (data !== null) {
            console.log('Cache hit!');
            res.render('pages/home', {
                product: JSON.parse(data) || [],
            });
        } else {
            console.log('Cache miss!');
            next();
        }
    })


}



module.exports = {
    homeCache
}