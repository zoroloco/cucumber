import { Container, Nav, Navbar, Card } from "react-bootstrap";
import classes from "./Header.module.css";

const Header = () => {
  return (
    <Card.Header className={classes.druidiaHeader}>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        sticky="top"
      >
        <Container fluid>
          <Navbar.Brand className={classes.navBrandSpacer} href="/">
            [druidia.net]
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse className="justify-content-end">
            <Nav.Item>
              <Nav.Link className={classes.navLink} href="/register">Sign Up</Nav.Link>
            </Nav.Item>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Card.Header>
  );
};

export default Header;
