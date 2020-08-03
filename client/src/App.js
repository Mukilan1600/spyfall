import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Chat from "./components/Chatbox";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import CreateRoom from "./components/CreateRoom";
import SocketContext from "./components/SocketContext";
import io from "socket.io-client";

function App() {
  const socket = io();
  return (
    <BrowserRouter>
      <SocketContext.Provider value={socket}>
        <div className="App">
          <Navbar />
          <Switch>
            <Route path="/room/:id" component={Chat} />
            <Route path="/createroom" component={CreateRoom} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </SocketContext.Provider>
    </BrowserRouter>
  );
}

export default App;
