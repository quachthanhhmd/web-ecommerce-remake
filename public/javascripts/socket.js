const socket = io().connect();


//server-side
const sendMessage = (data) => {

  socket.emit('client-post-cmt', data);
};

//client

socket.on('server-send-commention', (data) => {

  const url = window.location.pathname;


  //if (!data.url === url) return;

  // Update view comment
  if (url !== "/cart") {
    const html = modelComment([data.data]);
    console.log(html);
    $('.add-comment').prepend(html);
  }
  else {

    
    location.reload();
  }

});

