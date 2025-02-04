import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../admin_assets/assets";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="logo-box">FOREVER-Admin</div>
      <nav>
        <ul className="menu">
          <li>
            <NavLink to="/" className="menu__item">
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
            <NavLink to="/list" className="menu__item">
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
            <NavLink to="/orders" className="menu__item">
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
            <NavLink to="/page4" className="menu__item">
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
              </svg>{" "}
              <span>Page 4</span>
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
