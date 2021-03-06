import { Component, h } from 'preact';

export default class ErrorBox extends Preact.Component {
  render() {
    console.error(this.props.error);

    const errorStyle = {
      background: '#900',
      color: 'white',
      padding: '20px',
      position: 'fixed',
      top: '0',
      left: '0',
      width: '100%',
      boxShadow: '0 4px 10px rgba(0,0,0,0.4)',
      zIndex: 1000
    };

    return (
      <div style={errorStyle}>
        <pre>{this.props.error.stack}</pre>
      </div>
    );
  }
}
