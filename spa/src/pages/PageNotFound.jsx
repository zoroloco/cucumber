import { Container } from "react-bootstrap";

const PageNotFound = (props) => {
  return (
    <Container fluid>
      <h1>Hey mister, Page no found.</h1>

      {props.type === '404' && <p>Page cannot be found.</p>}
    </Container>
  );
};

export default ErrorPage;
