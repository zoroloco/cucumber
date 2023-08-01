import { Container, Row, Col } from "react-bootstrap";
import {ConversationUser} from './ConverstationUser';

export const Conversation = (props) => {

  return (
    <Container>
      <Row>
        <Col>{props.chat.name} </Col>
        {props.chat.chatUsers.map((chatUser) => (
          <ConversationUser
            key={chatUser.id}
            user={chatUser.__user__}
          />
        ))}
      </Row>          
    </Container>
  );
};
