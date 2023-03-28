import { useAuth0 } from "@auth0/auth0-react";
import { Container, Nav, Navbar } from "react-bootstrap";
import classes from "./Header.module.css";
import Loading from "./Loading";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";

const Header = () => {
  const { isAuthenticated, isLoading } = useAuth0();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      {isAuthenticated}
      <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark' sticky='top'>
        <Container fluid>
          <Navbar.Brand className={classes.navBrandSpacer} href='/'>
            druidia.net
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse className='justify-content-end'>
          {isAuthenticated &&
          <Nav className="me-auto">
            <Nav.Link href="/users">[Users]</Nav.Link>
          </Nav>}
            {isAuthenticated && <LogoutButton />}
            {!isAuthenticated && <LoginButton />}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
