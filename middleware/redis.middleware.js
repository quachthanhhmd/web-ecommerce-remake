const RedisClient = require("../config/redis");


/**
 * Global search cache middleware
 */
const searchCache = (req, res, next) => {
    // Query string
    const { producer, type, query, device } = req.query;
    var page = parseInt(req.query.page) || 1;


    if (page < 1) page = 1;

    // Cache key
    const key =
        (producer ? producer : '') +
        (type ? type : '') +
        (query ? query : '') +
        (device ? device : '') + page;
    console.log('Cache key:' + key);

    RedisClient.get(key, (error, data) => {
        if (error) {
            console.log(error);
            return res.render('error', {
                message: error.message,
                error,
            });
        }


        if (data != null) {

            console.log('Cache hit!');
            data = JSON.parse(data);
            res.render('pages/shop', {
                title: 'Shop',
                products: data.data,
                maxPage: data.maxPage,
                page: data.page
            });
        } else {
            console.log('Cache miss!');
            next();
        }
    });
};


const getResourceMiddleware = () => {

    const key = "ResourcesAndBrands";

    RedisClient.get(key, (error, data) => {
        if (error) {
            console.log(error);
            return error;
        }


        if (data != null) {

            console.log('Cache hit!');
            data = JSON.parse(data);

            return data;

        } else {
            console.log('Cache miss!');

            return data;
        }
    });
}


module.exports = {
    searchCache,
    getResourceMiddleware
}