import { useState, useEffect, useContext } from "react";
import { Outlet } from "react-router-dom";
import axios from "axios";

// <Outlet /> — це місце, де рендериться вкладений маршрут. Якщо твій маршрут має children, то вони рендеряться в <Outlet />.

import { ToastContainer } from "react-toastify";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import Loader from "./components/Loader";
import NetworkStatus from "./components/NetworkStatus";
import { AdminContext } from "./context/AdminContext";
import "./styles/main.scss";

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const frontendUrl = import.meta.env.VITE_FRONTEND_STORE_URL;

const App = () => {
  const { setUseData } = useContext(AdminContext);

  const [isLoading, setIsLoading] = useState(true);

  // useEffect(() => {
  //   const appWasLoaded = () => {
  //     setIsLoading(false);
  //   };

  //   window.addEventListener("load", appWasLoaded); // Підписуємось на подію load

  //   return () => window.removeEventListener("load", appWasLoaded); // Очищаємо слухач події при демонтажі компонента
  // }, []);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        setIsLoading(true);

        const response = await axios.get(backendUrl + "/api/user/check-auth", {
          withCredentials: true, // дуже важливо: передає куки
        });

        const { success, role, name } = response.data;
        console.log(response, "response");

        if (!success || (role !== "admin" && role !== "super-admin")) {
          window.location.href = frontendUrl;
        } else {
          setIsLoading(false);
          setUseData((prev) => ({ ...prev, username: name, userRole: role }));
        }
      } catch (error) {
        console.log(error, "error");
        window.location.href = frontendUrl;
        setIsLoading(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) return <Loader />;

  return (
    <>
      <NetworkStatus />
      {/* {isLoading && <Loader />} */}
      {/* так підключив нотифікації до апки, а вже в конкретному випадку на сторінках використовуй toast*/}
      <ToastContainer position="top-center" autoClose={1800} />
      <div className="wrap-admin-panel main__container">
        <Sidebar />
        <div className="wrap-header-main">
          <Header />
          <main className="page">
            <Outlet />
          </main>
        </div>
      </div>
    </>
  );
};

export default App;
