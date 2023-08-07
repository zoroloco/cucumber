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
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            Authorization: `Bearer ${ctx.accessToken}`,
          },
        }
      );

      const responseJson = await response.json();
      if (response.status === 200) {
        setProfilePhotoFile(responseJson);
      } else {
        console.error("Error communicating with server.");
      }
    };

    if (showContent) {
      fetchProfilePhotoFile();
    }
  }, [ctx.accessToken, showContent]);

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
          {showContent && (
            <Image
              src={`data:image/png;base64, ${profilePhotoFile}`}
              alt={ctx.user.username}
            />
          )}

          <Navbar.Brand
            className={classes["nav-brand-spacer"]}
            href={showContent ? "/home" : "/"}
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
              {!showContent && (
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
              {showContent && (
                <>
                  <Nav.Item>
                    <Nav.Link className={classes["nav-link"]} eventKey="logout">
                      [Sign Out]
                    </Nav.Link>
                  </Nav.Item>
                  {ctx.user.userRoles.includes("ROLE_CHAT") && (
                    <>
                      <Nav.Item>
                        <Nav.Link
                          className={classes["nav-link"]}
                          href="/friends"
                        >
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
                      <Nav.Link
                        className={classes["nav-link"]}
                        href="/user-admin"
                      >
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
