import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";

import AdminContextProvider from "./context/AdminContext.jsx"; // імпортуємо MyContextProvider
import App from "./App.jsx";
import AddProduct from "./pages/AddProduct";
import ProductList from "./pages/ProductList";
import Orders from "./pages/Orders";
import EditProduct from "./pages/EditProduct";
import DashBoard from "./pages/DashBoard.jsx";
import AddCategory from "./pages/AddCategory.jsx";
import CategoryList from "./pages/CategoryList.jsx";
import EditCategory from "./pages/EditCategory.jsx";
import UsersList from "./pages/UsersList.jsx";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <DashBoard />,
        },
        {
          path: "/add-product",
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
          path: "/add-category",
          element: <AddCategory />,
        },
        {
          path: "/category-list",
          element: <CategoryList />,
        },
        {
          path: "/category-list/edit-category/:categoryId",
          element: <EditCategory />,
        },
        {
          path: "/users-list",
          element: <UsersList />,
        },
        {
          path: "/page4",
          element: "page4",
        },
      ],
    },
  ]
  // {
  //   basename: import.meta.env.BASE_URL, // реакт сам знає що це тягнеться із файлу vite.config.js
  // }
);

window.addEventListener("load", () => {
  // load -- працює тоді коли сторінка повністю завантажена,
  // ховаємо лоадер

  const loader = document.getElementById("loader");
  if (loader) {
    loader.style.display = "none";
  }
});

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  //   <App />
  // </StrictMode>

  // Обгортаємо нашу апку в AdminContextProvider
  <AdminContextProvider>
    <RouterProvider router={router} fallbackElement={<>Loading...</>} />
  </AdminContextProvider>
);
