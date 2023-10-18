const WebSocket = require('ws');
const fs = require('fs');
const Papa = require('papaparse');

const wss = new WebSocket.Server({ port: 8080 });

let csvData = [];

// Parsing the CSV file
console.log("loading csv");
Papa.parse(fs.createReadStream('./smaller_dataset.csv'), {
    header: true,
    dynamicTyping: true,
    complete: function (results) {
        csvData = results.data;
        console.log("csv loaded");
    }
});

wss.on('connection', (ws) => {
    console.log('Client connected');

    let lineIndex = 0;

    const sendLine = setInterval(() => {
        if (lineIndex < csvData.length) {
            ws.send(JSON.stringify(csvData[lineIndex]));
            lineIndex++;
        } else {
            clearInterval(sendLine);
        }
    }, 1000);

    ws.on('message', (message) => {
        console.log(`Received message: ${message}`);
        ws.send('Message received');
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(sendLine);  // Clear the interval upon disconnection to prevent sending data to closed connection.
    });
});
