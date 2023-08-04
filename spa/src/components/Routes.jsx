import { createBrowserRouter } from "react-router-dom";
import {
  PublicHome,
  PrivateHome,
  Login,
  ErrorPage,
  Register,
  Chats,
  UserAdmin,
  Conversation,
  Friends
} from "../pages";
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
            path: "/home", //you just need an account but no specific role to access this page.
            element: <PrivateHome />,
          },
          {
            path: "/chats", // requires ROLE_CHAT
            element: <Chats />,
          },
          {
            path: "/friends", // requires ROLE_CHAT
            element: <Friends />
          },
          {
            path: "/conversation/:chatid", //requires ROLE_CHAT
            element: <Conversation />,
          },
          {
            path: "/user-admin", //requires ROLE_USER_ADMIN
            element: <UserAdmin />,
          },
        ],
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/", // public landing page for the site
        element: <PublicHome />,
      },
      {
        path: "/register",
        element: <Register />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);
export default AppRouter;
