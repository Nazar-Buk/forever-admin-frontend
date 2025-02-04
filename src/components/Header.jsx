import { useState } from "react";
import { NavLink } from "react-router-dom";

import { assets } from "../admin_assets/assets";

const Header = ({ setToken }) => {
  const [visible, setVisible] = useState(false);

  const isMenuOpen = (isOpen) => {
    isOpen
      ? (document.body.style.overflow = "hidden") // Забороняємо скролінг сайту
      : (document.body.style.overflow = ""); // Відновлюємо скролінг сайту

    setVisible(isOpen);
  };

  return (
    <header className="header">
      {/* mobile menu */}
      <div className={`wrap-mobile-menu ${visible ? "menu-active" : ""}`}>
        <div className="close-box">
          <svg
            onClick={() => isMenuOpen(false)}
            className="close-menu-icon"
            viewBox="0 -0.5 21 21"
            version="1.1"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <g id="Page-1" stroke="none" strokeWidth="1" fillRule="evenodd">
              <g
                id="Dribbble-Light-Preview"
                transform="translate(-419.000000, -240.000000)"
              >
                <g id="icons" transform="translate(56.000000, 160.000000)">
                  <polygon
                    id="close-[#1511]"
                    points="375.0183 90 384 98.554 382.48065 100 373.5 91.446 364.5183 100 363 98.554 371.98065 90 363 81.446 364.5183 80 373.5 88.554 382.48065 80 384 81.446"
                  ></polygon>
                </g>
              </g>
            </g>
          </svg>

          <div className="mobile-logo">FOREVER-Admin</div>
        </div>
        <nav className="mobile-navigation">
          <ul className="menu">
            <li>
              <NavLink
                onClick={() => isMenuOpen(false)}
                to="/"
                className="menu-item"
              >
                <svg
                  className="sidebar__icon"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 27.963 27.963"
                  xmlSpace="preserve"
                >
                  <g>
                    <g id="c140__x2B_">
                      <path
                        d="M13.98,0C6.259,0,0,6.26,0,13.982s6.259,13.981,13.98,13.981c7.725,0,13.983-6.26,13.983-13.981
			C27.963,6.26,21.705,0,13.98,0z M21.102,16.059h-4.939v5.042h-4.299v-5.042H6.862V11.76h5.001v-4.9h4.299v4.9h4.939v4.299H21.102z
			"
                      />
                    </g>
                    <g id="Capa_1_9_"></g>
                  </g>
                </svg>
                <span>Add Items</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={() => isMenuOpen(false)}
                to="/list"
                className="menu-item"
              >
                <svg
                  className="sidebar__icon"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 27.963 27.963"
                  xmlSpace="preserve"
                >
                  <g>
                    <g id="c140__x2B_">
                      <path
                        d="M13.98,0C6.259,0,0,6.26,0,13.982s6.259,13.981,13.98,13.981c7.725,0,13.983-6.26,13.983-13.981
			C27.963,6.26,21.705,0,13.98,0z M21.102,16.059h-4.939v5.042h-4.299v-5.042H6.862V11.76h5.001v-4.9h4.299v4.9h4.939v4.299H21.102z
			"
                      />
                    </g>
                    <g id="Capa_1_9_"></g>
                  </g>
                </svg>
                <span>List Items</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={() => isMenuOpen(false)}
                to="/orders"
                className="menu-item"
              >
                <svg
                  className="sidebar__icon"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 27.963 27.963"
                  xmlSpace="preserve"
                >
                  <g>
                    <g id="c140__x2B_">
                      <path
                        d="M13.98,0C6.259,0,0,6.26,0,13.982s6.259,13.981,13.98,13.981c7.725,0,13.983-6.26,13.983-13.981
			C27.963,6.26,21.705,0,13.98,0z M21.102,16.059h-4.939v5.042h-4.299v-5.042H6.862V11.76h5.001v-4.9h4.299v4.9h4.939v4.299H21.102z
			"
                      />
                    </g>
                    <g id="Capa_1_9_"></g>
                  </g>
                </svg>
                <span>Orders</span>
              </NavLink>
            </li>
            <li>
              <NavLink
                onClick={() => isMenuOpen(false)}
                to="/page4"
                className="menu-item"
              >
                <svg
                  className="sidebar__icon"
                  version="1.1"
                  id="Capa_1"
                  xmlns="http://www.w3.org/2000/svg"
                  xmlnsXlink="http://www.w3.org/1999/xlink"
                  viewBox="0 0 27.963 27.963"
                  xmlSpace="preserve"
                >
                  <g>
                    <g id="c140__x2B_">
                      <path
                        d="M13.98,0C6.259,0,0,6.26,0,13.982s6.259,13.981,13.98,13.981c7.725,0,13.983-6.26,13.983-13.981
			C27.963,6.26,21.705,0,13.98,0z M21.102,16.059h-4.939v5.042h-4.299v-5.042H6.862V11.76h5.001v-4.9h4.299v4.9h4.939v4.299H21.102z
			"
                      />
                    </g>
                    <g id="Capa_1_9_"></g>
                  </g>
                </svg>
                <span>Page 4</span>
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
      {/* end mobile menu */}
      <div onClick={() => isMenuOpen(true)} className="header__mobile-icon">
        <svg
          className="mobile-icon"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M4 5C3.44772 5 3 5.44772 3 6C3 6.55228 3.44772 7 4 7H20C20.5523 7 21 6.55228 21 6C21 5.44772 20.5523 5 20 5H4ZM7 12C7 11.4477 7.44772 11 8 11H20C20.5523 11 21 11.4477 21 12C21 12.5523 20.5523 13 20 13H8C7.44772 13 7 12.5523 7 12ZM13 18C13 17.4477 13.4477 17 14 17H20C20.5523 17 21 17.4477 21 18C21 18.5523 20.5523 19 20 19H14C13.4477 19 13 18.5523 13 18Z"
          />
        </svg>
      </div>
      <div className="header-options">
        <div className="header__user-image">
          <img src={assets.user_avatar} alt="user avatar" />
        </div>
        <div
          onClick={() => {
            localStorage.removeItem("token");
            setToken("");
          }}
          className="log-out-box"
        >
          <svg
            className="log-out"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M15 16.5V19C15 20.1046 14.1046 21 13 21H6C4.89543 21 4 20.1046 4 19V5C4 3.89543 4.89543 3 6 3H13C14.1046 3 15 3.89543 15 5V8.0625M11 12H21M21 12L18.5 9.5M21 12L18.5 14.5"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
