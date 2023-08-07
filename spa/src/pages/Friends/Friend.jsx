import { Image, Button } from "react-bootstrap";
import { TiPlus, TiMinus } from "react-icons/ti";

export const Friend = (props) => {
  const fullName = props.user.__userProfile__.firstName+' '+props.user.__userProfile__.lastName;

  return (
    <>
      <Image
        src={`data:image/png;base64, ${props.user.profilePhotoFile}`}
        alt={props.user.username}
      />
      <div>
        <h5>
          {fullName.trim().substring(0,19)}
        </h5>
        <span>{props.user.username.trim().substring(0,16)}</span>
      </div>

      {props.user.isFriend ? (
        <Button
          variant="dark"
          size="sm"
          onClick={() => props.removeFriendHandler(props.user.id)}
        >
          <TiMinus />
        </Button>
      ) : (
        <Button
          variant="dark"
          size="sm"
          onClick={() => props.addFriendHandler(props.user.id)}
        >
          <TiPlus />
        </Button>
      )}
    </>
  );
};
