import React, { Component } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import PropTypes from "prop-types";
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
  Alert,
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
  }

  state = {
    users: [],
    message: "",
    socket: null,
    rVote: null,
    spy_guess: null,
    nextQuesTimer: null,
  };

  onVoteForUser = (idx) => {
    this.setState({ rVote: idx });
  };

  componentDidUpdate(prevProps, prevState) {
    if (this.props.socket.chat.length > prevProps.socket.chat.length)
      this.scrollToBottom();
    const { room_id, socket } = this.props.socket;
    const { currQues } = this.props.game;
    const prevQues = prevProps.game.currQues;
    if (currQues) {
      if (currQues[0].id === socket.id) {
        if (!prevQues)
          this.setState({
            nextQuesTimer: setTimeout(() => this.getNextQues(), 60 * 1000),
          });
        else if (prevQues[0].id !== currQues[0].id)
          this.setState({
            nextQuesTimer: setTimeout(() => this.getNextQues(), 60 * 1000),
          });
      }
    }
    console.log(prevProps);
    if (!room_id) this.props.history.push("/");
  }

  getNextQues = () => {
    const { socket, room_id } = this.props.socket;
    socket.emit("next_ques", room_id);
  };

  componentWillUnmount() {
    const { socket } = this.props.socket;
    const { nextQuesTimer } = this.state;
    if (nextQuesTimer) clearTimeout(nextQuesTimer);
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

  onSpyGuess = () => {
    const { socket, room_id } = this.props.socket;
    const { spy_guess } = this.state;
    if (spy_guess && spy_guess !== "")
      socket.emit("spy_guess", spy_guess, room_id);
  };

  render() {
    const { chat, room_id, users, leader, socket } = this.props.socket;
    const {
      game_started,
      spy,
      location,
      all_locations,
      currQues,
    } = this.props.game;
    const { rVote } = this.state;
    return (
      <Container fluid>
        <Row className="mt-3 mb-3">
          <div className="col-lg-4">
            <Card style={{ height: "40vh" }}>
              <CardHeader>Room ID: {room_id}</CardHeader>
              <CardBody className="overflow-auto">
                {game_started && !spy ? (
                  <React.Fragment>
                    <p>Vote for who you think is the spy: </p>
                    {users.map((user, idx) =>
                      user.id !== socket.id ? (
                        <Button
                          block
                          color="primary"
                          onClick={this.onVoteForUser.bind(this, idx)}
                          active={rVote === idx}
                          key={idx}
                        >
                          <FontAwesomeIcon
                            icon={user.leader ? faStar : faUser}
                            className="mr-2"
                          />
                          {user.name}
                        </Button>
                      ) : (
                        <Button disabled block color="primary" key={idx}>
                          <FontAwesomeIcon
                            icon={user.leader ? faStar : faUser}
                            className="mr-2"
                          />
                          {user.name}
                        </Button>
                      )
                    )}
                  </React.Fragment>
                ) : (
                  <ListGroup>
                    {users &&
                      users.map((user, idx) => (
                        <ListGroupItem key={idx}>
                          <FontAwesomeIcon
                            icon={user.leader ? faStar : faUser}
                            className="mr-2"
                          />
                          {user.name}
                        </ListGroupItem>
                      ))}
                  </ListGroup>
                )}
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
              {game_started ? (
                <React.Fragment>
                  <CardHeader>
                    {spy ? "You're the spy" : `You are in ${location}`}
                  </CardHeader>
                  <CardBody className="overflow-auto">
                    {game_started && (
                      <React.Fragment>
                        {spy && (
                          <React.Fragment>
                            <p>Where do you think the others are?</p>
                            <Input
                              type="select"
                              name="spy_guess"
                              onChange={this.onChangeHandler}
                            >
                              <option disabled hidden selected value="">
                                Select a location
                              </option>
                              {all_locations.map((location, idx) => (
                                <option key={idx} value={location}>
                                  {location}
                                </option>
                              ))}
                            </Input>
                            <Button
                              color="danger"
                              className="m-2"
                              onClick={this.onSpyGuess}
                              block
                            >
                              Bomb it!
                            </Button>
                          </React.Fragment>
                        )}
                        {currQues[0].id === socket.id ? (
                          <Alert color="info">
                            <span>You have to question {currQues[1].name}</span>
                            <Button
                              className="ml-2"
                              size="sm"
                              color="success"
                              onClick={this.getNextQues}
                            >
                              Done!
                            </Button>
                          </Alert>
                        ) : currQues[1].id === socket.id ? (
                          <Alert color="info">
                            You have to answer {currQues[0].name}'s questions
                          </Alert>
                        ) : (
                          <Alert color="info">
                            {currQues[0].name} is questioning {currQues[1].name}
                          </Alert>
                        )}
                      </React.Fragment>
                    )}
                  </CardBody>
                </React.Fragment>
              ) : (
                <CardBody>
                  <Alert color="info">Waiting for the game to start...</Alert>
                </CardBody>
              )}
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
