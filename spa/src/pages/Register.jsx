import classes from "./Register.module.css";
import { useReducer, useEffect, useRef } from "react";
import Form from "react-bootstrap/form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";
import config from "../config";

const formReducer = (prevState, action) => {
  let newState = { ...prevState };

  if (action.type === "EMAIL_INPUT") {
    newState.email.isValid = action.email.value.includes("@");
    newState.email.value = action.email.value;
  } else if (action.type === "EMAIL_BLUR") {
    console.info("Email blur reducer event");
    newState.email.isValid = prevState.email.value.includes("@");
  } else if (action.type === "PASSWORD_INPUT") {
    newState.password.isValid = action.password.value.trim().length > 6;
    newState.password.value = action.password.value;
  } else if (action.type === "PASSWORD_BLUR") {
    console.info("Password blur reducer event");
    newState.password.isValid = prevState.password.value.trim().length > 6;
  }

  newState.formValid = newState.email.isValid && newState.password.isValid;

  return newState;
};

export const Register = () => {
  const [formState, dispatchForm] = useReducer(formReducer, {
    username: { value: "", isValid: false },
    password: { value: "", isValid: false },
    isRegistered: false,
    formValid: false,
  });

  const usernameRef = useRef();

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  const registerHandler = async (event) => {
    event.preventDefault();
    if (formState.formValid) {
      const response = await fetch(config.resourceServer + "/api/login", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formState.username,
          password: formState.password,
        }),
      });

      const responseJson = await response.json();
      if (response.status === 201) {
      } else {
       
      }
    }
  };

  return (
    <>
      {formState.isRegistered ? (
        <Navigate to="/login" />
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
                ref={usernameRef}
                value={formState.username}
                onChange={(event) => {
                  dispatchForm({
                    type: "EMAIL_INPUT",
                    email: { value: event.target.value },
                  });
                }}
                onBlur={() => {
                  dispatchForm({ type: "EMAIL_BLUR" });
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={formState.password}
                onChange={(event) => {
                  dispatchForm({
                    type: "PASSWORD_INPUT",
                    password: { value: event.target.value },
                  });
                }}
                onBlur={() => {
                  dispatchForm({ type: "PASSWORD_BLUR" });
                }}
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="dark" size="lg" onClick={registerHandler}>
                [Register]
              </Button>
            </div>
            {formState.error && (
              <div className="d-grid gap-2">
                <Alert variant="danger">{formState.error}</Alert>
              </div>
            )}
          </Form>
        </div>
      )}
    </>
  );
};
