import { useState, useRef, useEffect } from "react";
import { Form, Button, Container } from "react-bootstrap";
import styles from "../../global.module.css";
import ListGroup from "react-bootstrap/ListGroup";
import config from "../../config";

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
    const response = await fetch(
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

    const responseJson = await response.json();
    if (response.status === 201) {
      setSearchResults(responseJson);
      console.info("Search found:" + JSON.stringify(responseJson));
    } else {
      console.info("nada" + response.status);
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
        <Container className="d-flex justify-content-center flex-wrap flex-sm-column">
          <Button
            variant="dark"
            className="m-2"
            size="lg"
            onClick={clearHandler}
          >
            Clear
          </Button>
          <Button
            variant="dark"
            className="m-2"
            disabled={!searchParam || searchParam.trim().length < 3}
            size="lg"
            onClick={searchHandler}
          >
            Search
          </Button>
        </Container>

        {searchResults ? (
          <ListGroup>
            {searchResults.map((result) => {
              return (
                <ListGroup.Item className="d-flex justify-content-between align-items-start">
                  <img
                    src="path/to/image"
                    alt={result.username}
                    style={{
                      width: "30px",
                      height: "30px",
                      marginRight: "10px",
                    }}
                  />
                  <div className="ms-2 me-auto">
                    <div className="fw-bold">{result.username}</div>
                    {result.firstName} {result.lastName}
                  </div>
                </ListGroup.Item>
              );
            })}
          </ListGroup>
        ) : (
          <p>you have no friends</p>
        )}
      </Form>
    </div>
  );
};
