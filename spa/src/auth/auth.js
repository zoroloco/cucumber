import config from "../config";

const isAuth = async () => {
  const accessToken = localStorage.getItem("access-token");
  if (!accessToken) {
    return false;
  }

  try {
    fetch(config.resourceServer + "/validate-token", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((response) => {
        return response.ok === true;
    });
  } catch (error) {
    console.log(error);
    return false;
  }
};

export default isAuth;
