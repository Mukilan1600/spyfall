import React from "react";

const socketContext = React.createContext(null);

export const withSocket = (Component) => (props) => (
  <socketContext.Consumer>
    {(socket) => <Component {...props} socket={socket} />}
  </socketContext.Consumer>
);

export default socketContext;
