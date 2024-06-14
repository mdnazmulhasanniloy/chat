/** @format */

import { createBrowserRouter } from "react-router-dom";
import Chat from "./components/Chat";
import Login from "./components/Login";
import Main from "./components/layout";

export const Router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    children: [
      {
        path: "/chat",
        element: <Chat />,
      },
      {
        path: "/",
        element: <Login />,
      },
    ],
  },
  {
    path: "*",
  },
]);
