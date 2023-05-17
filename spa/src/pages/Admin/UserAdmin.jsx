import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/auth-context";
import { Form, Button, Container } from "react-bootstrap";
import config from "../../config";
import classes from "./UserAdmin.module.css";
import styles from "../../global.module.css";
import { TiZoom } from "react-icons/ti";
import ListGroup from "react-bootstrap/ListGroup";
import { UserDetails } from "./UserDetails";

export const UserAdmin = () => {
  const { accessToken, isLoading } = useContext(AuthContext);
  const [showContent, setShowContent] = useState(false);
  const [searchParam, setSearchParam] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userRoleRefLabels, setUserRoleRefLabels] = useState([]);
  const searchRef = useRef();

  useEffect(() => {
    setShowContent(!isLoading);
  }, [isLoading]);

  useEffect(()=>{
    const fetchUserRoleRefLabels = async () =>{
      const response = await fetch(
        config.resourceServer + "/api/find-all-user-role-refs",
        {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }
      );
  
      const responseJson = await response.json();
      if (response.status === 200) {
        setUserRoleRefLabels(responseJson);
      } else {
        console.error("Error communicating with server.");
      }
    }    

    if(showContent){
      searchRef.current.focus();
      fetchUserRoleRefLabels();
    }    
  },[accessToken, showContent])

  /**
   * If searchParam present then search by those params,
   * otherwise search all users.
   */
  const searchHandler = async () => {
    let response = null;

    if (searchParam && searchParam.trim().length > 3) {
      response = await fetch(
        config.resourceServer + "/api/find-all-user-roles-heavy-by-search-params",
        {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            username: "NA",
            firstName: "NA",
            lastName: "NA",
            query: searchParam,
          })
        }
      );
    }

    const responseJson = await response.json();
    if (response.status === 201) {
      const uniqueUsers = responseJson.reduce((acc, userRole)=>{
        const { id, user } = userRole;
        const existingUser = acc.find(u=>u.id === user.id);
        if(!existingUser){
          acc.push(user);
        }
        return acc;
      },[]);

      setSearchResults(uniqueUsers);
    } else {
      console.error("Error communicating with server.");
    }
  };

  const clearHandler = () => {
    setSearchParam('');
    setSearchResults([]);
  };

  return (
    <div>
      {showContent ? (
        <>
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
                placeholder="Search All Users"
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
                    searchParam.trim().length > 0 &&
                    searchParam.trim().length < 3
                  }
                  size="lg"
                  onClick={searchHandler}
                >
                  Search
                  <TiZoom />
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

              {searchResults.length > 0 ? (
                <ListGroup className={classes.listGroup}>
                  {searchResults.map((user) => {
                    return (
                      <ListGroup.Item
                        className={classes.listGroupItem}
                        key={user.id}
                      >
                        <UserDetails user={user} userRoleRefLabels={userRoleRefLabels}/>
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              ) : (
                <p className={styles.centerText}>
                  No results found.
                </p>
              )}
            </Form>
          </div>
        </>
      ) : (
        <div>Please wait...</div>
      )}
    </div>
  );
};
