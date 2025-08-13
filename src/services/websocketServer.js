const WebSocket = require('ws');

module.exports = function(server) {
	const wss = new WebSocket.Server({ server });
	wss.on('connection', (ws) => {
		console.log('WebSocket client connected');
		ws.on('message', (message) => {
			// Echo message for now
			ws.send(`Echo: ${message}`);
		});
		ws.on('close', () => {
			console.log('WebSocket client disconnected');
		});
	});
	console.log('WebSocket server running');
};
