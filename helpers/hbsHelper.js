
const select = (selected, options) => {
    return options.fn(this).replace(
        new RegExp(' value=\"' + selected + '\"'),
        '$& selected="selected"');
}

const times = (n, block) => {
    var accum = '';
    for (var i = 0; i < n; ++i)
        accum += block.fn(i);
    return accum;
}

const dateFormat = () => {
    require('handlebars-dateformat');
}

const incremented = (index) => {
    index++;
    return index;
}

module.exports = {
    incremented,
    dateFormat,
    times,
    select
}