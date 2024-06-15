/** @format */

import { RouterProvider } from "react-router-dom";
import "./App.css";
import { Router } from "./router";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className=" ">
      <RouterProvider router={Router}></RouterProvider>
      <Toaster position="top-right" reverseOrder={false} />
      {/* <RouterProvider router={Router}></RouterProvider> */}
    </div>
  );
}

export default App;
