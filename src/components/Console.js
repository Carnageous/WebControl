import React, {Component} from "react";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faArrowUp} from '@fortawesome/free-solid-svg-icons';

class Console extends Component {
  constructor(props) {
    super(props);

    this.state = {
      advancedToggled: false,
      command: ""
    }
  }

  toggleAdvanced = e => {
    this.setState(state => ({
      advancedToggled: !state.advancedToggled
    }));
  }

  onConsoleValueChange = e => {
    e.persist();

    this.setState({
      command: e.target.value
    })
  }

  sendCommand = () => {
    this.props.executeCommand("WC_COMMAND_EVAL", this.state.command, []);
  }

  render() {
    let commands = this.props.commands.map(i => (
      <div className="Console-command" key={i.command} onClick={() => {this.props.executeCommand(i.command, "", [])}}>
        {i.name}
      </div>
    ));

    return (
      <div className={this.state.advancedToggled ? "Console Console-toggled" : "Console"}>
        <button className="Console-button Button" onClick={this.toggleAdvanced} style={{gridArea: "toggle"}}><FontAwesomeIcon icon={faArrowUp} style={{transform: `rotate(${this.state.advancedToggled ? 180 : 0}deg)`}}></FontAwesomeIcon></button>
        <input type="text" className="Console-input" placeholder="Execute Command" onChange={this.onConsoleValueChange} value={this.state.command}></input>
        <button className="Console-button Button_primary" onClick={this.sendCommand} style={{right: 0, gridArea: "send"}}><FontAwesomeIcon icon={faArrowUp} style={{transform: `rotate(90deg)`}}></FontAwesomeIcon></button>
        <div className="Console-advanced">
          <div className="Console-commands-grid">
            {commands}
          </div>
        </div>
      </div>
    )
  }
}

export default Console;