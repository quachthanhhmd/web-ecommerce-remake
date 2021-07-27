
/**
 * parse int to price 
 * @param {string} strPrice : String price
 * @return {int} price
 */
module.exports.parsePrice = (strPrice) => {
    return parseInt(strPrice.replace(/[\.dđ]/g, ""));
};


/**
 * parse int to price 
 * @param {int} price : price (number)
 * @return {string} string price
 */
module.exports.parseIntToPrice = (Int) => {

    var price = Int.split('').reverse().reduce((prev, next, index) => {
        return ((index % 3) ? next : (next + '.')) + prev
    })

    return price + 'đ';
}
