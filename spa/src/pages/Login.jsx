import { useState, useEffect, useRef } from "react";
import Form from "react-bootstrap/form";
import classes from "./Login.module.css";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";
import config from "../config";

export const Login = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const emailRef = useRef();

  useEffect(()=>{
    emailRef.current.focus();
  });

  useEffect(() => {
    if(null !== accessToken){
      localStorage.setItem("access-token", accessToken);
    }else{
      setAccessToken(localStorage.getItem("access-token"));
    }        
  }, [accessToken]);

  const loginHandler = async () => {
    const response = await fetch(config.resourceServer + "/api/login", {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      credentials: "same-origin",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: username, password: password }),
    });

    if (response.status === 201) {
      const responseJson = await response.json();
      setAccessToken(responseJson.access_token);
    }
  };

  return (
    <>
      {accessToken ? (
        <Navigate to="/" />
      ) : (
        <div
          className={
            classes.colorOverlay +
            " " +
            "d-flex justify-content-center align-items-center"
          }
        >
          <Form className="rounded p-4 p-sm-3">
            <Form.Group className="mb-3" controlId="formGroupEmail">
              <Form.Label>Email:</Form.Label>
              <Form.Control
                type="email"
                placeholder="Email"
                ref={emailRef}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="dark" size="lg" onClick={loginHandler}>
                [Log In]
              </Button>
            </div>
          </Form>
        </div>
      )}
    </>
  );
};
