
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

const pagingList = (pagExist, end) => {

    var result = "";


    (parseInt(pagExist) !== 1) && (result += `<a value=${parseInt(pagExist) - 1} class="previous-paging">&laquo;</a>`);


    for (let i = 0; i < 5; i++) {
        if (pagExist < 3) {
            result += `<a class="page-paging${(i + 1) === parseInt(pagExist) ? " active" : ''}" value="${i + 1}">${1 + i}</a>`
        }
        else
            if (pagExist > end - 2) {
                result += `<a class="page-paging${(end - 4 + i) === parseInt(pagExist) ? " active" : ''}" value="${end - 4 + i}">${end - 4 + i}</a>`
            }
            else {
                result += `<a class="page-paging${(parseInt(pagExist) - 2 + i) === parseInt(pagExist) ? " active" : ''}" value="${parseInt(pagExist) - 2 + i}">${parseInt(pagExist) - 2 + i}</a>`
            }
    }
    (parseInt(pagExist) !== end) && (result += `<a value=${parseInt(pagExist) - 1} class="previous-paging">&raquo;;</a>`);

    return result;
}


module.exports = {
    incremented,
    dateFormat,
    times,
    select,
    renderStar,
    tableDetails,
    checkEmptyString,
    pagingList
}