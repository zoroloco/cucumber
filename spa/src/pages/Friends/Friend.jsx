import React from "react";
import { Image, Button } from "react-bootstrap";
import { TiMinus, TiPlus } from "react-icons/ti";
import classes from "./Friend.module.css";

export const Friend = (props) => {
  const fullName = `${props.friend.__userProfile__.firstName} ${props.friend.__userProfile__.lastName}`;

  return (
    <div
      className={classes["friend-container"]}
      onClick={()=>props.chatWithFriendHandler(props.friend)}
    >
      <div className={classes["friend-image"]}>
        <Image
          src={`data:image/png;base64, ${props.friend.profilePhotoFile}`}
          alt={props.friend.username}
        />
      </div>
      <div className={classes["friend-info"]}>
        <h6>{fullName.trim().substring(0, 22)}</h6>
        <h6>{props.friend.username.trim().substring(0, 22)}</h6>
      </div>
      <div className={classes["friend-button"]}>
        {props.friend.isFriend ? (
          <Button
            variant="dark"
            size="sm"
            onClick={() => props.removeFriendHandler(props.friend.id)}
          >
            <TiMinus />
          </Button>
        ) : (
          <Button
            variant="dark"
            size="sm"
            onClick={() => props.addFriendHandler(props.friend.id)}
          >
            <TiPlus />
          </Button>
        )}
      </div>
    </div>
  );
};
