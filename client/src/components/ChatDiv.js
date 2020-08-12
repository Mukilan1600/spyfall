import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { sendMsg } from "../redux/actions/SocketActions";
import Message from "./Message";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
} from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import ReactTooltip from "react-tooltip";

export class ChatDiv extends Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
    game: PropTypes.object.isRequired,
  };

  componentDidUpdate(prevProps) {
    const { nextRoundResFrag } = this.props.game;
    const { room_id } = this.props.socket;

    if (this.props.game.chat.length > prevProps.game.chat.length)
      this.scrollToBottom();

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
  }

  state = {
    nextRoundResFragToggle: false,
    ResFragProgress: 0,
    messgae: null,
  };

  scrollToBottom = () => {
    this.el.scrollIntoView({ behaviour: "smooth" });
  };

  onSubmitHandler = (e) => {
    e.preventDefault();
    const { message } = this.state;
    const { socket } = this.props.socket;
    if (message && message !== "") this.props.sendMsg(socket, message);
    this.setState({ message: "" });
  };

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onVoteNextRound = (value) => {
    const { socket, room_id } = this.props.socket;
    if (value) socket.emit("next_round_vote", room_id);
    this.setState({ nextRoundResFragToggle: false });
  };

  render() {
    const {
      end,
      chat,
      game_started,
      currQues,
      nextRoundResFrag,
    } = this.props.game;
    const { socket } = this.props.socket;
    const { nextRoundResFragToggle, ResFragProgress } = this.state;
    return (
      <Card className="chat_div border-1 border-secondary">
        {end && nextRoundResFragToggle && (
          <CardHeader className="bg-dark text-white border-0">
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
        <CardBody className="overflow-auto h-100 bg-black text-white border-0">
          {chat.map(({ name, msg, time, type }, idx) => (
            <Message name={name} msg={msg} time={time} key={idx} type={type} />
          ))}
          <div
            ref={(el) => {
              this.el = el;
            }}
          />
        </CardBody>
        <CardFooter className="bg-dark text-white border-0">
          <Form onSubmit={this.onSubmitHandler}>
            <InputGroup>
              <Input
                type="text"
                placeholder="Enter Message..."
                name="message"
                onChange={this.onChangeHandler}
                value={this.state.message}
                className="bg-dark text-white border-0"
              ></Input>
              <InputGroupAddon addonType="append">
                <span
                  data-tip="Wait for your turn"
                  data-tip-disable={
                    !(!game_started
                      ? false
                      : nextRoundResFrag ||
                        !currQues ||
                        (currQues[0].id !== socket.id &&
                          currQues[1].id !== socket.id))
                  }
                >
                  <Button
                    color="success"
                    type="submit"
                    disabled={
                      !game_started
                        ? false
                        : nextRoundResFrag ||
                          !currQues ||
                          (currQues[0].id !== socket.id &&
                            currQues[1].id !== socket.id)
                    }
                  >
                    <FontAwesomeIcon icon={faArrowRight} />
                  </Button>
                  <ReactTooltip effect="solid" />
                </span>
              </InputGroupAddon>
            </InputGroup>
          </Form>
        </CardFooter>
      </Card>
    );
  }
}

const mapStateToProps = (state) => ({ game: state.game, socket: state.socket });

const mapDispatchToProps = { sendMsg };

export default connect(mapStateToProps, mapDispatchToProps)(ChatDiv);
