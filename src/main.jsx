import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
// import './index.css'

import App from "./App.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: "page1",
      },
      {
        path: "/page2",
        element: "page2",
      },
      {
        path: "/page3",
        element: "page3",
      },
      {
        path: "/page4",
        element: "page4",
      },
    ],
  },
]);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>
  <RouterProvider router={router} fallbackElement={<>Loading...</>} />
);
