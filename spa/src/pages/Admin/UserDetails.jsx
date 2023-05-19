import { Image } from "react-bootstrap";
import { Form, Container } from "react-bootstrap";
import classes from "./UserAdmin.module.css";

export const UserDetails = (props) => {
  const fullName =
    props.user.__userProfile__.firstName +
    " " +
    props.user.__userProfile__.lastName;

    const checked = true;

  return (
    <Container>
      <Image
        src={`data:image/png;base64, ${props.user.profilePhotoFile}`}
        alt={props.user.username}
      />
      <div className={classes.userInfo}>
        <h5>{fullName.trim()}</h5>
        <span>ID:{props.user.id}</span>
        <span>{props.user.username.trim()}</span>
      </div>
      <div key="reverse-switch" className="mb-3">
        {props.userRoleRefs.map((userRoleRef,i) => {
          console.info(userRoleRef);
          return <Form.Check key={i} checked={userRoleRef.checked} reverse type="switch" label={userRoleRef.roleLabel} />;
        })}
      </div>
    </Container>
  );
};
