import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import {
  initializeSocket,
  createRoom,
  joinRoom,
} from "../redux/actions/SocketActions";
import { clear_error, get_error } from "../redux/actions/ErrorActions";
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
    error: PropTypes.object.isRequired,
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
    errorModal: false,
    loading: null,
    error: null,
  };

  componentDidUpdate() {
    const { error } = this.props.error;
    const { errorModal } = this.state;
    if (error && error.priority === 1 && !errorModal)
      this.setState({ errorModal: true });
  }
  onModalToggle = (id) => {
    this.setState({
      [id]: !this.state[id],
    });
    this.props.clear_error();
  };

  onChangeHandler = (e) => {
    this.setState({
      [e.target.name]: e.target.value,
    });
  };

  onCreateRoom = (e) => {
    e.preventDefault();
    const { name } = this.state;
    if (name !== "") {
      this.onModalToggle("createModal");
      const { socket } = this.props.socket;
      this.props.createRoom(socket, name, this.props.history);
    } else {
      this.props.get_error("Name cannot be empty");
    }
  };

  onJoinRoom = (e) => {
    e.preventDefault();
    const { name, room_id } = this.state;
    if (name === "" || room_id === "") {
      this.props.get_error("Please enter all the fields");
    } else {
      const { socket } = this.props.socket;
      this.props.joinRoom(socket, room_id, name, this.props.history);
    }
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

  joinRoomModal = (modalIsOpen, error) => (
    <Modal
      toggle={this.onModalToggle.bind(this, "joinModal")}
      isOpen={modalIsOpen}
      centered
    >
      <ModalHeader toggle={this.onModalToggle.bind(this, "joinModal")}>
        Join room
      </ModalHeader>
      <Form onSubmit={this.onJoinRoom}>
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
          {error && error.priority === 0 && (
            <Alert color="danger">{error.msg}</Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            className="mr-2"
            onClick={this.onModalToggle.bind(this, "joinModal")}
          >
            Cancel
          </Button>
          <Button className="ml-2" color="success" type="submit">
            Join room
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );

  createRoomModal = (modalIsOpen, error) => (
    <Modal
      toggle={this.onModalToggle.bind(this, "createModal")}
      isOpen={modalIsOpen}
      centered
    >
      <ModalHeader toggle={this.onModalToggle.bind(this, "createModal")}>
        Create a room
      </ModalHeader>
      <Form onSubmit={this.onCreateRoom}>
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
          {error && error.priority === 0 && (
            <Alert color="danger">{error.msg}</Alert>
          )}
        </ModalBody>
        <ModalFooter>
          <Button
            className="mr-2"
            onClick={this.onModalToggle.bind(this, "createModal")}
          >
            Cancel
          </Button>
          <Button className="ml-2" color="success" type="submit">
            Create room
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );

  SpinnerModal = (loading) => (
    <Modal isOpen={loading} centered>
      <ModalBody className="text-center">
        <Spinner className="m-4" />
      </ModalBody>
    </Modal>
  );

  render() {
    const { joinModal, createModal, errorModal } = this.state;
    const { isLoading } = this.props.socket;
    const { error } = this.props.error;
    return (
      <Container className="vertical-center">
        {this.SpinnerModal(isLoading)}
        {this.joinRoomModal(joinModal, error)}
        {this.createRoomModal(createModal, error)}
        {error && this.popupErrorModal(errorModal, error)}
        <Jumbotron className="text-center mx-auto">
          <p className="display-4">Spyfall</p>
          <Button
            className="m-2"
            color="primary"
            name="createModal"
            onClick={this.onModalToggle.bind(this, "createModal")}
          >
            Create a room
          </Button>
          <Button
            className="m-2"
            color="success"
            name="joinModal"
            onClick={this.onModalToggle.bind(this, "joinModal")}
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
  error: state.error,
});

export default compose(
  withRouter,
  connect(mapStatetoProps, {
    initializeSocket,
    createRoom,
    joinRoom,
    clear_error,
    get_error,
  })
)(Home);
