//import { useContext } from "react";
//import AuthContext from "../context/auth-context";
import { Navigate } from "react-router-dom";
import Form from "react-bootstrap/form";
import classes from "./Login.module.css";
import Button from "react-bootstrap/Button";
import config from "../config";

export const Login = () => {
  //const ctx = useContext(AuthContext);
  const formData = {
    username: 'bob@bob.net',
    password: 'bobbybobbgy'
  }

  const loginHandler = async() =>{
    const response = await fetch(config.resourceServer + "/api/login", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers:{
        "Content-Type": "application/json"
      },
      body: JSON.stringify(formData)
    });

    console.info(JSON.stringify(response.code));
  }

  return (
    <div
      className={classes.colorOverlay + " " + "d-flex justify-content-center align-items-center"}
    >
      <Form className="rounded p-4 p-sm-3">
        <Form.Group className="mb-3" controlId="formGroupEmail">
          <Form.Label>Email:</Form.Label>
          <Form.Control type="email" placeholder="Email" />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formGroupPassword">
          <Form.Label>Password:</Form.Label>
          <Form.Control type="password" placeholder="Password" />
        </Form.Group>
        <div className="d-grid gap-2">
          <Button variant="dark" size="lg" onClick={loginHandler}>
            [Log In]
          </Button>
        </div>
      </Form>
    </div>
  );
};
