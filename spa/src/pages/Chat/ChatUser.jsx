import { Image, Col } from "react-bootstrap";
import classes from "./Chat.module.css";

export const ChatUser = (props) => {

  console.info('Here is props.user:'+JSON.stringify(props.user));

  return (
    <Col>
      <Image className={classes["chat-img"]}
        src={`data:image/png;base64, ${props.user.profilePhotoFile}`}
        alt={props.user.username}
      />      
    </Col>
  );
};
