const WebSocket = require('ws');

const server = new WebSocket.Server({ port: 8080 });

server.on('connection', (ws) => {
  ws.on('message', (message) => {
    const msg = message.toString();
    // Stream the original message
    streamMessage(ws, msg);

    // Stream the reversed message
    streamMessage(ws, msg.split('').reverse().join(''));

    // Count occurrences of the last character
    const lastChar = msg[msg.length - 1];
    const count = msg.slice(0, -1).split(lastChar).length - 1;
    ws.send(JSON.stringify({ action: 'count', character: lastChar, occurrences: count }));
  });
});

function streamMessage(ws, message) {
  let i = 0;
  const interval = setInterval(() => {
    if (i < message.length) {
      ws.send(JSON.stringify({ action: 'echo', message: message[i] }));
      i++;
    } else {
      clearInterval(interval);
    }
  }, 100);
}

console.log('WebSocket server is running on ws://localhost:8080');