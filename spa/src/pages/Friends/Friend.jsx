import { Image, Button } from "react-bootstrap";
import { TiPlus, TiMinus } from "react-icons/ti";
import classes from "./Friend.module.css";

export const Friend = (props) => {
  const fullName =
    props.user.__userProfile__.firstName +
    " " +
    props.user.__userProfile__.lastName;

  return (
    <>
      <Image
        src={`data:image/png;base64, ${props.user.profilePhotoFile}`}
        alt={props.user.username}
      />
      <div>
        <h6>{fullName}</h6>
        <span>{props.user.username}</span>
      </div>

      {props.user.isFriend ? (
        <Button className={classes["friend-button"]}
          variant="dark"
          size="sm"
          onClick={() => props.removeFriendHandler(props.user.id)}
        >
          <TiMinus />
        </Button>
      ) : (
        <Button className={classes["friend-button"]}
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
