import { useContext, useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

import { AdminContext } from "../context/AdminContext";
import { backendUrl } from "../App";
import { assets } from "../admin_assets/assets";
import BreadCrumbs from "../components/BreadCrumbs";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import ModalWindow from "../components/ModalWindow";

const CategoryList = () => {
  const { token, setIsModalOpen, isModalOpen } = useContext(AdminContext);
  const [searchParams, setSearchParams] = useSearchParams(); // ця шляпа вміє працювати із адресною строкою
  const [categoryList, setCategoryList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingState, setLoadingState] = useState({
    isLoadingCategoryList: true,
    isLoadingRemoveProduct: false,
  });

  const [categoryToDelete, setCategoryToDelete] = useState({
    categoryId: "",
    categoryName: "",
  });

  const [page, setPage] = useState(parseInt(searchParams.get("page") || 1));
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit") || 10));

  const getCategoryList = async (currPage, currLimit) => {
    try {
      setLoadingState((prev) => ({
        ...prev,
        isLoadingCategoryList: true,
      }));

      const response = await axios.get(
        backendUrl + `/api/category/list?page=${currPage}&limit=${currLimit}`
      ); // на беку це треба отримувати так { page: '1', limit: '10' } req.query

      if (response.data.success) {
        setCategoryList(response.data.categoriesList);
        setTotalCount(response.data.totalCount);
        setLoadingState((prev) => ({
          ...prev,
          isLoadingCategoryList: false,
        }));
        toast.success(response.data.message);
      } else {
        setLoadingState((prev) => ({
          ...prev,
          isLoadingCategoryList: false,
        }));
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");
      setLoadingState((prev) => ({
        ...prev,
        isLoadingCategoryList: false,
      }));
      toast.error(error.response.data.message);
    }
  };

  const getComma = (item, index) => {
    if (item.subCategory.length > 1 && item.subCategory.length - 1 !== index) {
      return ",";
    }

    return "";
  };

  const removeCategory = async (categoryId) => {
    try {
      setLoadingState((prev) => ({
        ...prev,
        isLoadingRemoveProduct: true,
      }));

      const response = await axios.delete(
        backendUrl + `/api/category/remove/${categoryId}`,
        { headers: { token } }
      );

      if (response.data.success) {
        await getCategoryList(page, limit);

        setLoadingState((prev) => ({
          ...prev,
          isLoadingRemoveProduct: false,
        }));

        toast.success(response.data.message);
      } else {
        setLoadingState((prev) => ({
          ...prev,
          isLoadingRemoveProduct: false,
        }));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");

      setLoadingState((prev) => ({
        ...prev,
        isLoadingRemoveProduct: false,
      }));
      toast.error(error.response.data.message);
    }
  };

  const isLoading =
    loadingState.isLoadingCategoryList || loadingState.isLoadingRemoveProduct;

  useEffect(() => {
    getCategoryList(page, limit);
    // Встановлюємо параметри в URL при зміні сторінки або ліміту
    setSearchParams({ page, limit });
  }, [page, limit, setSearchParams]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <section className="category-list">
          <BreadCrumbs>{[<span key={0}>Список категорій</span>]}</BreadCrumbs>
          {isModalOpen && (
            <ModalWindow
              title="Remove Category"
              content={`Do you really want to remove this category "${categoryToDelete.categoryName}" ?`}
              confirmAction={() => {
                removeCategory(categoryToDelete.categoryId);
                setIsModalOpen(false);
              }}
            />
          )}
          {categoryList.length ? (
            <div className="table-box">
              <h2>Список категорій</h2>
              <table className="table">
                <thead>
                  <tr className="head-row">
                    <th className="head-cell">
                      <b>Категорія</b>
                    </th>
                    <th className="head-cell">
                      <b>Під-категорія</b>
                    </th>
                    <th className="head-cell">
                      <b>Дії</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categoryList.map((item) => (
                    <tr className="table-row" key={item._id}>
                      <td className="table-cell">{item.categoryLabel}</td>
                      <td className="table-cell ">
                        {item.subCategory.map((value, index) => (
                          <div className="sub-category" key={index}>
                            {value.subCategoryLabel}
                            {getComma(item, index)}
                          </div>
                        ))}
                      </td>

                      <td className="table-cell action">
                        <div className="action-cell">
                          <svg
                            onClick={() => {
                              setCategoryToDelete((prev) => ({
                                ...prev,
                                categoryId: item._id,
                                categoryName: item.categoryLabel,
                              }));

                              setIsModalOpen(true);
                            }}
                            version="1.1"
                            id="Capa_1"
                            xmlns="http://www.w3.org/2000/svg"
                            xmlnsXlink="http://www.w3.org/1999/xlink"
                            viewBox="0 0 490 490"
                            xmlSpace="preserve"
                          >
                            <polygon
                              points="456.851,0 245,212.564 33.149,0 0.708,32.337 212.669,245.004 0.708,457.678 33.149,490 245,277.443 456.851,490 
          489.292,457.678 277.331,245.004 489.292,32.337 "
                            />
                          </svg>
                          <Link
                            to={`/category-list/edit-category/${item._id}`}
                            state={{ page, limit }}
                          >
                            <img src={assets.edit_icon} alt="edit icon" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty-page">
              <h2>Немає категорій</h2>
              <img src={assets.empty_page} alt="no categories" />
            </div>
          )}
          <div className="wrap-pagination">
            <Pagination
              page={page}
              setPage={setPage}
              limit={limit}
              setLimit={setLimit}
              totalCount={totalCount}
            />
          </div>
        </section>
      )}
    </>
  );
};

export default CategoryList;
