import React from "react";
import { RouterProvider } from "react-router-dom";
import { routers } from "./pages/Routes";

const App = () => {
  return (
    <>
      <RouterProvider router={routers} />
    </>
  );
};

export default App;
