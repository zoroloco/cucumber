import { useContext, useEffect, useState } from "react";
import config from "../../config";
import { AuthContext } from "../../context/auth-context";

export const Teams = () => {
  const { accessToken, loggedIn, isLoading } = useContext(AuthContext);
  const { teams, setTeams } = useContext([]);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setShowContent(!isLoading);
  }, [isLoading]);

  useEffect(() => {
    const fetchProfilePhotoFile = async () => {
      const response = await fetch(config.resourceServer + "/api/find-teams", {
        method: "GET",
        mode: "cors",
        cache: "default",
        credentials: "same-origin",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.ok) {
        setTeams(response.data);
      } else {
        console.error("Error communicating with server.");
      }
    };

    if (showContent && loggedIn) {
      fetchProfilePhotoFile();
    }
  }, [accessToken, loggedIn, setTeams, showContent]);

  return (
    <div>
      {showContent ? (
        <div>{JSON.stringify(teams)}</div>
      ) : (
        <div>Please wait...</div>
      )}
    </div>
  );
};
