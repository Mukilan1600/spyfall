import React, { Component } from "react";
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
import { withSocket } from "./SocketContext";
import Message from "./Message";
import { withRouter } from "react-router-dom";

class Chat extends Component {
  scrollToBottom = () => {
    this.el.scrollIntoView({ behaviour: "smooth" });
  };
  componentDidMount() {
    try {
      const { socket } = this.props;
      const room_id = this.props.match.params.id;
      const name = this.props.location.state.name;

      socket.emit("join_room", room_id, name);

      socket.on("recieve_msg", (msg) => {
        this.setState({
          chat: [...this.state.chat, msg],
        });
      });

      socket.on("room_users", (users) => {
        if (users) this.setState({ users });
      });

      this.setState({
        socket,
        name,
        room_id,
      });
    } catch (err) {
      this.props.history.push("/");
    }
  }

  state = {
    users: [],
    chat: [],
    message: "",
    socket: null,
  };

  componentDidUpdate() {
    this.scrollToBottom();
  }

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };
  onSubmitHandler = (e) => {
    e.preventDefault();
    const { socket, message } = this.state;
    socket.emit("send_msg", message);
    this.setState({ message: "" });
  };
  render() {
    const { users, chat, room_id } = this.state;
    return (
      <Container fluid>
        <Row className="mt-3">
          <div className="col-4">
            <Card style={{ height: "40vh" }}>
              <CardHeader>Room ID: {room_id}</CardHeader>
              <CardBody className="overflow-auto">
                <ListGroup>
                  {users.map((user) => (
                    <ListGroupItem>{user.name}</ListGroupItem>
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

export default withSocket(withRouter(Chat));
