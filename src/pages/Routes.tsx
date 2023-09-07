import { createBrowserRouter } from "react-router-dom";
import { Home } from "./Home";
import { SearchResult } from "./SearchResult";
import { NotFound } from "./NotFound";

export const routers = createBrowserRouter([
  {
    path: "*",
    element: <NotFound />,
  },
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/search",
    element: <SearchResult />,
  },
]);
