import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { Card } from "react-bootstrap";

const SiteTemplate = () => {
  return (
    <Card>
      <Header />

      <Card.Body>
        <Outlet />
      </Card.Body>

      <Footer />
    </Card>
  );
};
export default SiteTemplate;
