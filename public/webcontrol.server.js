const WebSocket = require("ws");
const sha256 = require("js-sha256");
var util = require('util')

class WebControlServer {
  // Set default ports
  constructor(commandPort = 4000, controllPort = 4001) {
    this.commandPort = commandPort;
    this.controllPort = controllPort;
    this.clients = [];
    this.sockets = [];
  }

  // Create the command server for clients .
  startCommandServer() {
    this.commandServer = new WebSocket.Server({port: this.commandPort, host: "10.132.74.124"});

    this.commandServer.on("connection", (ws, req) => {
      const remoteAddress = ws._socket.remoteAddress,
            remotePort = ws._socket.remotePort;

      // generate the client ID by hashing IP and Port.
      let id = sha256(remoteAddress + remotePort);

      // Include the client in the client list.
      this.clients.push(new Client(id, remoteAddress, remotePort));
      this.sockets.push(ws);

      // log the new client connection
      console.log(`Client connected with id ${id}`);

      if (this.controllAppSocket.readyState === this.controllAppSocket.OPEN) {
        this.controllAppSocket.send(`{"messageType": "WC_APP_CLIENTS", "messageData": ${JSON.stringify(this.clients)}}`);
      }

      // Check for client connections every 2000ms. If a client disconnected
      // it will be removed from the client list.
      let connectionChecker = setInterval(() => {
        // if the client state is CLOSED or CLOSING remove it.
        if (ws.readyState === ws.CLOSED || ws.readyState === ws.CLOSING) {
          console.log(`Client with id ${id} disconnected`);
          this.clients = this.clients.filter(i => i.getID() !== id);
          this.sockets = this.sockets.filter(i => i !== ws);

          // stop checking for this sockets connection.
          clearInterval(connectionChecker);

          // send the new client list to the Controll App
          this.controllAppSocket.send(`{"messageType": "WC_APP_CLIENTS", "messageData": ${JSON.stringify(this.clients)}}`);
        }
      }, 2000)

      // Send a feedback message to the client with its id.
      ws.send(`{"messageType": "WC_CONNECTION_FEEDBACK", "messageData": "${id}"}`);
    });
  }

  // Create the controll server for the controll application
  startControllServer() {
    this.controllServer = new WebSocket.Server({port: this.controllPort, host: "10.132.74.124"});

    this.controllServer.on("connection", (ws, req) => {
      this.controllAppSocket = ws;
      this.controllAppSocket.send(`{"messageType": "WC_APP_CLIENTS", "messageData": ${JSON.stringify(this.clients)}}`);

      ws.on('message', message => {
        for (let socket of this.sockets) {
          const remoteAddress = socket._socket.remoteAddress,
          remotePort = socket._socket.remotePort;
          
          // generate the client ID by hashing IP and Port.
          let id = sha256(remoteAddress + remotePort);

          const messageObject = JSON.parse(message);

          if(messageObject.sockets.includes(id) || messageObject.sockets.length === 0) {
            let responseObject = {messageType: messageObject.messageType, messageData: messageObject.messageData}
            console.log(JSON.stringify(responseObject))
            socket.send(JSON.stringify(responseObject))
          }
        }
      });

    });
  }

  start() {
    this.startCommandServer();
    this.startControllServer();
  }
}

class Client {
  constructor(id, ip, port) {
    this.id = id;
    this.ip = ip;
    this.port = port;
  }

  getID() {
    return this.id;
  }
}

module.exports = WebControlServer;