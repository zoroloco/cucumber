import Header from "./Header";
import { Outlet } from "react-router-dom";
import { Card } from "react-bootstrap";
import '../App.css';

const SiteTemplate = () => {
  return (
    <div className={'main-div'}>
      <Card style={{ backgroundColor: "#212529", color: "white" }}>
        <Header />

        <Card.Body>
          <Outlet />
        </Card.Body>

      </Card>
    </div>
  );
};
export default SiteTemplate;
