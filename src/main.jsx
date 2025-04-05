import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AdminContextProvider from "./context/AdminContext.jsx"; // імпортуємо MyContextProvider
import App from "./App.jsx";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import Orders from "./pages/Orders";
import EditProduct from "./pages/EditProduct";

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
          path: "/list/edit-product/:productId",
          element: <EditProduct />,
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

  // Обгортаємо нашу апку в AdminContextProvider
  <AdminContextProvider>
    <RouterProvider router={router} fallbackElement={<>Loading...</>} />
  </AdminContextProvider>
);
