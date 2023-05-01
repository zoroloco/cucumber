import styles from "../../global.module.css";
import {Image} from "react-bootstrap";
import classes from "./Friend.module.css";

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
        {props.user.userProfile.firstName} {props.user.userProfile.lastName}
      </div>
    </>
  );
};
