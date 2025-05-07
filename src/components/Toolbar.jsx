// ЩОБ ПЛАВНА АНІМАЦІЯ ПРАЦЮВАЛА В РЕАКТІ, НЕ РОБИ УМОВНИЙ РЕНДЕРИНГ (? ... : ... або && ...),
// А ПРОСТО ДОДАВАЙ І ЗАБИРАЙ КЛАС + display: none, @starting-style
import { useState, useRef } from "react";

import useClickOutside from "../hooks/useClickOutside";
import FiltersProduct from "./FiltersProduct";

const sortTitles = {
  date_new: "Newest",
  date_old: "Oldest",
  price_desc: "Price High",
  price_asc: "Price Low",
};

const Toolbar = (props) => {
  const {
    categoriesData,
    setSearch,
    search,
    sort,
    setSort,
    category,
    setCategory,
    subCategory,
    setSubCategory,
    priceFrom,
    setPriceFrom,
    priceTo,
    setPriceTo,
  } = props;

  const [isFilterListVisibility, setIsFilterListVisibility] = useState(false);
  const [searchValue, setSearchValue] = useState(search);

  const [isSortOpen, setIsSortOpen] = useState(false);

  // це не треба, але я лишаю як приклад, так можна отримувати дані із  кастомного селекту
  const [selectedSort, setSelectedSort] = useState({
    sortLabel: "Newest",
    sortValue: "date_new",
  });

  const customSelectRef = useRef(null);
  useClickOutside(customSelectRef, () => setIsSortOpen(false));

  const handleSelect = (e, value, label) => {
    e.stopPropagation(); // зупиняє "всплиття" (event bubbling) події вгору по DOM, щоб не було подвійного кліку, коли onClick є на бітьківському та дочірньому елементах

    setSelectedSort((prev) => ({
      ...prev,
      sortValue: value,
      sortLabel: label,
    }));

    setIsSortOpen(false);
    setSort(value);
  };

  return (
    <>
      <section className="toolbar__box">
        <div className="search__box">
          <input
            className="search-input"
            type="search"
            id="search-products"
            onChange={(e) => {
              setSearchValue(e.target.value);
              if (e.target.value === "") {
                setSearch("");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                setSearch(searchValue);
              }
            }}
            value={searchValue}
          />
          <svg
            onClick={() => setSearch(searchValue)}
            className="search-icon"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M11 6C13.7614 6 16 8.23858 16 11M16.6588 16.6549L21 21M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div className="wrap-filter-sort-box">
          <div
            className="filter__box"
            onClick={() => setIsFilterListVisibility(true)}
          >
            <div>Filters</div>
            <svg
              className="filter-icon"
              version="1.1"
              id="Capa_1"
              xmlns="http://www.w3.org/2000/svg"
              xmlnsXlink="http://www.w3.org/1999/xlink"
              viewBox="0 0 210.68 210.68"
              xmlSpace="preserve"
            >
              <path
                d="M205.613,30.693c0-10.405-10.746-18.149-32.854-23.676C154.659,2.492,130.716,0,105.34,0
	C79.965,0,56.021,2.492,37.921,7.017C15.813,12.544,5.066,20.288,5.066,30.693c0,3.85,1.476,7.335,4.45,10.479l68.245,82.777v79.23
	c0,2.595,1.341,5.005,3.546,6.373c1.207,0.749,2.578,1.127,3.954,1.127c1.138,0,2.278-0.259,3.331-0.78l40.075-19.863
	c2.55-1.264,4.165-3.863,4.169-6.71l0.077-59.372l68.254-82.787C204.139,38.024,205.613,34.542,205.613,30.693z M44.94,20.767
	C61.467,17.048,82.917,15,105.34,15s43.874,2.048,60.399,5.767c18.25,4.107,23.38,8.521,24.607,9.926
	c-1.228,1.405-6.357,5.819-24.607,9.926c-16.525,3.719-37.977,5.767-60.399,5.767S61.467,44.338,44.94,40.62
	c-18.249-4.107-23.38-8.521-24.607-9.926C21.56,29.288,26.691,24.874,44.94,20.767z M119.631,116.486
	c-1.105,1.341-1.711,3.023-1.713,4.761l-0.075,57.413l-25.081,12.432v-69.835c0-1.741-0.605-3.428-1.713-4.771L40.306,54.938
	C58.1,59.1,81.058,61.387,105.34,61.387c24.283,0,47.24-2.287,65.034-6.449L119.631,116.486z"
              />
            </svg>
          </div>
          <div className="wrap-sort-box" ref={customSelectRef}>
            Sort by:
            <div
              onClick={(e) => {
                setIsSortOpen((prev) => !prev);
              }}
              className="sort__box"
            >
              <div>{sortTitles[sort]}</div>

              <svg
                className="sort-icon"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 18L16 16M16 6L20 10.125M16 6L12 10.125M16 6L16 13"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 18L12 13.875M8 18L4 13.875M8 18L8 11M8 6V8"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {isSortOpen && (
                <div className="sort__items">
                  <div
                    onClick={(e) => handleSelect(e, "date_new", "Newest")}
                    className="sort__item"
                  >
                    Newest
                  </div>
                  <div
                    onClick={(e) => handleSelect(e, "date_old", "Oldest")}
                    className="sort__item"
                  >
                    Oldest
                  </div>
                  <div
                    onClick={(e) => handleSelect(e, "price_desc", "Price Low")}
                    className="sort__item"
                  >
                    Price High
                  </div>
                  <div
                    onClick={(e) => handleSelect(e, "price_asc", "Price High")}
                    className="sort__item"
                  >
                    Price Low
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <FiltersProduct
        isFilterListVisibility={isFilterListVisibility}
        setIsFilterListVisibility={setIsFilterListVisibility}
        categoriesData={categoriesData}
        category={category}
        setCategory={setCategory}
        subCategory={subCategory}
        setSubCategory={setSubCategory}
        priceFrom={priceFrom}
        setPriceFrom={setPriceFrom}
        priceTo={priceTo}
        setPriceTo={setPriceTo}
      />
    </>
  );
};

export default Toolbar;
