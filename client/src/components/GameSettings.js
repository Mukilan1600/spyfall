import React, { Component } from "react";
import {
  Modal,
  ModalHeader,
  ModalFooter,
  Button,
  Input,
  ModalBody,
  Form,
  FormGroup,
  Label,
} from "reactstrap";

export class GameSettings extends Component {
  componentDidUpdate(prevrpops) {
    const { round_time } = this.props.game;
    if (prevrpops.game.round_time !== round_time) this.setState({ round_time });
  }

  state = {
    round_time: null,
  };

  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onSubmit = (e) => {
    e.preventDefault();
    const { socket, onModalToggle, room_id } = this.props;
    const { round_time } = this.state;
    socket.emit("game_change", { round_time }, room_id);
    onModalToggle("settingsModal");
  };

  render() {
    const { game, onModalToggle, isModalOpen } = this.props;
    return (
      <Modal
        isOpen={isModalOpen}
        toggle={onModalToggle.bind(this, "settingsModal")}
        centered
      >
        <ModalHeader
          toggle={onModalToggle.bind(this, "settingsModal")}
          className="bg-dark text-white border-0"
        >
          GameSettings
        </ModalHeader>
        <Form onSubmit={this.onSubmit}>
          <ModalBody className="bg-black text-white border-0">
            <FormGroup>
              <Label for="round_time">Duration</Label>
              <Input
                onChange={this.onChange}
                id="round_time"
                name="round_time"
                placeholder="Duration"
                type="number"
                min={8}
                max={40}
                className="bg-dark text-white border-0"
                defaultValue={game.round_time}
              />
            </FormGroup>
          </ModalBody>
          <ModalFooter className="bg-dark text-white border-0">
            <Button type="submit" color="success">
              Save changes
            </Button>
            <Button onClick={onModalToggle.bind(this, "settingsModal")}>
              Cancel
            </Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

export default GameSettings;
