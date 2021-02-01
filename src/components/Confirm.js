import React, { Component } from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { FiX } from "react-icons/fi";
import Button from "./Button";

export default class ReactConfirmAlert extends Component {
  static defaultProps = {
    buttons: [
      {
        label: "Cancel",
        onClick: () => null,
        className: null,
      },
      {
        label: "Confirmar",
        onClick: () => null,
        className: null,
      },
    ],
    childrenElement: () => null,
    closeOnClickOutside: true,
    closeOnEscape: true,
    willUnmount: () => null,
    afterClose: () => null,
    onClickOutside: () => null,
    onKeypressEscape: () => null,
  };

  handleClickButton = (button) => {
    if (button.onClick) button.onClick();
    this.close();
  };

  handleClickOverlay = (e) => {
    const { closeOnClickOutside, onClickOutside } = this.props;
    const isClickOutside = e.target === this.overlay;

    if (closeOnClickOutside && isClickOutside) {
      onClickOutside();
      this.close();
    }
  };

  close = () => {
    removeBodyClass();
    removeElementReconfirm();
  };

  keyboardClose = (event) => {
    const { closeOnEscape, onKeypressEscape } = this.props;
    const isKeyCodeEscape = event.keyCode === 27;

    if (closeOnEscape && isKeyCodeEscape) {
      onKeypressEscape(event);
      this.close();
    }
  };

  componentDidMount = () => {
    document.addEventListener("keydown", this.keyboardClose, false);
  };

  componentWillUnmount = () => {
    document.removeEventListener("keydown", this.keyboardClose, false);
    this.props.willUnmount();
  };

  renderCustomUI = () => {
    const { title, message, buttons, customUI } = this.props;
    const dataCustomUI = {
      title,
      message,
      buttons,
      onClose: this.close,
    };

    return customUI(dataCustomUI);
  };

  render() {
    const { title, message, buttons } = this.props;

    return (
      <div className={`modal-container show`}>
        <div className={`modal modal-xs`}>
          <div className="modal-header">
            <h4>{title}</h4>
            <button className="close-button">
              <FiX />
            </button>
          </div>
          <div className="modal-body">{message}</div>
          <div className="modal-footer">
            {buttons.map((button, i) => (
              <Button
                key={i}
                style={{ marginLeft: 5 }}
                color={button.color}
                onClick={() => this.handleClickButton(button)}
              >
                {button.label}
              </Button>
            ))}
          </div>
        </div>
        <div className="backdrop" style={{ opacity: 0.1 }} />
      </div>
    );
  }
}

function createElementReconfirm(properties) {
  let divTarget = document.getElementById("react-confirm-alert");
  if (divTarget) {
    // Rerender - the mounted ReactConfirmAlert
    render(<ReactConfirmAlert {...properties} />, divTarget);
  } else {
    // Mount the ReactConfirmAlert component
    document.body.children[0].classList.add("react-confirm-alert-blur");
    divTarget = document.createElement("div");
    divTarget.id = "react-confirm-alert";
    document.body.appendChild(divTarget);
    render(<ReactConfirmAlert {...properties} />, divTarget);
  }
}

function removeElementReconfirm() {
  const target = document.getElementById("react-confirm-alert");
  if (target) {
    unmountComponentAtNode(target);
    target.parentNode.removeChild(target);
  }
}

function addBodyClass() {
  document.body.classList.add("react-confirm-alert-body-element");
}

function removeBodyClass() {
  document.body.classList.remove("react-confirm-alert-body-element");
}

export function confirmAlert(properties) {
  addBodyClass();
  createElementReconfirm(properties);
}
