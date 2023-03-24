import { Container } from "react-bootstrap";

const ErrorPage = (props) => {
  return (
    <Container fluid>
      <h1>to err is to be human</h1>

      {props.type === '404' && <p>Page cannot be found.</p>}
    </Container>
  );
};

export default ErrorPage;
