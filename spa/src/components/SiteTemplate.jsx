import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { Card } from "react-bootstrap";

const SiteTemplate = () => {
  return (
    <Card>
      <Card.Header>
        <header>
          <Header />
        </header>
      </Card.Header>
      <Card.Body>
        <main>
          <Outlet />
        </main>
      </Card.Body>
      <Card.Footer>
        <Footer />
      </Card.Footer>
    </Card>
  );
};
export default SiteTemplate;
