import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import Orders from "./pages/Orders";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <AddProduct />,
        },
        {
          path: "/list",
          element: <ProductList />,
        },
        {
          path: "/orders",
          element: <Orders />,
        },
        {
          path: "/page4",
          element: "page4",
        },
      ],
    },
  ],
  {
    basename: import.meta.env.BASE_URL, // реакт сам знає що це тягнеться із файлу vite.config.js
  }
);

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>
  <RouterProvider router={router} fallbackElement={<>Loading...</>} />
);
