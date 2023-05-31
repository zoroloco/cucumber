import { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import config from "../../config";

export const UserDetailsRole = (props) => {
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(props.userRoleRef.checked);
  }, [props.userRoleRef.checked]);

  const userRoleToggleHandler = async (e) => {
    console.info(
      "something " +
        checked +
        " for user:" +
        props.userId +
        " and user role ref ID:" +
        props.userRoleRef.roleLabel
    );
    setChecked(!checked); //toggle

    const response = await fetch(
      config.resourceServer + "/api" + (!checked ? "/create-user-role" : "/remove-user-role"),
      {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${props.accessToken}`,
        },
        body: JSON.stringify({
          userId: props.userId,
          userRoleRefId: props.userRoleRef.id,
        }),
      }
    );

    if (response.status !== 201) {
      console.error("Error saving user role.");
      setChecked(!checked); //revert
    }
  };

  return (
    <Form.Check
      checked={checked}
      reverse
      type="switch"
      onChange={userRoleToggleHandler}
      label={props.userRoleRef.roleLabel}
    />
  );
};
