import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons";

class Clients extends Component {

  render() {
    let clients = this.props.clients.map(i => (
      <div key={i.id} className="Client">
        <div className="Client-Adress">{i.ip + ":" + i.port}</div>
        <div className="Client-Id">{i.id}</div>
        <div className="Client-Disconnect-button" onClick={() => this.props.executeCommand("WC_COMMAND_CLOSE", "", [i.id])}><FontAwesomeIcon icon={faTimes}></FontAwesomeIcon></div>
      </div>
    ));

    return (
      <div className={"Clients"}>
        {clients}
      </div>
    )
  }
}

export default Clients;