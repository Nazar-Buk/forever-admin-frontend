import { Outlet } from "react-router-dom";

import Sidebar from "./components/Sidebar";
import "./styles/main.scss";

const App = () => {
  return (
    <div className="wrap-admin-panel main__container">
      <Sidebar />
      <main className="">
        <Outlet />
      </main>
    </div>
  );
};

export default App;
