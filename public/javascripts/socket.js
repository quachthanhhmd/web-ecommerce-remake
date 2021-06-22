const socket = io();


//server-side
const sendMessage = (data) => {
    

	socket.emit('client-post-cmt', data);
};

//client

  socket.on('server-send-commention', (data) => {
  
    

    const url =
      window.location.protocol +
      '//' +
      window.location.host +
      window.location.pathname +
      window.location.search;
      
      console.log(url);
    //if (!data.url === url) return;

    // Update view comment
    const html = modelComment([data.data]);
    console.log(html);
    $('.add-comment').prepend(html);
   


  });

