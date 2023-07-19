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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [userRoleRefs, setUserRoleRefs] = useState([]);
  const [userRoles, setUserRoles] = useState([]);
  const searchRef = useRef();

  useEffect(() => {
    setShowContent(!isLoading);
  }, [isLoading]);

  useEffect(() => {
    const fetchUserRoleRefs = async () => {
      const response = await fetch(
        config.resourceServer + "/api/find-all-cached-user-role-refs",
        {
          method: "GET",
          mode: "cors",
          cache: "no-cache",
          credentials: "same-origin",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const responseJson = await response.json();
      if (response.status === 200) {
        setUserRoleRefs(
          responseJson.map((userRoleRef) => {
            //just map out the fields we need.
            return {
              id: userRoleRef.id,
              roleName: userRoleRef.roleName,
              roleLabel: userRoleRef.roleLabel,
              checked: false, //default
            };
          })
        );
      } else {
        console.error("Error communicating with server.");
      }
    };

    if (showContent) {
      searchRef.current.focus();
      fetchUserRoleRefs();
    }
  }, [accessToken, showContent]);

  /**
   * If searchQuery present then search by those params,
   * otherwise search all users.
   */
  const searchHandler = async () => {
    let response = null;

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
          searchQuery: searchQuery,
        }),
      }
    );

    const responseJson = await response.json();
    if (response.status === 201) {
      let urMap = []; //build up user roles data structure. key= user id, value = list of user role ref ids.
      const uniqueUsers = responseJson.reduce((acc, userRole) => {
        const { id, user, userRoleRef } = userRole;

        if (!urMap[user.id]) {
          let userRoleList = [];
          userRoleList.push(userRoleRef.id);
          urMap[user.id] = userRoleList;
        } else {
          let userRoleList = urMap[user.id];
          userRoleList.push(userRoleRef.id);
          urMap[user.id] = userRoleList;
        }

        const existingUser = acc.find((u) => u.id === user.id);
        if (!existingUser) {
          acc.push(user);
        }
        return acc;
      }, []);

      setUserRoles(urMap);
      setSearchResults(uniqueUsers);
    } else {
      console.error("Error communicating with server.");
    }
  };

  const clearHandler = () => {
    setSearchQuery("");
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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Container className="d-flex justify-content-center flex-wrap">
                <Button
                  variant="dark"
                  className="m-2"
                  disabled={
                    searchQuery.trim().length > 0 &&
                    searchQuery.trim().length < 3
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
                        <UserDetails
                          accessToken={accessToken}
                          user={user}
                          userRoleRefs={userRoleRefs.map((urr) => {
                            return {
                              ...urr,
                              checked: userRoles[user.id].some(
                                (id) => id === urr.id
                              ),
                            };
                          })}
                        />
                      </ListGroup.Item>
                    );
                  })}
                </ListGroup>
              ) : (
                <p className={styles.centerText}>No results found.</p>
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
