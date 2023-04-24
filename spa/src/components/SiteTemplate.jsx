import Header from "./Header";
import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import { Card } from "react-bootstrap";
import styles from "../global.module.css";

const SiteTemplate = () => {
  return (
    <div className={styles.mainDiv}>
    <Card style={{ backgroundColor: '#212529', color: 'white' }}>

      <Header />

      <Card.Body>
        <Outlet />
      </Card.Body>

      <Footer />
    </Card>
    </div>
  );
};
export default SiteTemplate;
