import { Container, Row } from "react-bootstrap";
import { ChatUser } from "./ChatUser";
import { useNavigate } from "react-router-dom";
import classes from "./Chat.module.css";

export const Chat = (props) => {
  const navigate = useNavigate();

  const chatClickHandler = () => {
    navigate("/conversation/" + props.chat.id);
  };

  return (
    <Container onClick={chatClickHandler}>
      <div className={classes["chat-name"]}>{props.chat.name}</div>
      <Row>
        {props.chat.chatUsers.map((chatUser) => (
          <ChatUser key={chatUser.id} user={chatUser.__user__} />
        ))}
      </Row>
    </Container>
  );
};
