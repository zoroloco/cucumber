import { useState, useEffect, useRef, useContext } from "react";
import Form from "react-bootstrap/form";
import Alert from "react-bootstrap/Alert";
import classes from "../druidia.module.css";
import Button from "react-bootstrap/Button";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/auth-context";
import config from "../config";

export const Login = () => {
  const ctx = useContext(AuthContext);
  const [accessToken, setAccessToken] = useState(null);
  const [formState, setFormState] = useState({
    username: "",
    password: "",
    error: "",
  });

  const emailRef = useRef();

  useEffect(() => {
    if (
      ((null === formState.username || !formState.username.trim().length) &&
        (null === formState.password || !formState.password.trim().length)) ||
      formState.error
    ) {
      emailRef.current.focus();
    }
  }, [formState]);

  useEffect(() => {
    if (null !== accessToken) {
      ctx.onLogIn(accessToken);
    } else {
      setAccessToken(localStorage.getItem("access-token"));
    }
  }, [accessToken, ctx]);

  const loginHandler = async () => {
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
      setAccessToken(responseJson.access_token);
    } else {
      setFormState((prevFormState) => {
        return {
          ...prevFormState,
          error: responseJson.message,
        };
      });
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
                value={formState.username}
                onChange={(e) =>
                  setFormState((prevFormState) => {
                    return {
                      ...prevFormState,
                      username: e.target.value,
                      error: null,
                    };
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="formGroupPassword">
              <Form.Label>Password:</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={formState.password}
                onChange={(e) =>
                  setFormState((prevFormState) => {
                    return {
                      ...prevFormState,
                      password: e.target.value,
                      error: null,
                    };
                  })
                }
              />
            </Form.Group>
            <div className="d-grid gap-2">
              <Button variant="dark" size="lg" onClick={loginHandler}>
                [Log In]
              </Button>
            </div>
            {formState.error && (
              <div className="d-grid gap-2">
                <Alert className={classes.centerText} variant="danger">
                  {formState.error}
                </Alert>
              </div>
            )}
          </Form>
        </div>
      )}
    </>
  );
};
