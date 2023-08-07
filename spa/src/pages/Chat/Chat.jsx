import { Container, Row, Col } from "react-bootstrap";
import { ChatUser } from "./ChatUser";
import { useNavigate } from "react-router-dom";
import classes from "./Chat.module.css";

export const Chat = (props) => {
  const navigate = useNavigate();

  const chatClickHandler = () => {
    navigate("/conversation/" + props.chat.id);
  };

  return (
    <Container>
      <Row className="clickable-row">
        <Col className={classes["chat-col"]}>{props.chat.name} </Col>
      </Row>
      <Row className="clickable-row" onClick={chatClickHandler}>
        {props.chat.chatUsers.map((chatUser) => (
          <ChatUser key={chatUser.id} user={chatUser.__user__} />
        ))}
      </Row>
    </Container>
  );
};
