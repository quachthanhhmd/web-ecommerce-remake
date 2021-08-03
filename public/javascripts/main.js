/*price range*/

if ($.fn.slider) {
  $('#sl2').slider();
}

var RGBChange = function () {
  $('#RGB').css('background', 'rgb(' + r.getValue() + ',' + g.getValue() + ',' + b.getValue() + ')')
};

/*scroll to top*/

$(document).ready(function () {
  $(function () {
    $.scrollUp({
      scrollName: 'scrollUp', // Element ID
      scrollDistance: 300, // Distance from top/bottom before showing element (px)
      scrollFrom: 'top', // 'top' or 'bottom'
      scrollSpeed: 300, // Speed back to top (ms)
      easingType: 'linear', // Scroll to top easing (see http://easings.net/)
      animation: 'fade', // Fade, slide, none
      animationSpeed: 200, // Animation in speed (ms)
      scrollTrigger: false, // Set a custom triggering element. Can be an HTML string or jQuery object
      //scrollTarget: false, // Set a custom target element for scrolling to the top
      scrollText: '<i class="fa fa-angle-up"></i>', // Text for element, can contain HTML
      scrollTitle: false, // Set a custom <a> title if required.
      scrollImg: false, // Set true to use image
      activeOverlay: false, // Set CSS color to display scrollUp active point, e.g '#00FFFF'
      zIndex: 2147483647 // Z-Index for the overlay
    });

    $('#province', function (e) {

      $.ajax({
        url: "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/province",
        headers: {
          "token": "9b8adbe4-f439-11eb-92c9-be99c16f09d3",
          "Content-Type": "application/json"
        },
        method: "GET",
        dataType: "json",
        success: function (res) {

          var str = `<option>Tỉnh / Thành phố</option>`;
          for (let i = 0; i < res.data.length; i++) {
            str += `<option data-province=${res.data[i].ProvinceID}> ${res.data[i].ProvinceName} </option>`
          }

          $('#province').html(str);
        }
      })

    })
  });




});

(function ($) {
  /** AOS lib */
  'use strict';
  //slidebar hover
  $(".panel-heading").mouseenter(function () {
    $(".panel-collapse").fadeIn();
  });
  $(".panel-collapse").mouseleave(function () {
    $(".panel-collapse").fadeOut();
  });


  // Validator signup
  $('body>section>div.container>div.sign-up>form')
    .find('input')
    .not('.name')
    .click(function () {
      const curr = $(this);
      curr.next().addClass('d-none');
      curr.next().removeClass('d-block text-danger');
      curr.next().html('');
      $('#err-sign').addClass('d-none');
    });

  $('body>section>div.container>div.sign-up>form')
    .find('input')
    .blur(function () {
      if (!$(this).val()) {
        $(this).next().removeClass('d-none');
        $(this).next().addClass('d-block text-danger');

        $(this).next().html('This field is required!!');
        $(this).next().css('font-size', '12px');
        $(this).next().css('margin', '-10px 0 10px');
      }
    });
  $('input[name=password2]').blur(function (e) {
    const retype = $('input[name=password]').val();
    const pass = $(this).val();

    if (retype !== pass) {
      $(this).next().removeClass('d-none');
      $(this).next().addClass('d-block text-danger');

      $(this).next().html('Re-enter the password incorrectly!');
      $(this).next().css('font-size', '12px');
      $(this).next().css('margin', '-10px 0 10px');
    }
  });

  $('#sign-up').on('click', function (e) {
    e.preventDefault();
    if ($('.d-block.text-danger').length) return;

    $(this).click();
  });

  $('input[name=password2]').click(function () {
    const curr = $(this);
    curr.next().addClass('d-none');
    curr.next().removeClass('d-block text-danger');
    curr.next().html('');
  });

  // Form sign up check 
  $('body>section>div.container>div.sign-up>form')
    .find('input')
    .not('.name')
    .each(function () {
      $(this).blur(function () {
        const curr = $(this);

        const key = curr.attr('name');
        const val = curr.val();
        if (!val) return;

        const url = '/buyer/checkSignup';
        $.post({
          url,
          data: JSON.stringify({ [key]: val }),
          contentType: 'application/json',
          dataType: 'json',
          success: function (data) {
            console.log(data);
            if (data.msg === 'error') {
              curr.next().removeClass('d-none');
              curr.next().addClass('d-block text-danger');

              curr.next().html(data[key]);
              curr.next().css('font-size', '12px');
              curr.next().css('margin', '-10px 0 10px');
            } else {

              curr.next().addClass('d-none');

            }
          },
        });
      });
    });

  /**
   * Cart
   */
  $(".add-to-cart").click(function (e) {
    e.preventDefault();
    const slugName = $(this).attr("value");

    $.post(`/cart/${slugName}`, {}, function (data, status) {
      if (data.msg === "success" && status === "success") {
        const curCount = parseInt(
          $(".cart-count-add").html().replace(/[()]/g, "")
        );

        $(".cart-count-add").html(`(${curCount + 1})`);
      }

      sendMessage(data);
    });
  });




  // Update cart
  $(".cart_quantity_change").click(function (e) {
    e.preventDefault();

    const value = $(this).attr("value");
    const slugName = $(this).attr("name");


    if (parseInt(value) === 0) {
      const re = confirm("Bạn chắc chắn muốn xóa vật phẩm khỏi giỏ hàng ?");
      if (re == false) return false;
      $(this).parent().parent().css("display", "none");

      //check empty cart
      $('#cart_items > div > div.table-responsive.cart_info > table > tbody > tr')
        .not('tr[style="display: none;"]')
        .length === 0 && CartEmpty();
    }

    const request = $.ajax({
      url: `/cart/${slugName}`,
      data: JSON.stringify({
        bias: parseInt(value),
      }),
      type: "PUT",
      contentType: "application/json",
      processData: false,
      xhr: function () {
        return window.XMLHttpRequest == null ||
          new window.XMLHttpRequest().addEventListener == null
          ? new window.ActiveXObject("Microsoft.XMLHTTP")
          : $.ajaxSettings.xhr();
      },
    });

    request.done(function (data, status) {
      if (data.msg === "success" && status === "success") {
        data.data.items.forEach((item) => {
          $(`.${item.itemId}`).html(item.total);

          $(`.${item.itemId}_price`).val(item.quantity);

          if (item.checkItem === 0) {
            $(`.${item.itemId}_btn-minus`).attr("disabled", true);
          }
          else {
            $(`.${item.itemId}_btn-minus`).attr("disabled", false);
          }
        });

        $(".totalCost").html(data.data.totalCost);


        $(".totalCost").html(
          data.data.totalQuantity
            ? (data.data.totalCost)
            : 0
        );
        $(".cart-count-add").html(
          data.data.totalQuantity ? `(${data.data.totalQuantity})` : `(0)`
        );
        sendMessage(data);
      }
    });
  });

  $(".receive-share-cart").on("click", function (e) {
    e.preventDefault();

    $(".body-share-cart").html("Nhập mã giỏ hàng đã được chia sẻ từ bạn bè để cùng nhau mua hàng nhé!!");
    $("#share-cart-token").attr("value", "");
    $("#share-cart-token").attr("placeholder", "Nhập mã code nhận được từ bạn bè");

    $("#accept-token").removeClass('hidden-button');
    $('#button-modal').trigger('click');
  })

  $("#accept-token").on("click", function (e) {


    e.preventDefault();

    const token = $("#share-cart-token").val();

    console.log(token);

    const request = $.ajax({
      url: `/cart/share-cart/token/${token}`,
      type: "PUT",
      contentType: "application/json",
      processData: false,
      xhr: function () {
        return window.XMLHttpRequest == null ||
          new window.XMLHttpRequest().addEventListener == null
          ? new window.ActiveXObject("Microsoft.XMLHTTP")
          : $.ajaxSettings.xhr();
      },
    });

    request.done(function (data, status) {
      if (data.msg === "success" && status === "success") {


        sendMessage(data);

        location.reload();
      }
    });
    $("#close-modal").trigger("click");
  })

  $(".share-cart").on("click", function (e) {

    e.preventDefault();

    const urlShareCart = $(".share-cart").attr("value");



    $.get(urlShareCart, function (data) {

      if (data.status !== 'Success') return;

      $("#share-cart-token").attr("value", data.token);
      $("#share-cart-token").attr("placeholder", data.token);

      $("#accept-token").addClass('hidden-button');
      $('#button-modal').trigger('click');
    });


  })
  /**End Cart */

  // Upload avatar btn
  var readURL = function (input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $(".profile-pic").attr("src", e.target.result);
      };

      reader.readAsDataURL(input.files[0]);
    }
  };

  $(".file-upload").on("change", function () {
    readURL(this);
  });

  $(".upload-button").on("click", function () {
    $(".file-upload").click();
  });

  // 
  $('.widget.dashboard-links a').on('click', function () {

    $('.tab-pane[role="tabpanel"]').removeClass('show')
  })

  //view checkout
  // View checkout history
  $('.view-checkout').click(function (e) {

    e.preventDefault();

    const id = $(this).attr('value');

    $.get(`/user/checkout/${id}`, function (data) {
      if (data.msg !== 'success') return;

      $('#exampleModalCenter').html(modalCheckout(data));
      $('#show-model').trigger('click');
    });
  });




  $('#reset-password2').on('click', function (e) {
    e.preventDefault();
    const pass1 = $('input[name=password]').val();
    const pass2 = $('input[name=password2]').val();
    if (pass1 !== pass2) return;

    $(this).click();
  });


  $('.hidden-comment').on('click', function (e) {

    e.preventDefault();
    var numLoop = $("#get-comment").attr("value");

    if (parseInt(numLoop) === 0) {
      $('.commentMain ').remove();

    }



    const slugName = $("#more-comments").attr("value");

    $.post('/product-details/comments/?slugName=' + slugName + "&start=" + numLoop.toString())
      .then(
        function (data, status) {

          if (status !== "success") {
            return
          }

          $('#get-comment').attr("value", parseInt(numLoop) + 1);

          var newComment = modelComment(data.data.newComment);

          $('.add-comment').append(newComment);


          if (data.data.check) {
            $("#get-comment").attr("value", 0);
            $('#more-comments').text("See less");
          }
        }
      )
      .catch(err => {
        console.log('Error :-S', err)
      });
  })




  $(".submit-comment").click((e) => {

    e.preventDefault();
    var numReviews = +$('.num-reviews').text();

    const valCommemt = $("#comment-box").val();

    const keyComment = $("#comment-box").attr('name');

    const rating = document.querySelectorAll(".stars-comment input");

    const keyRating = rating[0].name;

    var res = 0;
    for (let i = 0; i < rating.length - 1; i++) {

      if (rating[i].checked) {
        res = 5 - i;
        break;
      }
    }


    const slugName = $(".submit-comment").attr("value");

    if (!valCommemt || !rating) return;

    const comment = $(".num-reviews").html();

    $(".num-reviews").html(`${parseInt(comment) + 1}`);
    const url = '/product-details/commentuser/' + slugName;
    $.post({
      url,
      data: JSON.stringify(
        {
          [keyComment]: valCommemt,
          [keyRating]: res,
        }),
      contentType: 'application/json',
      dataType: 'json',
      success: function (data) {
        console.log(data);
        if (data.msg === 'success') {

          var commentuser = modelComment([data.data]);

          // Emit socket
          sendMessage(data);

          $("#comment-box").val("");
          $('.num-reviews').html(numReviews + 1);
          $("#get-comment").attr("value", 0);
          $(".hidden-comment").trigger("click");
        }
      },
    })
  });



  $('.add-to-like').click(function (e) {
    e.preventDefault();

    // If not sign in
    if ($('a[href="/buyer/login"]').text() === 'Login') {

      const re = confirm("Please login to add a favorite product.");
      if (re == true) {
        window.location.replace("/buyer/login")
      }
      return;
    }


    const slugName = $(this).attr('value');
    const url = `/user/account/like/${slugName}`;

    $.post(url, {}, function (data, status) {
      if (data.msg === 'success' && status === 'success') {
        const oldVal = parseInt($('.cart-count-like').html().slice(1));
        $('.cart-count-like').html(`(${oldVal + 1})`);
      }
    });

    setTimeout(1000);
  });
  // Post unlike
  $('.trash-like').click(function (e) {
    e.preventDefault();

    const value = $(this).attr('value');

    if (parseInt(value) === 0) {
      const re = confirm(
        'Are you sure you want to remove items from your wishlist?'
      );
      if (re == false) return false;
      $(this).parent().parent().css("display", "none");

      /* Check empty */
      $('.table.table-bordered > .align-middle tr').not('tr[style="display: none;"]')
        .length === 0 && wishlistEmpty();
    }

    const slugName = $(this).attr('name');
    const url = `/user/account/unlike/${slugName}`;

    $.post(url, {}, function (data, status) {
      if (data.msg === 'success' && status === 'success') {
        $('.cart-count-like').html(`(${data.data.length})`);

      }
    });
  });

  $('#reset-password2').one('click', function (e) {
    e.preventDefault();
    const pass1 = $('input[name=password]').val();
    const pass2 = $('input[name=password2]').val();
    if (pass1 !== pass2) return;

    $(this).submit();
  });






  //ajax update promotion
  $("#submit-promotion").on('click', (e) => {

    e.preventDefault();

    let typeDisplay = 1;

    if ($("#submit-promotion").hasClass("remove-promotion")) {
      typeDisplay = 0;

    }
    console.log(typeDisplay)
    const Id = $("#submit-promotion").attr("value");
    const promotionCode = $("#form-apply-promotion").val();
    if (promotionCode === "")
      return;
    const url = (typeDisplay === 0) ? `/cart/promotion/${Id}` : `/cart/promotion/delete/${Id}`;
    console.log(typeDisplay, url);
    const key = $("#form-apply-promotion").attr("name");


    const request = $.ajax({
      url: url,
      data: JSON.stringify({
        [key]: promotionCode
      }),
      type: "PUT",
      contentType: "application/json",
      processData: false,
      xhr: function () {
        return window.XMLHttpRequest == null ||
          new window.XMLHttpRequest().addEventListener == null
          ? new window.ActiveXObject("Microsoft.XMLHTTP")
          : $.ajaxSettings.xhr();
      },
    });

    request.done(function (data, status) {
      if (data.msg === "success" && status === "success") {

        if (data.user === "Check promotion success") {
          $('#form-apply-promotion').prop("disabled", true);

          $('.totalPayment').html(data.data.payment);

          $('.promotion-code').html(`${data.data.discount} <b>(${data.data.discountRate}%)</b>`);
        }

        if (data.user === "Remove promotion success") {
          $('#form-apply-promotion').removeAttr('disabled');

          $('.totalPayment').html(data.data.payment);

          $('.promotion-code').html(`Không`);
        }

      }
    });
  })

  //Search product when enter
  $("#search-input").keypress(e => {

    if (e.which == 13) {
      const contentSearch = $("#search-input").val();
      console.log(contentSearch);
      $("#form-search").attr("action", "/shop/search?query=" + contentSearch.toString());
      $("#form-search").submit();
      return false
    }
  })



  $(".page-paging").click(function (e) {
    e.preventDefault();


    if ($(this).hasClass('disabled') || $(this).hasClass('active'))
      return;

    const val = $(this).attr('value');
    const urlParams = new URLSearchParams(window.location.search);

    urlParams.set('page', val);
    window.location.search = urlParams;

  })

  //dropdown choose district


  $("#province").change(function (e) {


    const province = $("#province").find(":selected").attr("data-province");
    console.log(province);
    if (province === null) return;

    $.ajax({
      url: "https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district",
      headers: {
        "token": "9b8adbe4-f439-11eb-92c9-be99c16f09d3",
        "Content-Type": "application/json"
      },
      method: "GET",
      dataType: "json",
      success: function (res) {
        console.log(res.data);
        var str = `<option>Quận / Huyện</option>`;
        for (let i = 0; i < res.data.length; i++) {
          if (res.data[i].ProvinceID == province)
            str += `<option data-district=${res.data[i].DistrictID}> ${res.data[i].DistrictName}</option>`
        }

        $('#district').html(str);
        $('#ward').html(`<option>Phường / Xã</option>`);
      }
    })
  })

  $("#district").change(function (e) {

    const district = $("#district").find(":selected").attr("data-district");
    console.log(district);
    if (district === null) return;

    $.ajax({
      url: `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward?district_id=${district}`,
      headers: {
        "token": "9b8adbe4-f439-11eb-92c9-be99c16f09d3",
        "Content-Type": "application/json"
      },
      method: "GET",
      dataType: "json",
      success: function (res) {
        console.log(res.data);
        var str = `<option>Phường / Xã</option>`;
        for (let i = 0; i < res.data.length; i++) {

          str += `<option data-ward=${res.data[i].WardCode}> ${res.data[i].WardName}</option>`
        }

        $('#ward').html(str);
      }
    })
  })

})(jQuery);