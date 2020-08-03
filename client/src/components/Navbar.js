import React from "react";
import { Navbar, NavbarBrand } from "reactstrap";

const NavbarDiv = (props) => {
  return (
    <Navbar color="dark" dark expand="md">
      <NavbarBrand href="/">Spyfall</NavbarBrand>
    </Navbar>
  );
};

export default NavbarDiv;
