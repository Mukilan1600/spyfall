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
  Modal,
  ModalHeader,
  ModalBody,
} from "reactstrap";
import Message from "./Message";
import {
  sendMsg,
  recieveMsg,
  getRoomUsers,
  leaveRoom,
} from "../redux/actions/SocketActions";
import {
  startGame,
  leaveGame,
  onNextRound,
} from "../redux/actions/GameActions";
import { withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faStar,
  faArrowRight,
  faPaste,
} from "@fortawesome/free-solid-svg-icons";
import { clear_error } from "../redux/actions/ErrorActions";
//copy to clipboard import
import copy from "copy-to-clipboard";
import ReactTooltip from "react-tooltip";

class Chat extends Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
    error: PropTypes.object.isRequired,
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
    nextRoundResFragToggle: false,
    nextRound: true,
    errorModal: false,
    ResFragProgress: 0,
    copy_msg: "Click to copy",
  };

  onVoteForUser = (idx) => {
    const { socket, room_id } = this.props.socket;
    socket.emit("spy_vote", room_id, idx);
    this.setState({ rVote: idx });
  };

  componentDidUpdate(prevProps, prevState) {
    const { error } = this.props.error;
    const { errorModal } = this.state;
    const { nextRoundResFrag } = this.props.game;
    if (!prevProps.game.nextRoundResFrag && nextRoundResFrag)
      this.setState({
        nextRoundResFragToggle: true,
        nextRoundResTimer: setInterval(() => {
          const { ResFragProgress, nextRoundResTimer } = this.state;
          this.setState({ ResFragProgress: ResFragProgress + 10 });
          if (ResFragProgress >= 100) {
            const { socket } = this.props.socket;
            this.setState({ nextRoundResFragToggle: false });
            socket.emit("next_round", room_id);

            clearInterval(nextRoundResTimer);
            this.setState({ ResFragProgress: 0 });
          }
        }, 1000),
      });
    if (error && error.priority === 1 && !errorModal)
      this.setState({ errorModal: true });
    if (this.props.game.chat.length > prevProps.game.chat.length)
      this.scrollToBottom();
    const { room_id, socket } = this.props.socket;
    const { currQues, game_started } = this.props.game;
    const prevQues = prevProps.game.currQues;
    const prevGame_started = prevProps.game.game_started;
    if (prevGame_started && !game_started) this.setState({ rVote: null });
    if (currQues) {
      if (currQues[0].id === socket.id) {
        if (!prevQues)
          this.setState({
            nextQuesTimer: setTimeout(this.getNextQues, 60 * 1000),
          });
        else if (prevQues[0].id !== currQues[0].id)
          this.setState({
            nextQuesTimer: setTimeout(this.getNextQues, 60 * 1000),
          });
      }
    }
    if (!room_id) this.props.history.push("/");
  }
  // copying to clipboard
  Copytext = (_rid) => {
    copy(_rid);
    this.setState({ copy_msg: "Copied" });
  };

  onVoteNextRound = (value) => {
    const { socket, room_id } = this.props.socket;
    if (value) socket.emit("next_round_vote", room_id);
    this.setState({ nextRoundResFragToggle: false });
  };

  getNextQues = () => {
    const { socket, room_id } = this.props.socket;
    const { end, game_started } = this.props.game;
    const { nextQuesTimer } = this.state;
    if (nextQuesTimer) {
      clearTimeout(nextQuesTimer);
      this.setState({ nextQuesTimer: null });
    }
    if (game_started) {
      socket.emit("next_ques", room_id, end);
    }
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
    if (message && message !== "") this.props.sendMsg(socket, message);
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

  onModalToggle = (id) => {
    this.setState({
      [id]: !this.state[id],
    });
    this.props.clear_error();
  };

  popupErrorModal = (modalIsOpen, error) => (
    <Modal
      isOpen={modalIsOpen}
      toggle={this.onModalToggle.bind(this, "errorModal")}
      centered
    >
      <ModalHeader toggle={this.onModalToggle.bind(this, "errorModal")}>
        {error.error}
      </ModalHeader>
      <ModalBody>
        <Alert color={error.type === 0 ? "danger" : "success"}>
          {error.msg}
        </Alert>
      </ModalBody>
    </Modal>
  );

  render() {
    const { room_id, users, leader, socket, name } = this.props.socket;
    const {
      game_started,
      spy,
      location,
      all_locations,
      currQues,
      end,
      nextRoundResFrag,
      chat,
    } = this.props.game;
    const { error } = this.props.error;
    const {
      rVote,
      nextRoundResFragToggle,
      errorModal,
      ResFragProgress,
      copy_msg,
    } = this.state;

    return (
      <Container fluid>
        {error && this.popupErrorModal(errorModal, error)}
        <Row className="mt-3 mb-3">
          <div className="col-lg-4">
            <Card style={{ height: "40vh" }}>
              <CardHeader>
                Username: {name}
                <br />
                Room ID: {room_id}
                <span data-tip={copy_msg} data-for="copy">
                  <Button
                    className="copy_btn"
                    color="outline-secondary"
                    size="sm"
                    style={{ marginLeft: "10px" }}
                    onClick={this.Copytext.bind(this, room_id)}
                  >
                    <FontAwesomeIcon icon={faPaste} />
                    <ReactTooltip
                      id="copy"
                      effect="solid"
                      getContent={() => copy_msg}
                    />
                  </Button>
                </span>
              </CardHeader>
              <CardBody className="overflow-auto">
                {game_started && !spy ? (
                  <React.Fragment>
                    <p>Vote for who you think is the spy: </p>
                    {users.map((user, idx) =>
                      user.id !== socket.id ? (
                        <Button
                          block
                          color="primary"
                          onClick={this.onVoteForUser.bind(this, user.id)}
                          active={rVote === user.id}
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
                    <t data-tip="You need atleast 3 memebers to play this game">
                      <Button style={{ pointerEvents: "none" }} disabled>
                        Start game
                      </Button>
                      <ReactTooltip />
                    </t>
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
                        {!nextRoundResFrag &&
                          (currQues[0].id === socket.id ? (
                            <Alert color="info">
                              <span>
                                You have to question {currQues[1].name}
                              </span>
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
                              {currQues[0].name} is questioning{" "}
                              {currQues[1].name}
                            </Alert>
                          ))}
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
              {end && nextRoundResFragToggle && (
                <CardHeader>
                  Another Round?
                  <Button
                    size="sm"
                    color="success"
                    className="ml-2"
                    onClick={this.onVoteNextRound.bind(this, false)}
                  >
                    Yes
                  </Button>
                  <Button
                    size="sm"
                    color="danger"
                    className="ml-2"
                    onClick={this.onVoteNextRound.bind(this, true)}
                  >
                    No
                  </Button>
                </CardHeader>
              )}
              {nextRoundResFrag && (
                <div className="progress" style={{ height: 2 + "px" }}>
                  <div
                    className="progress-bar"
                    role="progressbar"
                    style={{ width: ResFragProgress + "%" }}
                    aria-valuenow={ResFragProgress}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
              )}
              <CardBody className="overflow-auto h-100">
                {chat.map(({ name, msg, time, type }, idx) => (
                  <Message
                    name={name}
                    msg={msg}
                    time={time}
                    key={idx}
                    type={type}
                  />
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
                        <FontAwesomeIcon icon={faArrowRight} />
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
  error: state.error,
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
    clear_error,
    onNextRound,
  })
)(Chat);
