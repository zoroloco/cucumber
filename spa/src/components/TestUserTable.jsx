import { useEffect, useState, useContext } from "react";
import TestUserRow from "./TestUserRow";
import Table from "react-bootstrap/Table";
import { useAuth0 } from "@auth0/auth0-react";
import AuthContext from "../context/auth-context";
import config from "../config";

const TestUserTable = () => {
  const [data, setData] = useState([]);
  const { isAuthenticated } = useAuth0();

  const ctx = useContext(AuthContext);

  useEffect(() => {
    if(isAuthenticated){
      fetch(config.resourceServer + "/test/users", {
        headers: {
          Authorization: `Bearer ${ctx.accessToken}`
        }
      }).then((response) => {
        response.json().then((responseJson) => {
          setData(responseJson);
        });
      });
    }
  }, [ctx, isAuthenticated]);

  return (
    <Table striped bordered hover variant='dark' size='sm'>
      <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
        </tr>
      </thead>
      <tbody>
        {data.map((user) => {
          return (
            <tr key={user.id}>
              <TestUserRow user={user} />
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default TestUserTable;
