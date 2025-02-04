import { useState, useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Login from "./components/Login";
import { AdminContext } from "./context/AdminContext";
import "./styles/main.scss";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;

const App = () => {
  const { token, setToken } = useContext(AdminContext); /// вAdminContextкористовую контекст

  return (
    <>
      {/* так підключив нотифікації до апки, а вже в конкретному випадку на сторінках використовуй toast*/}
      <ToastContainer position="top-center" autoClose={1800} />
      {token ? (
        <div className="wrap-admin-panel main__container">
          <Sidebar />
          <div className="wrap-header-main">
            <Header setToken={setToken} />
            <main className="page">
              <Outlet />
            </main>
          </div>
        </div>
      ) : (
        <Login setToken={setToken} />
      )}
    </>
  );
};

export default App;
