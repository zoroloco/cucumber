import styles from "../global.module.css";
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

  newState.validationMessage = null;

  if (action.type === "USERNAME_INPUT") {
    newState.username.isValid = false;
    if (!action.username.value.trim().length) {
      newState.username.errMsg = "Please enter a username.";
    } else if (!emailRegex.test(action.username.value)) {
      newState.username.errMsg = "Invalid email format.";
    } else {
      newState.username.errMsg = null;
      newState.username.isValid = true;
    }

    newState.username.value = action.username.value;
  } else if (action.type === "USERNAME_BLUR") {
    newState.username.isValid = false;
    if (!prevState.username.value.trim().length) {
      newState.username.errMsg = "Please enter a username.";
    } else if (!emailRegex.test(prevState.username.value)) {
      newState.username.errMsg = "Invalid email format.";
    } else {
      newState.username.errMsg = null;
      newState.username.isValid = true;
    }
  } else if (action.type === "PASSWORD_INPUT") {
    newState.password.isValid = false;
    if (action.password.value.trim().length < 10) {
      newState.password.errMsg = "Password must be >10 characters.";
    } else if (action.password.value !== prevState.password2.value) {
      newState.password.errMsg = "Passwords must match.";
    } else {
      newState.password.errMsg = null;
      newState.password2.errMsg = null;
      newState.password.isValid = true;
      newState.password2.isValid = true;
    }
    newState.password.value = action.password.value;
  } else if (action.type === "PASSWORD_BLUR") {
    newState.password.isValid = false;

    if (prevState.password.value.trim().length < 10) {
      newState.password.errMsg = "Password must be >10 characters.";
    } else if (prevState.password.value !== prevState.password2.value) {
      newState.password.errMsg = "Passwords must match.";
    } else {
      newState.password.errMsg = null;
      newState.password2.errMsg = null;
      newState.password.isValid = true;
      newState.password2.isValid = true;
    }
  } else if (action.type === "PASSWORD2_INPUT") {
    newState.password2.isValid = false;
    if (action.password2.value.trim().length < 10) {
      newState.password2.errMsg  = "Password2 must be >10 character.";
    } else if (action.password2.value !== prevState.password.value) {
      newState.password2.errMsg  = "Passwords must match.";
    } else {
      newState.password2.errMsg  = null;
      newState.password.errMsg = null;
      newState.password.isValid = true;
      newState.password2.isValid = true;
    }
    newState.password2.value = action.password2.value;
  } else if (action.type === "PASSWORD2_BLUR") {
    newState.password2.isValid = false;

    if (prevState.password2.value.trim().length < 10) {
      newState.password2.errMsg  = "Password2 must be >10 character.";
    } else if (prevState.password2.value !== prevState.password.value) {
      newState.password2.errMsg  = "Passwords must match.";
    } else {
      newState.password2.errMsg  = null;
      newState.password.errMsg = null;
      newState.password.isValid = true;
      newState.password2.isValid = true;
    }
  } else if (action.type === "FIRST_NAME_INPUT") {
    newState.firstName.value = action.firstName.value;
  } else if (action.type === "LAST_NAME_INPUT") {
    newState.lastName.value = action.lastName.value;
  } else if (action.type === "MIDDLE_NAME_INPUT") {
    newState.middleName.value = action.middleName.value;
  } else if (action.type === "REGISTRATION_ERROR") {
    newState.registrationValid = false;
    newState.validationMessage = action.validationMessage;
  } else if (action.type === "REGISTRATION_SUCCESSFUL") {
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

  const [file, setFile] = useState(null);

  const [formState, dispatchForm] = useReducer(formReducer, {
    username: { value: "", isValid: false, errMsg: null },
    password: { value: "", isValid: false, errMsg: null},
    password2: { value: "", isValid: false, errMsg: null},
    firstName: { value: "" },
    middleName: { value: "" },
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
    const formData = new FormData();

    formData.append("file", file);
    //all the values below will be part of request body that will
    //become createUserDto on back-end.
    formData.append("username", formState.username.value);
    formData.append("password", formState.password.value);
    formData.append("firstName", formState.firstName.value);
    formData.append("middleName", formState.middleName.value);
    formData.append("lastName", formState.lastName.value);

    if (formState.formValid) {
      try {
        const response = await fetch(
          config.resourceServer + "/api/create-user",
          {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            body: formData,
          }
        );

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
      } catch (error) {
        console.error("Error encountered while creating new user:" + error);
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
            styles.colorOverlay +
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
            {!formState.username.isValid && formState.username.errMsg && (
              <div className="d-grid gap-2">
                <Alert
                  className={styles.centerText}
                  variant="danger"
                >
                  {formState.username.errMsg}
                </Alert>
              </div>
            )}
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
            {!formState.password.isValid && formState.password.errMsg && (
              <div className="d-grid gap-2">
                <Alert
                  className={styles.centerText}
                  variant="danger"
                >
                  {formState.password.errMsg}
                </Alert>
              </div>
            )}
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
            {!formState.password2.isValid && formState.password2.errMsg && (
              <div className="d-grid gap-2">
                <Alert
                  className={styles.centerText}
                  variant="danger"
                >
                  {formState.password2.errMsg}
                </Alert>
              </div>
            )}
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
            <Form.Group className="mb-3" controlId="formGroupMiddleName">
              <Form.Label>Middle Name:</Form.Label>
              <Form.Control
                type="input"
                placeholder="Middle Name"
                disabled={formState.registationValid}
                value={formState.middleName.value}
                onChange={(event) => {
                  dispatchForm({
                    type: "MIDDLE_NAME_INPUT",
                    middleName: { value: event.target.value },
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

            <Form.Group controlId="formFile">
              <Form.Label>Profile Image</Form.Label>
              <Form.Control
                type="file"
                onChange={(event) => {
                  setFile(event.target.files[0]);
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
            {formState.registationValid && (
              <div className="d-grid gap-2">
                <Alert className={styles.centerText} variant="primary">
                  "Account created. Redirecting in " +
                  {redirectCountdown > 0 ? redirectCountdown : "0"}
                </Alert>
              </div>
            )}
          </Form>
        </div>
      )}
    </>
  );
};
