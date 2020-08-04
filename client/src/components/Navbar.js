import React from "react";
import { Navbar, NavbarBrand, NavItem, Button } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserSecret } from "@fortawesome/free-solid-svg-icons";
import { connect } from "react-redux";
import Timer from "react-compound-timer";

const NavbarDiv = (props) => {
  const { game_started } = props.game;
  return (
    <Navbar color="dark" dark expand="md">
      <NavbarBrand href="/">
        <FontAwesomeIcon icon={faUserSecret} className="mr-1" />
        Spyfall
      </NavbarBrand>
      {game_started && (
        <NavItem className="ml-auto">
          <Timer initialTime={8 * 60 * 1000} direction="backward">
            {() => (
              <Button disabled color="info">
                <Timer.Minutes />:
                <Timer.Seconds />
              </Button>
            )}
          </Timer>
        </NavItem>
      )}
    </Navbar>
  );
};

const mapStateToProps = (state) => ({
  game: state.game,
});

export default connect(mapStateToProps)(NavbarDiv);
