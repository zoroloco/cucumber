import React from "react";

export default class ErrorBoundary extends React.Component {
  componentDidCatch(error) {
    console.info("Error boundary caught error:" + error);
  }

  render() {
    return this.props.children;
  }
}
