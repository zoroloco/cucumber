import { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../../context/auth-context";
import { Form, Button, Container } from "react-bootstrap";
import styles from "../../global.module.css";
import ListGroup from "react-bootstrap/ListGroup";
import { Friend } from "./Friend";
import config from "../../config";
import { TiZoom } from "react-icons/ti";

export const Friends = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [friends, setFriends] = useState([]);
  const searchRef = useRef();
  const { accessToken, user, isLoading } = useContext(AuthContext);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(!isLoading);
  }, [isLoading]);

  /**
   * set focus to search field and load any existing friends, if any.
   */
  useEffect(() => {
    async function loadFriends() {      
      const response = await fetch(
        `${config.resourceServer}/api/find-user-associations-by-user`,
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
        setSearchResults(
          responseJson.map((f) => {
            f.isFriend = true;
            return f;
          })
        );
        setFriends(responseJson);
      } else {
        console.error("Error communicating with server.");
      }
    }

    if(showContent){
      searchRef.current.focus();
      loadFriends();
    }    
  }, [accessToken, showContent]);

  /**
   * clear search field and reset list to just existing friends, if any.
   */
  const clearHandler = () => {
    setSearchQuery("");
    setSearchResults(
      friends.map((f) => {
        f.isFriend = true;
        return f;
      })
    );
  };

  /**
   * If searchQuery present then search by those params,
   * otherwise search all users.
   */
  const searchHandler = async () => {
    let response = null;

    if (searchQuery && searchQuery.trim().length > 3) {
      response = await fetch(
        config.resourceServer + "/api/find-users-by-search-params",
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
    } else {
      response = await fetch(config.resourceServer + "/api/find-all-users", {
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
    }

    const responseJson = await response.json();
    if (response.status === 201 || response.status === 200) {
      //flag the search results as friend or foe
      setSearchResults(
        responseJson
          .map((r) => {
            const isFriend = friends.some((f) => f.id === r.id);
            return {
              ...r,
              isFriend,
            };
          })
          .filter((r) => r.id !== user.id) //filter out yourself.
      );
    } else {
      console.error("Error communicating with server.");
    }
  };

  /**
   * ADD FRIEND
   * @param {} associateUserId
   */
  const addFriendHandler = async (associateUserId) => {
    console.info("Adding friend with ID:" + associateUserId);

    const response = await fetch(
      config.resourceServer + "/api/create-user-association",
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
          userId: associateUserId
        }),
      }
    );

    const responseJson = await response.json();
    if (response.status === 201 || response.status === 200) {
      console.info("Successfully made a frend!");
      setFriends((prevFriends) => [
        ...prevFriends,
        ...searchResults.filter((r) => r.id === responseJson.associate.id),
      ]);

      //now traverse the search results and update the friends flag
      setSearchResults(
        searchResults.map((r) => {
          const isFriend =
            friends.some((f) => {
              return f.id === r.id;
            }) || responseJson.associate.id === r.id;
          return {
            ...r,
            isFriend,
          };
        })
      );
    }
  };

  const removeFriendHandler = async (associateUserId) => {
    console.info("Removing friend with ID:" + associateUserId);

    const response = await fetch(
      config.resourceServer + "/api/remove-user-association",
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
          userId: associateUserId
        }),
      }
    );

    const responseJson = await response.json();
    if (response.status === 201 || response.status === 200) {
      console.info("Successfully lost a frend!");
      setFriends((prevFriends) => [
        ...prevFriends.filter((r) => r.id !== responseJson.associate.id),
      ]);

      setSearchResults(
        searchResults.map((r) => {
          const isFriend = friends.some((f) => {
            return f.id === r.id && responseJson.associate.id !== r.id;
          });
          return {
            ...r,
            isFriend,
          };
        })
      );
    }
  };

  return (
    <div>
      {showContent ? (
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
                  searchQuery.trim().length > 0 && searchQuery.trim().length < 3
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
                Friends
              </Button>
            </Container>

            {searchResults.length > 0 ? (
              <ListGroup className={styles.listGroup}>
                {searchResults.map((user) => {
                  return (
                    <ListGroup.Item
                      className={styles.listGroupItem}
                      key={user.id}
                    >
                      <Friend
                        user={user}
                        addFriendHandler={addFriendHandler}
                        removeFriendHandler={removeFriendHandler}
                      />
                    </ListGroup.Item>
                  );
                })}
              </ListGroup>
            ) : (
              <p className={styles.centerText}>
                I am sorry, but it seems that you have no friends.
              </p>
            )}
          </Form>
        </div>
      ) : (
        <div>Please wait...</div>
      )}
    </div>
  );
};
