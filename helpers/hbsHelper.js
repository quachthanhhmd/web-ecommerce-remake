
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

const renderStar = (rate) => {

    let modelStar = '';

    for (let i = 0; i < 5; i++) {
        const checked = (--rate > 0) ? " checked" : '';

        modelStar += `<span class="fa fa-star${checked}"></span>`
    }

    return modelStar;
}

const tableDetails = (productDetails) => {

    var result = '';
    let i = 0;
    for (const detail in productDetails) {
        result += `<div class="spec-product">
                        <div class="spec-product-item${(i % 2 === 1) ? " detail-check" : ''}">
                            <div class="spec-title">
                                <b>${detail}</b>
                            </div>
                            <div>
                                ${productDetails[detail]}
                            </div>

                        </div>
                    </div>`;
        i++;
    }

    return result;
}

const checkEmptyString = (str, content) => {

    return (str === "") ? content : str;
}


module.exports = {
    incremented,
    dateFormat,
    times,
    select,
    renderStar,
    tableDetails,
    checkEmptyString
}