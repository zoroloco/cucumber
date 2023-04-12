import { Container, Nav, Navbar } from "react-bootstrap";
import classes from "./Header.module.css";

const Header = () => {
  return (
    <>
      <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark' sticky='top'>
        <Container fluid>
          <Navbar.Brand className={classes.navBrandSpacer} href='/'>
            druidia.net
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />

          <Navbar.Collapse className='justify-content-end'>      
            
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
};

export default Header;
