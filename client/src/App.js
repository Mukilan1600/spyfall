import React, { Component } from "react";
import { connect } from "react-redux";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Room from "./components/Room";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Home from "./components/Home";
import { Spinner, Modal, ModalBody } from "reactstrap";
import PropTypes from "prop-types";

class App extends Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
  };

  componentDidMount() {
    this.setState({ loading: false });
  }

  state = {
    loading: true,
  };

  SpinnerModal = (loading) => (
    <Modal isOpen={loading} centered>
      <ModalBody className="text-center bg-black text-white border-0">
        <Spinner className="m-4" />
      </ModalBody>
    </Modal>
  );

  render() {
    const { loading } = this.state;
    const { isLoading } = this.props.socket;
    return loading ? (
      <Spinner style={{ marginTop: 25 + "%", marginLeft: 50 + "%" }} />
    ) : (
      <BrowserRouter>
        <div className="app">
          {this.SpinnerModal(isLoading)}
          <Navbar />
          <Switch>
            <Route path="/room/:id" component={Room} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

const mapStateToProps = (state) => ({
  socket: state.socket,
});

export default connect(mapStateToProps)(App);
