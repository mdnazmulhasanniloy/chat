/** @format */

import { RouterProvider } from "react-router-dom";
import "./App.css";
import { Router } from "./router";

function App() {
  return (
    <div className=" ">
      <RouterProvider router={Router}></RouterProvider>
      {/* <RouterProvider router={Router}></RouterProvider> */}
    </div>
  );
}

export default App;
