import { Outlet } from "react-router-dom";
import "./styles/main.scss";

const App = () => {
  return (
    <div>
      <aside>
        <nav>
          <ul>
            <li>
              <p>page1</p>
            </li>
            <li>
              <p>page2</p>
            </li>
            <li>
              <p>page3</p>
            </li>
            <li>
              <p>page4</p>
            </li>
          </ul>
        </nav>
      </aside>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
