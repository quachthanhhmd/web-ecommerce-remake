const socket = require('socket.io');

var SessionSockets = require('session.socket.io');
const cookieParser = require('cookie-parser');
const cookie = require('cookie');
const { session } = require("./middleware/session")



module.exports.socket = async (server) => {

	const io = socket(server);

	let socketsConnected = new Set();

	function onConnected(sk) {
		console.log('Socket connected', sk.id);
		socketsConnected.add(sk.id);

		//console.log(sk);

		sk.on('disconnect', () => {
			console.log('Socket disconnected', sk.id);
			socketsConnected.delete(sk.id);
		});


		sk.on('client-post-cmt', (data) => {
			//console.log('New comment from: ', data.data);

			if (data.path === "/cart") {

				sk.handshake.session = data.data;


			}

			sk.broadcast.emit('server-send-commention', data);
		});
	}

	io.on('connection', onConnected);

};

