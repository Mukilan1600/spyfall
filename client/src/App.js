import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Chat from "./components/Chatbox";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import { Provider } from "react-redux";
import Store from "./redux/Store";

function App() {
  return (
    <BrowserRouter>
      <Provider store={Store}>
        <div className="App">
          <Navbar />
          <Switch>
            <Route path="/room/:id" component={Chat} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </Provider>
    </BrowserRouter>
  );
}

export default App;
