import { useAuth0 } from "@auth0/auth0-react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState } from "react";
import Header from "./components/Header";
import Routes from "./components/Routes";
import AuthContext from "./context/auth-context";
import ErrorBoundary from "./components/ErrorBoundary";

export const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const { isLoading, user, getAccessTokenSilently } = useAuth0();

  const fetchToken = async () => {
    setAccessToken(await getAccessTokenSilently());
  };

  useEffect(() => {
    fetchToken();
  });

  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return (
    <ErrorBoundary>
      <AuthContext.Provider
        value={{
          accessToken: accessToken,
          user: user
        }}
      >
        <header>
          <Header />
        </header>
        <main>
          <Routes />
        </main>
      </AuthContext.Provider>
    </ErrorBoundary>
  );
};
export default App;
