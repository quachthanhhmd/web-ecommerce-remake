
//Model for checkout
const modalCheckout = (data) => {

  const bodyModal = data.data.items.map((item, index) => {
    return `
        <tr>
          <td>
            ${index + 1}
          </td>
          <td>
            <div class="img d-flex align-items-center">
              <a href="/products/${item.slugName}"
                ><img style="width: 45px; height: auto;" src="${item.thumbnail
      }" alt="Image"
              /></a>
              <p class="m-0">${item.name}</p>
            </div>
          </td>
          <td>${item.price}</td>
          <td>
            ${item.quantity}
          </td>
          <td>${item.total}</td>
        </tr>
      `;
  }).join("");

  return `
    <div class="modal-dialog modal-dialog-centered modal-lg" role="document">
        <div class="modal-content">
          <div class="modal-header" style="background-color: honeydew;">
            <h5 class="modal-title" id="exampleModalLongTitle">
              Purchase information
            </h5>
            <button
              type="button"
              class="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <span><b>Receiver:</b>&nbsp;${data.data.receiver}&nbsp;&nbsp;<br> <b>Phone: </b> 
              ${data.data.phone} <br>
              <b>Payment methods:</b>
              <strong>&nbsp;${data.data.paymentMethod.toUpperCase()}
              </strong><br>
              <b>Adress: </b>&nbsp;${data.data.address} </span>
            </div>
            <div class="table-responsive">
              <table class="table table-bordered">
                <thead class="thead-dark">
                  <tr>
                    <th>STT</th>
                    <th>Sản phẩm</th>
                    <th>Giá</th>
                    <th>Số lượng</th>
                    <th>Tổng tiền</th>
                  </tr>
                </thead>
                <tbody class="align-middle" id="cart">
                ${bodyModal}
                  <tr>
                    <td>
                      Sum
                    </td>
                    <td>
                    </td>
                    <td>
                    </td>
                    <td>
                      ${data.data.totalQuantity}
                    </td>
                    <td>${data.data.totalPayment}</td>
                  </tr>
                </tbody>
              </table>
              </div>
              <div class="modal-footer">
                <button
                  type="button"
                  class="btn btn-secondary"
                  data-dismiss="modal"
                  >
                Đóng
                </button>
              </div>
            </div>
          </div>`;
};


//model for comment
const modelComment = (data) => {

  const checked = (rate) => {
    let modelStar = '';

    for (let i = 0; i < 5; i++) {
      const checked = (--rate > 0) ? " checked" : '';

      modelStar += `<span class="fa fa-star${checked}"></span>`
    }

    return modelStar;
  }
  var modal = data.map((items, index) => {
    return `<div class = "commentMain justify-content">
      <div class = "imageUser">
        <img src = "${items.imageUser}" class  = "imageUserDetail">
      </div>	
      <div class = "content-comment">
        <div class = "content-name-time">
          <div class = "name-comment"> 
            <p><b>${items.username}</b></p>
          </div>
  
          <div class = "time-comment">
            <p>${items.createAt}</p>
          </div>
        </div>
        <div class = "ratingUser">
          ${checked(items.rate)}
        </div>
        <div class = "commentUser">
          <p>${items.comment}</p>
        </div>
      </div>
    </div>`
  });



  return modal;
}

/* Display wishlist empty */
const wishlistEmpty = () => {
  $('.table.table-bordered').html(`
        <h3>No favorite products!</h3>
              <h6 class="pt-3">
                  <span
                      ><a class="text-success" style = "text-align: center;" href="/"
                          >Continue shopping</a
                      ></span
                  >
        </h6>`);
  $('.table.table-bordered').addClass("center-table");
  $('.table.table-bordered').removeClass('table table-bordered');
};

//display cart empty
const CartEmpty = () => {

  $('.main-cart').html(`
    <div class = "center-table" style = "text-align: center; margin-bottom: 200px;margin-top: 200px;">
                                  <h3>You have not put in your cart any products!</h3>
                                          <h6 class="pt-3">
                                              <span
                                                  ><a class="text-success" href="/"
                                                      >Continue shopping</a
                                                  ></span
                                              >
                                          </h6>
              </div>`)
  $('.main-cart').removeClass('main-cart');
}