import React, { Component } from "react";
import { withAlert } from 'react-alert'

class Main extends Component {
  render() {
    return (
      <div className="Main">
        {this.props.children}
      </div>
    )
  }
}

export default withAlert(Main);