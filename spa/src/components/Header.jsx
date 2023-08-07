import { useContext } from "react";
import { Container, Nav, Navbar, Card, Image } from "react-bootstrap";
import classes from "./Header.module.css";
import { AuthContext } from "../context/auth-context";

const Header = () => {
  const ctx = useContext(AuthContext);

  return (
    <Card.Header className={classes["druidia-header"]}>
      <Navbar
        collapseOnSelect
        expand="lg"
        bg="dark"
        variant="dark"
        sticky="top"
      >
        <Container fluid>
          {ctx.loggedIn && (
            <Image
              src={`data:image/png;base64, ${ctx.user.profilePhotoFile}`}
              alt={ctx.user.username}
            />
          )}

          <Navbar.Brand
            className={classes["nav-brand-spacer"]}
            href={ctx.loggedIn ? "/home" : "/"}
          >
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
                <>
                  <Nav.Item>
                    <Nav.Link className={classes["nav-link"]} href="/register">
                      [Sign Up]
                    </Nav.Link>
                  </Nav.Item>

                  <Nav.Item>
                    <Nav.Link className={classes["nav-link"]} href="/login">
                      [Sign In]
                    </Nav.Link>
                  </Nav.Item>
                </>
              )}
              {ctx.loggedIn && (
                <>
                  <Nav.Item>
                    <Nav.Link className={classes["nav-link"]} eventKey="logout">
                      [Sign Out]
                    </Nav.Link>
                  </Nav.Item>
                  {ctx.user.userRoles.includes("ROLE_CHAT") && (
                    <>
                      <Nav.Item>
                        <Nav.Link className={classes["nav-link"]} href="/friends">
                          [Friends]
                        </Nav.Link>
                      </Nav.Item>

                      <Nav.Item>
                        <Nav.Link className={classes["nav-link"]} href="/chats">
                          [Chats]
                        </Nav.Link>
                      </Nav.Item>
                    </>
                  )}
                  {ctx.user.userRoles.includes("ROLE_USER_ADMIN") && (
                    <Nav.Item>
                      <Nav.Link className={classes["nav-link"]} href="/user-admin">
                        [User Admin]
                      </Nav.Link>
                    </Nav.Item>
                  )}
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
