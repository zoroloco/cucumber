import { Card } from "react-bootstrap";
import classes from "./Footer.module.css";

const Footer = () => {
  return (
    <Card.Footer className={classes.druidiaFooter + " " + "text-muted"}>
      <p className={classes.textRight}>druidia.net - 2023</p>
    </Card.Footer>
  );
};
export default Footer;
