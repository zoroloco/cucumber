import { useContext, useEffect, useState } from "react";
import { Container, Nav, Navbar, Card, Image } from "react-bootstrap";
import classes from "./Header.module.css";
import { AuthContext } from "../context/auth-context";
import config from "../config";

const Header = () => {
  const ctx = useContext(AuthContext);
  const [showContent, setShowContent] = useState(false);
  const [profilePhotoFile, setProfilePhotoFile] = useState(null);

  useEffect(() => {
    setShowContent(!ctx.isLoading);
  }, [ctx.isLoading]);

  useEffect(() => {
    const fetchProfilePhotoFile = async () => {
      const response = await fetch(
        config.resourceServer + "/api/find-user-profile-photo-for-user",
        {
          method: "GET",
          mode: "cors",
          cache: "default",
          credentials: "same-origin",
          headers: {
            Authorization: `Bearer ${ctx.accessToken}`,
          },
        }
      );

      if (response.ok) {
        const profilePhotoFileStr = await response.text();
        setProfilePhotoFile(profilePhotoFileStr);
      } else {
        console.error("Error communicating with server.");
      }
    };

    if (showContent && ctx.loggedIn) {
      fetchProfilePhotoFile();
    }
  }, [ctx.accessToken, showContent, ctx.loggedIn]);

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
            <Nav.Item>
              <Nav.Link className={classes["nav-link"]} href="/user-profile">
                <Image
                  className={classes["header-profile-img"]}
                  src={`data:image/png;base64, ${profilePhotoFile}`}
                  alt={ctx.user.username}
                />
              </Nav.Link>
            </Nav.Item>
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
                  {ctx.user.userRoles.includes("ROLE_USER_ADMIN") && (
                    <Nav.Item>
                      <Nav.Link
                        className={classes["nav-link"]}
                        href="/user-admin"
                      >
                        [User Admin]
                      </Nav.Link>
                    </Nav.Item>
                  )}
                  <Nav.Item>
                    <Nav.Link className={classes["nav-link"]} eventKey="logout">
                      [Sign Out]
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
