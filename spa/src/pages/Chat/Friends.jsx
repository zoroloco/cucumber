import { useState, useRef, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import styles from "../../global.module.css";
import ListGroup from "react-bootstrap/ListGroup";
import {Friend} from "./Friend";
import config from "../../config";
import classes from "./Friend.module.css";

export const Friends = (props) => {
  const [searchParam, setSearchParam] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const searchRef = useRef();

  useEffect(() => {
    searchRef.current.focus();
  }, []);

  const clearHandler = () => {
    setSearchResults([]);
    setSearchParam("");
  };

  const searchHandler = async () => {
    let response = null;

    if (searchParam && searchParam.trim().length > 3) {
      response = await fetch(
        config.resourceServer + "/api/find-users-by-search-params",
        {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${props.accessToken}`,
          },
          body: JSON.stringify({
            username: "NA",
            firstName: "NA",
            lastName: "NA",
            query: searchParam,
          }),
        }
      );
    } else {
      response = await fetch(config.resourceServer + "/api/find-all-users", {
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          Authorization: `Bearer ${props.accessToken}`,
        },
      });
    }

    const responseJson = await response.json();
    if (response.status === 201 || response.status === 200) {
      setSearchResults(responseJson);
      //console.info("Search found:" + JSON.stringify(responseJson));
    } else {
      console.error('Error communicating with server.');
    }
  };

  return (
    <div
      className={
        styles.colorOverlay +
        " " +
        "d-flex justify-content-center align-items-center"
      }
    >
      <Form className="rounded p-4 p-sm-3">
        <Form.Control
          type="search"
          placeholder="Search"
          className="me-2"
          aria-label="Search"
          ref={searchRef}
          value={searchParam}
          onChange={(e) => setSearchParam(e.target.value)}
        />
        <Container className="d-flex justify-content-center flex-wrap">
          <Button
            variant="dark"
            className="m-2"
            disabled={
              searchParam.trim().length > 0 && searchParam.trim().length < 3
            }
            size="lg"
            onClick={searchHandler}
          >
            Search
          </Button>
          <Button
            variant="dark"
            className="m-2"
            size="lg"
            onClick={clearHandler}
          >
            Clear
          </Button>
        </Container>

        {searchResults.length>0 ? (
          <ListGroup>
            {searchResults.map((user) => {
              return (
                <ListGroup.Item
                  className={classes.friendContainer}
                  key={user.id}
                >
                  <Friend user={user}/>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        ) : (
          <p className={styles.centerText}>I am sorry but it seems that you have no friends.</p>
        )}
      </Form>
    </div>
  );
};
