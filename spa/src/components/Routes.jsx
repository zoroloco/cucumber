import { createBrowserRouter } from "react-router-dom";
import { Home, Login, ErrorPage, Register } from "../pages";
import PrivateRoutes from "./PrivateRoutes";
import SiteTemplate from "./SiteTemplate";

const AppRouter = createBrowserRouter([
  {
    element: <SiteTemplate />,
    children: [
      {
        element: <PrivateRoutes />,
        children: [
          {
            path: "/",
            element: <Home />,
          },
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/register",
        element: <Register />
      },
      {
        path: "*",
        element: <ErrorPage type="404" />,
      },
    ],
  },
]);
export default AppRouter;
