const socket = require('socket.io');

module.exports.socket = async(server) => {
	const io =  socket(server);

	let socketsConnected = new Set();

	function onConnected(sk) {
		console.log('Socket connected', sk.id);
		socketsConnected.add(sk.id);
		
		sk.on('disconnect', () => {
			console.log('Socket disconnected', sk.id);
			socketsConnected.delete(sk.id);
		});

		sk.on('client-post-cmt', (data) => {
			console.log('New comment from: ', data.data);
			sk.broadcast.emit('server-send-commention', data);
		});
	}

	io.on('connection', onConnected);
};