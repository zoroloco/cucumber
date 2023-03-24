import TestUserTable from "../components/TestUserTable";
import { Container } from "react-bootstrap";
import { useAuth0 } from "@auth0/auth0-react";

const TestUsers = () => {
  const { isAuthenticated } = useAuth0();

  return (
    <>
    {isAuthenticated && 
      <Container fluid>
        <TestUserTable />
      </Container>
    }
    </>
  );
};

export default TestUsers;
