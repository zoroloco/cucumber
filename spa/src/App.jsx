import "bootstrap/dist/css/bootstrap.min.css";
import router from "./components/Routes";
import AuthContext from "./context/auth-context";
import ErrorBoundary from "./components/ErrorBoundary";
import { RouterProvider } from "react-router-dom";

export const App = () => {
  return (
    <ErrorBoundary>
      <AuthContext.Provider
        value={{
          accessToken: 'accessTokenTest',
          user: {name:'test'}
        }}
      >
        <main>
          <RouterProvider router={router} />
        </main>
      </AuthContext.Provider>
    </ErrorBoundary>
  );
};
export default App;
