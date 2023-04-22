import { Container } from "react-bootstrap";

export const ErrorPage = (props) => {
  return (
    <Container fluid>
      <h1>to err is to be human. to really foul things up takes a computer.</h1>

      {props.type === "404" && <p>Page cannot be found.</p>}
    </Container>
  );
};
