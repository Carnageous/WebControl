class WebControlClient {
  constructor(url, protocol) {
    this.url = url;
    this.protocol = protocol;
    this.ws = new WebSocket("ws://10.132.74.124:4000");
  }

  start() {
    this.ws.onmessage = e => this.handleMessages(e);
    this.ws.onopen = () => {
      this.ws.send("Client connected");
      console.log("%c Connected to WebControl on 10.132.74.124:4000", "background: #212121; color: #e5e028");
    }
  }

  handleMessages(e) {
    let message = JSON.parse(e.data);

    switch (message.messageType) {
      case "WC_CONNECTION_FEEDBACK":
        this.id = message.messageData;
        break;
      case "WC_COMMAND_ALERT":
        alert(message.messageData);
        break;
      case "WC_COMMAND_CONSOLE_LOG":
        console.log(message.messageData);
        break;
      case "WC_COMMAND_CONSOLE_WARN":
        console.warn(message.messageData);
        break;
      case "WC_COMMAND_CONSOLE_ERROR":
        console.error(message.messageData);
        break;
      case "WC_COMMAND_EVAL":
        eval(message.messageData);
        break;
      case "WC_COMMAND_RELOAD":
        location.reload();
        break;
      case "WC_COMMAND_CLOSE":
        this.ws.close();
        console.log("%c Connection to WebControl closed ", "background: #212121; color: #e55028");
        break;
      default:
        break;
    }
  }
}