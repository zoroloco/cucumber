import "bootstrap/dist/css/bootstrap.min.css";
import router from "./components/Routes";
import { AuthContextProvider } from "./context/auth-context";
import ErrorBoundary from "./components/ErrorBoundary";
import { RouterProvider } from "react-router-dom";
import { PrimeReactProvider } from "primereact/api";

export const App = () => {
  return (
    <ErrorBoundary>
      <AuthContextProvider>
        <PrimeReactProvider>
          <main>
            <RouterProvider router={router} />
          </main>
        </PrimeReactProvider>
      </AuthContextProvider>
    </ErrorBoundary>
  );
};
export default App;
