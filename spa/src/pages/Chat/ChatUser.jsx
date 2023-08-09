import { Image, Col } from "react-bootstrap";

export const ChatUser = (props) => {
  return (
    <Col>
      <Image        
        src={`data:image/png;base64, ${props.user.profilePhotoFile}`}
        alt={props.user.username}
      />
    </Col>
  );
};
