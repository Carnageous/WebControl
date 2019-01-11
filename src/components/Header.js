import React, {Component} from "react";


import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faWindowMaximize, faTimes, faMinus, faCogs} from '@fortawesome/free-solid-svg-icons';

const electron = window.require("electron");

class Header extends Component {
  minimizeWindow = e => {
    electron.remote.BrowserWindow.getFocusedWindow().minimize();
  }

  maximizeWindow = e => {
    electron.remote.BrowserWindow.getFocusedWindow().maximize();
  }

  closeWindow = e => {
    electron.remote.BrowserWindow.getFocusedWindow().close();
  }

  render() {
    return (
      <div className="Header">
        <div className="Header-icon Header-options-button" onClick={this.minimizeWindow}>
          <FontAwesomeIcon icon={faCogs}></FontAwesomeIcon>
        </div>
        <div className="Header-title">WebControll</div>
        <div className="Header-icons">
          <div className="Header-icon" onClick={this.minimizeWindow}>
            <FontAwesomeIcon icon={faMinus}></FontAwesomeIcon>
          </div>
          <div className="Header-icon" onClick={this.maximizeWindow}>
            <FontAwesomeIcon icon={faWindowMaximize}></FontAwesomeIcon>
          </div>
          <div className="Header-icon" onClick={this.closeWindow}>
            <FontAwesomeIcon icon={faTimes}></FontAwesomeIcon>
          </div>
        </div>
      </div>
    )
  }
}

export default Header;