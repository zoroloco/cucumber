import { Image } from "react-bootstrap";
import { Container } from "react-bootstrap";
import { UserDetailsRole } from "./UserDetailsRole";

export const UserDetails = (props) => {
  const fullName =
    props.user.__userProfile__.firstName +
    " " +
    props.user.__userProfile__.lastName;

  return (
    <Container>
      <Image
        src={`data:image/png;base64, ${props.user.profilePhotoFile}`}
        alt={props.user.username}
      />
      <div>
        <h5>{fullName.trim()}</h5>
        <span>ID:{props.user.id}</span>
        <span>{props.user.username.trim()}</span>
      </div>
      <div key="reverse-switch" className="mb-3">
        {props.userRoleRefs.map((userRoleRef, i) => (
          <UserDetailsRole
            key={i}
            userId={props.user.id}
            userRoleRef={userRoleRef}
            accessToken={props.accessToken}
          />
        ))}
      </div>
    </Container>
  );
};
