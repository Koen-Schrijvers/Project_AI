const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080');

ws.on('open', () => {
    console.log('Connected to server');

    // Sending a message to the server
    ws.send('Hello, server!');
});

ws.on('message', (message) => {
    console.log(`Received message: ${message}`);

    // Close the connection after receiving a message
    //ws.close();
});

ws.on('close', () => {
    console.log('Disconnected from server');
});

ws.on('error', (error) => {
    console.log('An error occurred:', error);
});
