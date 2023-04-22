import classes from "../druidia.module.css";
import { useReducer, useEffect, useRef, useState } from "react";
import Form from "react-bootstrap/form";
import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";
import config from "../config";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const redirectCountdownTime = 3;

const formReducer = (prevState, action) => {
  let newState = { ...prevState };

  if (action.type === "USERNAME_INPUT") {
    newState.username.isValid = false;
    if (!action.username.value.trim().length) {
      newState.validationMessage = "Please enter a username.";
    } else if (!emailRegex.test(action.username.value)) {
      newState.validationMessage = "Invalid email format.";
    } else {
      newState.validationMessage = null;
      newState.username.isValid = true;
    }

    newState.username.value = action.username.value;
  } else if (action.type === "USERNAME_BLUR") {
    newState.username.isValid = false;
    if (!prevState.username.value.trim().length) {
      newState.validationMessage = "Please enter a username.";
    } else if (!emailRegex.test(prevState.username.value)) {
      newState.validationMessage = "Invalid email format.";
    } else {
      newState.validationMessage = null;
      newState.username.isValid = true;
    }
  } else if (action.type === "PASSWORD_INPUT") {
    newState.password.isValid = false;
    if (action.password.value.trim().length < 10) {
      newState.validationMessage = "Password must be >10 characters.";
    } else if (action.password.value !== prevState.password2.value) {
      newState.validationMessage = "Passwords must match.";
    } else {
      newState.validationMessage = null;
      newState.password.isValid = true;
    }
    newState.password.value = action.password.value;
  } else if (action.type === "PASSWORD_BLUR") {
    newState.password.isValid = false;

    if (prevState.password.value.trim().length < 10) {
      newState.validationMessage = "Password must be >10 characters.";
    } else if (prevState.password.value !== prevState.password2.value) {
      newState.validationMessage = "Passwords must match.";
    } else {
      newState.validationMessage = null;
      newState.password.isValid = true;
      newState.password2.isValid = true;
    }
  } else if (action.type === "PASSWORD2_INPUT") {
    newState.password2.isValid = false;
    if (action.password2.value.trim().length < 10) {
      newState.validationMessage = "Password2 must be >10 character.";
    } else if (action.password2.value !== prevState.password.value) {
      newState.validationMessage = "Passwords must match.";
    } else {
      newState.validationMessage = null;
      newState.password2.isValid = true;
    }
    newState.password2.value = action.password2.value;
  } else if (action.type === "PASSWORD2_BLUR") {
    newState.password2.isValid = false;

    if (prevState.password2.value.trim().length < 10) {
      newState.validationMessage = "Password2 must be >10 character.";
    } else if (prevState.password2.value !== prevState.password.value) {
      newState.validationMessage = "Passwords must match.";
    } else {
      newState.validationMessage = null;
      newState.password.isValid = true;
      newState.password2.isValid = true;
    }
  } else if (action.type === "FIRST_NAME_INPUT") {
    newState.firstName.value = action.firstName.value;
  } else if (action.type === "LAST_NAME_INPUT") {
    newState.lastName.value = action.lastName.value;
  } else if (action.type === "REGISTRATION_ERROR") {
    newState.registrationValid = false;
    newState.validationMessage = action.validationMessage;
  } else if (action.type === "REGISTRATION_SUCCESSFUL") {
    newState.validationMessage = "Account Created";
    newState.registrationValid = true;
  }

  newState.formValid =
    newState.username.isValid &&
    newState.password.isValid &&
    newState.password2.isValid;

  return newState;
};

export const Register = () => {
  const [redirectCountdown, setRedirectCountdown] = useState(
    redirectCountdownTime
  );
  const [formState, dispatchForm] = useReducer(formReducer, {
    username: { value: "", isValid: false },
    password: { value: "", isValid: false },
    password2: { value: "", isValid: false },
    firstName: { value: "" },
    lastName: { value: "" },
    formValid: false,
    registationValid: false,
    validationMessage: null,
  });

  const usernameRef = useRef();

  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  useEffect(() => {
    if (formState.registrationValid) {
      const intervalId = setInterval(() => {
        setRedirectCountdown((redirectCountdown) => redirectCountdown - 1);
      }, 1000);

      return () => {
        clearInterval(intervalId);
      };
    }
  }, [formState.registrationValid]);

  const registerHandler = async (event) => {
    if (formState.formValid) {
      const response = await fetch(config.resourceServer + "/api/create-user", {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formState.username.value,
          password: formState.password.value,
        }),
      });

      const responseJson = await response.json();
      if (response.status === 201) {
        dispatchForm({
          type: "REGISTRATION_SUCCESSFUL",
        });
      } else {
        dispatchForm({
          type: "REGISTRATION_ERROR",
          validationMessage: responseJson.message,
        });
      }
    }
  };

  return (
    <>
      {!redirectCountdown ? (
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
                disabled={formState.registationValid}
                ref={usernameRef}
                value={formState.username.value}
                onChange={(event) => {
                  dispatchForm({
                    type: "USERNAME_INPUT",
                    username: { value: event.target.value },
                  });
                }}
                onBlur={() => {
                  dispatchForm({ type: "USERNAME_BLUR" });
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                disabled={formState.registationValid}
                value={formState.password.value}
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
            <Form.Group className="mb-3" controlId="formGroupPassword2">
              <Form.Label>Confirm Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                disabled={formState.registationValid}
                value={formState.password2.value}
                onChange={(event) => {
                  dispatchForm({
                    type: "PASSWORD2_INPUT",
                    password2: { value: event.target.value },
                  });
                }}
                onBlur={() => {
                  dispatchForm({ type: "PASSWORD2_BLUR" });
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupFirstName">
              <Form.Label>First Name:</Form.Label>
              <Form.Control
                type="input"
                placeholder="First Name"
                disabled={formState.registationValid}
                value={formState.firstName.value}
                onChange={(event) => {
                  dispatchForm({
                    type: "FIRST_NAME_INPUT",
                    firstName: { value: event.target.value },
                  });
                }}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupLastName">
              <Form.Label>Last Name:</Form.Label>
              <Form.Control
                type="input"
                placeholder="Last Name"
                disabled={formState.registationValid}
                value={formState.lastName.value}
                onChange={(event) => {
                  dispatchForm({
                    type: "LAST_NAME_INPUT",
                    lastName: { value: event.target.value },
                  });
                }}
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button
                variant="dark"
                size="lg"
                disabled={!formState.formValid || formState.registationValid}
                onClick={registerHandler}
              >
                [Register]
              </Button>
            </div>
            {formState.validationMessage && (
              <div className="d-grid gap-2">
                <Alert
                  className={classes.centerText}
                  variant={formState.registrationValid ? "primary" : "danger"}
                >
                  {formState.registrationValid
                    ? formState.validationMessage +
                      " Redirecting in " +
                      (redirectCountdown > 0 ? redirectCountdown : "0")
                    : formState.validationMessage}
                </Alert>
              </div>
            )}
          </Form>
        </div>
      )}
    </>
  );
};
