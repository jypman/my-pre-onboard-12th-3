import { createBrowserRouter } from "react-router-dom";
import { Home } from "./Home";

export const routers = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);
