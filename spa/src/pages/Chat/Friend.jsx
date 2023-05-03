import styles from "../../global.module.css";
import { Image, Button } from "react-bootstrap";
import classes from "./Friend.module.css";
import { TiPlus, TiMinus } from "react-icons/ti";

export const Friend = (props) => {
  return (
    <>
      <div className={classes.friendPhotoContainer}>
        <Image
          src={`data:image/png;base64, ${props.user.profilePhotoFile}`}
          alt={props.user.username}
          className={styles.roundImage}
          fluid
        />
      </div>

      <div className={classes.friendContent}>
        <div className="fw-bold">{props.user.username}</div>
        {props.user.__userProfile__.firstName}{" "}
        {props.user.__userProfile__.lastName}
      </div>

      <div className={classes.friendActionContainer}>
        {props.user.isFriend ? (
          <Button
            className={classes.friendActionButton}
            variant="dark"
            size="sm"
            onClick={() => props.removeFriendHandler(props.user.id)}
          >
            <TiMinus/>
          </Button>
        ) : (
          <Button
            className={classes.friendActionButton}
            variant="dark"
            size="sm"
            onClick={() => props.addFriendHandler(props.user.id)}
          >
            <TiPlus/>
          </Button>
        )}
      </div>
    </>
  );
};
