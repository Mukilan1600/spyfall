import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
import moment from "moment";
import {
  Card,
  Container,
  Row,
  Input,
  CardFooter,
  CardBody,
  InputGroup,
  InputGroupAddon,
  Button,
  Form,
  CardHeader,
  ListGroup,
  ListGroupItem,
} from "reactstrap";
import Message from "./Message";
import {
  sendMsg,
  recieveMsg,
  getRoomUsers,
  leaveRoom,
} from "../redux/actions/SocketActions";
import { startGame, leaveGame } from "../redux/actions/GameActions";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faStar } from "@fortawesome/free-solid-svg-icons";

class Chat extends Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
  };

  scrollToBottom = () => {
    this.el.scrollIntoView({ behaviour: "smooth" });
  };

  componentDidMount() {
    const { socket, room_id, name } = this.props.socket;
    if (!socket || !room_id || !name) this.props.history.push("/");
    else {
      socket.on("recieve_msg", (msg) => {
        this.props.recieveMsg(msg);
      });

      socket.on("room_users", (users) => {
        this.props.getRoomUsers(users);
      });
    }
  }

  state = {
    users: [],
    message: "",
    socket: null,
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  componentWillUnmount() {
    const { socket } = this.props.socket;
    if (socket) {
      socket.removeAllListeners();
      this.props.leaveRoom(socket);
      this.props.leaveGame();
    }
  }
  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onSubmitHandler = (e) => {
    e.preventDefault();
    const { message } = this.state;
    const { socket } = this.props.socket;
    this.props.sendMsg(socket, message);
    this.setState({ message: "" });
  };

  onGameStart = () => {
    const { socket } = this.props.socket;
    socket.emit("start_game");
  };
  render() {
    const { chat, room_id, users, leader } = this.props.socket;
    const { game_started } = this.props.game;
    return (
      <Container fluid>
        <Row className="mt-3 mb-3">
          <div className="col-lg-4">
            <Card style={{ height: "40vh" }}>
              <CardHeader>Room ID: {room_id}</CardHeader>
              <CardBody className="overflow-auto">
                <ListGroup>
                  {users &&
                    users.map((user) => (
                      <ListGroupItem key={user.id}>
                        <FontAwesomeIcon
                          icon={user.leader ? faStar : faUser}
                          className="mr-2"
                        />
                        {user.name}
                      </ListGroupItem>
                    ))}
                </ListGroup>
              </CardBody>
              {leader && !game_started && (
                <CardFooter>
                  {users.length >= 3 ? (
                    <Button color="success" onClick={this.onGameStart}>
                      Start game
                    </Button>
                  ) : (
                    <Button disabled>Start game</Button>
                  )}
                </CardFooter>
              )}
            </Card>
            <Card style={{ height: "40vh" }}>
              <CardBody>Hello</CardBody>
            </Card>
          </div>
          <div className="col-lg-8">
            <Card className="chat_div">
              <CardBody className="overflow-auto h-100">
                {chat.map(({ name, msg, time }) => (
                  <Message name={name} msg={msg} time={time} key={msg} />
                ))}
                <div
                  ref={(el) => {
                    this.el = el;
                  }}
                />
              </CardBody>
              <CardFooter>
                <Form onSubmit={this.onSubmitHandler}>
                  <InputGroup>
                    <Input
                      type="text"
                      placeholder="Enter Message..."
                      name="message"
                      onChange={this.onChangeHandler}
                      value={this.state.message}
                    ></Input>
                    <InputGroupAddon addonType="append">
                      <Button color="primary" type="submit">
                        Send
                      </Button>
                    </InputGroupAddon>
                  </InputGroup>
                </Form>
              </CardFooter>
            </Card>
          </div>
        </Row>
      </Container>
    );
  }
}

const mapStateToProps = (state) => ({
  socket: state.socket,
  game: state.game,
});

export default compose(
  withRouter,
  connect(mapStateToProps, {
    sendMsg,
    recieveMsg,
    getRoomUsers,
    leaveRoom,
    startGame,
    leaveGame,
  })
)(Chat);
