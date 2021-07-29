
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


    (parseInt(pagExist) !== 1) && (result += `<a value=${parseInt(pagExist) - 1} class="page-paging">&laquo;</a>`);

    if (pagExist > 3) {
        result += `<a class="page-paging value="1">${1}</a>`;

        (pagExist != 4) && (result += `<a class="page-paging">...</a>`);
    }


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

    if (pagExist < end - 2) {
        (pagExist != end - 3) && (result += `<a class="page-paging">...</a>`);;
        result += `<a class="page-paging" value=${end}>${end}</a>`;
    }
    (parseInt(pagExist) !== end) && (result += `<a value=${parseInt(pagExist) + 1} class="page-paging">&raquo;;</a>`);

    return result;
}

/**
 * Create slider in product details
 * @param {int} productImages: array images need to use slider
 * @param {int} productPerPage: a mount of product per slider
 * @param {String} style: class name of iamge display
 * @return {string} string of html slider 
*/
const imageSlider = (productImages, productPerPage, style) => {

    var result = "";
    var existPage = 0;
    for (let i = 0; i < productImages.length - productPerPage + 1; i++) {


        result += (i === 0) ? `<div class="item active">` : `<div class="item">`;

        for (let j = existPage; j < productPerPage + existPage; j++) {
            result += `<a href=""><img src=${productImages[j]} alt=""
            class="${style}"></a>`
        }
        existPage++;
        result += "</div>"
    }

    return result;
}


const productSellingSlider = (products, productPerPage) => {

    var result = "";
    var existPage = 0;

    const n = Math.ceil(products.length / productPerPage);

    for (let i = 0; i < n; i++) {


        result += (i === 0) ? `<div class="item active">` : `<div class="item">`;
        let productAtPage = (productPerPage + existPage < products.length) ? productPerPage + existPage : products.length;
        for (let j = existPage; j < productAtPage; j++) {
            result += ` 
            <div class="col-sm-4">
                <div class="product-image-wrapper">
                    <div class="single-products">
                        <div class="productinfo text-center">
                            <img src="${products[j].images[0]}" alt="" width="255.48"
                                height="255.48" />
                            <h2>${products[j].price}</h2>
                            <div class="product-name">
                                <p>${products[j].name}</p>
                            </div>

                            <a href="/product-details/${products[j].slugName}"
                                class="btn btn-default details"><i
                                    class="fa fa-search-minus"></i>Chi tiết</a>

                            <a href="#" class="btn btn-default add-to-cart"
                                value="${products[j].slugName}"><i class="fa fa-shopping-cart"></i>Thêm
                                vào giỏ</a>
                        </div>
                    </div>
                </div>
            </div>`
        }
        existPage += productPerPage;
        result += "</div>"
    }

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
    pagingList,
    imageSlider,
    productSellingSlider
}