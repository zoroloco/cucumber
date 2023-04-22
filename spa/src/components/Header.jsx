import { useContext } from "react";
import { Container, Nav, Navbar, Card } from "react-bootstrap";
import classes from "./Header.module.css";
import { AuthContext } from "../context/auth-context";

const Header = () => {
  const ctx = useContext(AuthContext);

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
            <Nav
              onSelect={(selectedKey) => {
                if (selectedKey === "logout") {
                  ctx.onLogOut();
                }
              }}
            >
              {!ctx.loggedIn && (
                <Nav.Item>
                  <Nav.Link className={classes.navLink} href="/register">
                    [Sign Up]
                  </Nav.Link>
                </Nav.Item>
              )}
              {ctx.loggedIn && (
                <>
                  <Nav.Item>
                    <Nav.Link className={classes.navLink} eventKey="logout">
                      [Sign Out]
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link className={classes.navLink} href="/chat">
                      [Chat]
                    </Nav.Link>
                  </Nav.Item>
                </>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </Card.Header>
  );
};

export default Header;
