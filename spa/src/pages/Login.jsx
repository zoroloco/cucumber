//import { useContext } from "react";
//import AuthContext from "../context/auth-context";
import { Navigate } from "react-router-dom";
import Form from 'react-bootstrap/form';

export const Login = () => {
  //const ctx = useContext(AuthContext);

  return (
    <div>
      <Form>
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
      </Form>
    </div>
  );
};
