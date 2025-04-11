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

const ProductList = () => {
  const { token, currency } = useContext(AdminContext);
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams(); // ця шляпа вміє працювати із адресною строкою
  const [list, setList] = useState([]);
  // отримую дані із лінки, ті що після ? і тих &...
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit")) || 10);
  const [totalCount, setTotalCount] = useState(0);

  const fetchList = async (currentPage, currentLimit) => {
    try {
      setIsLoading(true);

      const response = await axios.get(
        backendUrl +
          `/api/product/list?page=${currentPage}&limit=${currentLimit}`
      ); // на беку це треба отримувати так { page: '1', limit: '10' } req.query

      if (response.data.success) {
        setList(response.data.products);
        setTotalCount(response.data.totalCount);
        setIsLoading(false);
        toast.success(response.data.message);
      } else {
        setIsLoading(false);

        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error from product list");
      setIsLoading(false);

      toast.error(error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      setIsLoading(true);

      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
        { headers: { token } }
      );

      if (response.data.success) {
        await fetchList();
        setIsLoading(false);
        toast.success(response.data.message);
      } else {
        setIsLoading(false);

        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error, "error from remove product");
      setIsLoading(false);

      toast.error(error.message);
    }
  };

  useEffect(() => {
    fetchList(page, limit);
    // Встановлюємо параметри в URL при зміні сторінки або ліміту
    setSearchParams({ page, limit });
  }, [page, limit, setSearchParams]);

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <section className="products-list">
          <BreadCrumbs>{[<span key={0}>Product List</span>]}</BreadCrumbs>
          {list.length ? (
            <div className="table-box">
              <h2>Product List</h2>
              <table className="table">
                <thead>
                  <tr className="head-row">
                    <th className="head-cell">
                      <b>Image</b>
                    </th>
                    <th className="head-cell">
                      <b>Name</b>
                    </th>
                    <th className="head-cell">
                      <b>Category</b>
                    </th>
                    <th className="head-cell">
                      <b>Price</b>
                    </th>
                    <th className="head-cell">
                      <b>Action</b>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {list.map((item) => (
                    <tr className="table-row" key={item._id}>
                      <td className="table-cell">
                        <div className="img-box">
                          <img
                            src={
                              item.images.length
                                ? item.images[0].url
                                : assets.no_image
                            }
                            alt="product image"
                          />
                        </div>
                      </td>
                      <td className="table-cell name">{item.name}</td>
                      <td className="table-cell category">{item.category}</td>
                      <td className="table-cell">
                        {currency}
                        {item.price}
                      </td>
                      <td className="table-cell">
                        <div className="action-cell">
                          <svg
                            onClick={() => removeProduct(item._id)}
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
                          <Link to={`/list/edit-product/${item._id}`}>
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
              <h2>No Products</h2>
              <img src={assets.empty_page} alt="no product" />
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

export default ProductList;
