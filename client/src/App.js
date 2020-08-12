import React, { Component } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Chat from "./components/Chatbox";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import { Provider } from "react-redux";
import Store from "./redux/Store";
import { Spinner } from "reactstrap";

class App extends Component {
  state = {
    loading: true,
  };

  componentDidMount() {
    this.setState({ loading: false });
  }

  render() {
    const { loading } = this.state;
    return loading ? (
      <Spinner style={{ marginTop: 25 + "%", marginLeft: 50 + "%" }} />
    ) : (
      <BrowserRouter>
        <Provider store={Store}>
          <div className="app">
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
}

export default App;
