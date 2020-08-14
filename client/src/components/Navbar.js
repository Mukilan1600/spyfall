import React, { Component } from "react";
import { Nav, Navbar, NavbarBrand, NavItem, Button, NavLink } from "reactstrap";
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
    const { game_started, round_time } = this.props.game;
    const { countdown } = this.state;
    if (!countdown && game_started)
      this.setState({
        countdown: true,
        time: Date.now() + round_time * 60 * 1000,
      });
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
      <Navbar dark expand="md" className="mb-3">
        <NavbarBrand href="/">
          <FontAwesomeIcon icon={faUserSecret} className="mr-1" />
          Spyfall
        </NavbarBrand>
        <Nav
          style={{
            float: "none",
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
          }}
          navbar
        >
          <NavItem>
            {game_started && countdown && (
              <Countdown date={time} renderer={this.countdownTimer} />
            )}
          </NavItem>
        </Nav>
        <Nav className="ml-auto" navbar>
          <NavItem>
            <NavLink
              target="_blank"
              href="https://github.com/Mukilan1600/spyfall"
              className="text-decoration-none text-white"
              rel="noopener noreferrer"
            >
              Github
            </NavLink>
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
