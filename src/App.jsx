import { Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import "./styles/main.scss";

const App = () => {
  return (
    <div className="wrap-admin-panel main__container">
      <Sidebar />
      <div className="wrap-header-main">
        <Header />
        <main className="page">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default App;
