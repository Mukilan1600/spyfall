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
} from "reactstrap";
import Message from "./Message";
import {
  sendMsg,
  recieveMsg,
  getRoomUsers,
  leaveRoom,
} from "../redux/actions/SocketActions";
import { withRouter } from "react-router-dom";

class Chat extends Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
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
  render() {
    const { chat, room_id, users } = this.props.socket;
    return (
      <Container fluid>
        <Row className="mt-3">
          <div className="col-4">
            <Card style={{ height: "40vh" }}>
              <CardHeader>Room ID: {room_id}</CardHeader>
              <CardBody className="overflow-auto">
                <ListGroup>
                  {users &&
                    users.map((user) => (
                      <ListGroupItem key={user.id}>{user.name}</ListGroupItem>
                    ))}
                </ListGroup>
              </CardBody>
            </Card>
            <Card style={{ height: "40vh" }}>
              <CardBody>Hello</CardBody>
            </Card>
          </div>
          <div className="col-8">
            <Card className="chat_div">
              <CardBody className="overflow-auto h-100">
                {chat.map(({ name, msg }) => (
                  <Message name={name} msg={msg} key={msg} />
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
});

export default compose(
  withRouter,
  connect(mapStateToProps, { sendMsg, recieveMsg, getRoomUsers, leaveRoom })
)(Chat);
