import "bootstrap/dist/css/bootstrap.min.css";
import router from "./components/Routes";
import {AuthContextProvider} from "./context/auth-context";
import ErrorBoundary from "./components/ErrorBoundary";
import { RouterProvider } from "react-router-dom";

export const App = () => {
  return (
    <ErrorBoundary>
      <AuthContextProvider>
        <main>
          <RouterProvider router={router} />
        </main>
      </AuthContextProvider>
    </ErrorBoundary>
  );
};
export default App;
