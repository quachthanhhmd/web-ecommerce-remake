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
  });
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
    }
  });
});



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


