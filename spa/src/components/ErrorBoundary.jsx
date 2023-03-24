import React from "react";

export default class ErrorBoundary extends React.Component {

    componentDidCatch(error){
        console.info("here is my error boundary caught error:"+error);
    }

    render(){
        return this.props.children;
    }
}