import React, {Component} from "react";
import "./App.css";

import {Provider} from "react-alert";

import Header from "./components/Header";
import Main from "./components/Main";
import Console from "./components/Console";
import Clients from "./components/Clients"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes, faInfoCircle, faExclamationTriangle} from "@fortawesome/free-solid-svg-icons";

class App extends Component {
  constructor(props) {
    super(props);

    let ws = new WebSocket("ws://10.132.74.124:4001");

    this.state = {
      commands: [
        {name: "Reload", command: "WC_COMMAND_RELOAD"},
        {name: "Close", command: "WC_COMMAND_CLOSE"}
      ],
      clients: [],
      ws
    }

    ws.onmessage = e => {
      let message = JSON.parse(e.data);

      switch (message.messageType) {
        case "WC_APP_CLIENTS":
          console.log(message.messageData)
          this.setState({clients: message.messageData});
          break;
        default:
          break;
      }
    };
  }

  executeCommand = (messageType, messageData, sockets) => {
    this.state.ws.send(`{"messageType": "${messageType}", "messageData": "${messageData}", "sockets": ${JSON.stringify(sockets)}}`);
  }

  render() {
    const alertOptions = {
      timeout: 10000,
      position: "bottom center"
    };

    const alertStyle = {
      backgroundColor: "#2d3436",
      color: "white",
      padding: "20px",
      borderRadius: "3px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      boxShadow: "0px 2px 2px 2px rgba(0, 0, 0, 0.03)",
      width: "80vw",
      boxSizing: "border-box",
      textAlign: "center"
    }

    const buttonStyle = {
      marginLeft: "20px",
      border: "none",
      backgroundColor: "transparent",
      cursor: "pointer",
      color: "#FFFFFF"
    }

    const AlertTemplate = ({message, options, style, close}) => {
      return (
        <div style={{...alertStyle, ...style}}>
          {options.type === "info" && <FontAwesomeIcon icon={faInfoCircle} size="lg" style={{color: "#00b894"}}></FontAwesomeIcon>}
          {options.type === "success" && <FontAwesomeIcon icon={faExclamationTriangle} size="lg" style={{color: "#fdcb6e"}}></FontAwesomeIcon>}
          {options.type === "error" && <FontAwesomeIcon icon={faTimes} size="lg" style={{color: "#d63031"}}></FontAwesomeIcon>}
          <span style={{flex: 2}}>{message}</span>
          <button onClick={close} style={buttonStyle}>
            <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
          </button>
        </div>
      )
    }

    return (
      <Provider template={AlertTemplate} {...alertOptions}>
        <div className="App">
          <Header></Header>
          <Main>
            <Clients clients={this.state.clients} executeCommand={this.executeCommand}></Clients>
          </Main>
          <Console commands={this.state.commands} executeCommand={this.executeCommand}></Console>
        </div>
      </Provider>
    );
  }
}

export default App;
