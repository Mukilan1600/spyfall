import React, { Component } from "react";
import { Nav, Navbar, NavbarBrand, NavItem, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import Countdown, { zeroPad } from "react-countdown";
import PropTypes from "prop-types";

class NavbarDiv extends Component {
  static propTypes = {
    game: PropTypes.object.isRequired,
    socket: PropTypes.object.isRequired,
  };

  state = {
    countdown: false,
    time: null,
  };

  componentDidUpdate(prevProps) {
    const { game_started } = this.props.game;
    const { countdown } = this.state;
    if (!countdown && game_started)
      this.setState({ countdown: true, time: Date.now() + 8 * 60 * 1000 });
    if (countdown && !game_started)
      this.setState({ countdown: false, time: null });
  }

  countdownTimer = ({ minutes, seconds, completed }) => {
    const { socket, room_id } = this.props.socket;
    const { countdown } = this.state;
    if (completed) {
      this.setState({ countdown: false, time: null });
      if (countdown) socket.emit("end_game", room_id);
    }
    return (
      <Button disabled color="success">
        {zeroPad(minutes)}:{zeroPad(seconds)}
      </Button>
    );
  };

  render() {
    const { time, countdown } = this.state;
    const { game_started } = this.props.game;
    return (
      <Navbar color="dark" dark expand="md">
        <NavbarBrand href="/">
          <FontAwesomeIcon icon={faUserSecret} className="mr-1" />
          Spyfall
        </NavbarBrand>
        <Nav className="ml-auto" navbar>
          <NavItem>
            {game_started && countdown && (
              <Countdown date={time} renderer={this.countdownTimer} />
            )}
          </NavItem>
        </Nav>
      </Navbar>
    );
  }
}

const mapStateToProps = (state) => ({
  game: state.game,
  socket: state.socket,
});

export default connect(mapStateToProps)(NavbarDiv);
