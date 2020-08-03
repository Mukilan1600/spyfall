import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  initializeSocket,
  createRoom,
  joinRoom,
} from "../redux/actions/SocketActions";
import {
  Form,
  Input,
  Label,
  FormGroup,
  Container,
  Jumbotron,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Alert,
} from "reactstrap";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

class Home extends React.Component {
  static propTypes = {
    socket: PropTypes.object.isRequired,
  };

  componentDidMount() {
    const { socket } = this.props.socket;
    if (!socket) this.props.initializeSocket();
  }

  state = {
    name: "",
    id: "",
    room_id: "",
    createModal: false,
    joinModal: false,
    loading: null,
    error: null,
  };

  onJoinModalToggle = (e) =>
    this.setState({
      joinModal: !this.state.joinModal,
      error: false,
    });
  onCreateModalToggle = (e) =>
    this.setState({
      createModal: !this.state.createModal,
      error: false,
    });

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onCreateRoom = (e) => {
    e.preventDefault();
    const { name } = this.state;
    if (name !== "") {
      this.onCreateModalToggle();
      const { socket } = this.props.socket;
      this.props.createRoom(socket, name, this.props.history);
    } else {
      this.setState({
        error: "Name cannot be empty",
      });
    }
  };

  onJoinRoom = (e) => {
    e.preventDefault();
    const { name, room_id } = this.state;
    if (name === "" || room_id === "") {
      this.setState({ error: "Please enter all the fields" });
    } else {
      const { socket } = this.props.socket;
      this.props.joinRoom(socket, room_id, name, this.props.history);
    }
  };

  joinRoomModal = (modalIsOpen, error) => (
    <Modal toggle={this.onJoinModalToggle} isOpen={modalIsOpen} centered>
      <ModalHeader toggle={this.onJoinModalToggle}>Join room</ModalHeader>
      <Form>
        <ModalBody>
          <FormGroup>
            <Label for="name">What's your name?</Label>
            <Input
              type="text"
              placeholder="Name"
              id="name"
              name="name"
              onChange={this.onChangeHandler}
              autoFocus
            />
          </FormGroup>
          <FormGroup>
            <Label for="id">Enter the room ID</Label>
            <Input
              type="text"
              placeholder="#"
              id="id"
              name="room_id"
              onChange={this.onChangeHandler}
            />
          </FormGroup>
          {error && <Alert color="danger">{error}</Alert>}
        </ModalBody>
        <ModalFooter>
          <Button className="mr-2" onClick={this.onJoinModalToggle}>
            Cancel
          </Button>
          <Button className="ml-2" color="success" onClick={this.onJoinRoom}>
            Join room
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );

  createRoomModal = (modalIsOpen, error) => (
    <Modal toggle={this.onCreateModalToggle} isOpen={modalIsOpen} centered>
      <ModalHeader toggle={this.onCreateModalToggle}>Create a room</ModalHeader>
      <Form>
        <ModalBody>
          <FormGroup>
            <Label for="name">What's your name?</Label>
            <Input
              type="text"
              placeholder="Name"
              id="name"
              name="name"
              onChange={this.onChangeHandler}
              autoFocus
            />
          </FormGroup>
          {error && <Alert color="danger">{error}</Alert>}
        </ModalBody>
        <ModalFooter>
          <Button className="mr-2" onClick={this.onCreateModalToggle}>
            Cancel
          </Button>
          <Button className="ml-2" color="success" onClick={this.onCreateRoom}>
            Create room
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );

  SpinnerModal = (loading) => (
    <Modal isOpen={loading}>
      <ModalBody className="text-center">
        <Spinner className="m-4" />
      </ModalBody>
    </Modal>
  );

  render() {
    const { loading, joinModal, createModal, error } = this.state;
    return (
      <Container className="mt-3">
        {this.SpinnerModal(loading)}
        {this.joinRoomModal(joinModal, error)}
        {this.createRoomModal(createModal, error)}
        <Jumbotron className="text-center">
          <p className="display-4">Spyfall</p>
          <Button
            className="m-2"
            color="primary"
            name="createModal"
            onClick={this.onCreateModalToggle}
          >
            Create a room
          </Button>
          <Button
            className="m-2"
            color="success"
            name="joinModal"
            onClick={this.onJoinModalToggle}
          >
            Join a room
          </Button>
        </Jumbotron>
      </Container>
    );
  }
}

const mapStatetoProps = (state) => ({
  socket: state.socket,
});

export default compose(
  withRouter,
  connect(mapStatetoProps, {
    initializeSocket,
    createRoom,
    joinRoom,
  })
)(Home);
