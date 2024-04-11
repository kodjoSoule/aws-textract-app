import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';

const Header: React.FC = () => {
  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="#home">File Upload</Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="#home">Home</Nav.Link>
      </Nav>
    </Navbar>
  );
};
export default Header;
