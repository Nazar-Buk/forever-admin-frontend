import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useSearchParams } from "react-router-dom";

import { AdminContext } from "../context/AdminContext";
import { backendUrl, frontendUrl } from "../App";
import BreadCrumbs from "../components/BreadCrumbs";
import Loader from "../components/Loader";
import ModalWindow from "../components/ModalWindow";
import Pagination from "../components/Pagination";

import { assets } from "../admin_assets/assets";

const statuses = {
  pending: {
    title: "В обробці",
    color: "orange",
  },
  shipped: { title: "В дорозі", color: "aqua" },
  delivered: {
    title: "Доставлено",
    color: "#00a625",
  },
  canceled: {
    title: "Скасовано",
    color: "red",
  },
};

const Orders = () => {
  const [searchParams, setSearchParams] = useSearchParams(); // ця шляпа вміє працювати із адресною строкою
  // отримую дані із лінки, ті що після ? і тих &...
  const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
  const [limit, setLimit] = useState(parseInt(searchParams.get("limit")) || 10);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  const { currency, setIsModalOpen, isModalOpen } = useContext(AdminContext);
  const [ordersList, setOrdersList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [searchValue, setSearchValue] = useState(search);

  const [loadingState, setLoadingState] = useState({
    isOrdersLoading: true,
    isStatusUpdatedLoading: false,
    isLoadingRemoveOrder: false,
  });

  const [orderToDelete, setOrderToDelete] = useState({
    orderId: "",
    orderName: "",
  });

  const getOrdersList = async (currentPage, currentLimit, searchData) => {
    try {
      setLoadingState((prev) => ({ ...prev, isOrdersLoading: true }));

      const encodedSearchData = encodeURIComponent(searchData); // закодовує кирилицю, бо так просто її на бек  не треба відправляти, а от на беку розкодовується автоматично

      const response = await axios.get(
        backendUrl +
          `/api/order/get-all-orders?page=${currentPage}&limit=${currentLimit}&search=${encodedSearchData}`,
        {
          withCredentials: true, // дуже важливо: передає куки
        }
      );

      if (response.data.success) {
        setTotalCount(response.data.totalCount);
        setOrdersList(response.data.orders);
        setLoadingState((prev) => ({ ...prev, isOrdersLoading: false }));
      }
    } catch (error) {
      console.log(error, "error");
      toast.error(error.message);
      setLoadingState((prev) => ({ ...prev, isOrdersLoading: false }));
    } finally {
      setLoadingState((prev) => ({ ...prev, isOrdersLoading: false }));
    }
  };

  const updateOrderStatus = async (orderId, status) => {
    try {
      setLoadingState((prev) => ({ ...prev, isStatusUpdatedLoading: true }));

      const response = await axios.patch(
        backendUrl + "/api/order/update",
        {
          orderId,
          status,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        const { order } = response.data;

        setOrdersList((prev) =>
          prev.map((item) => {
            if (item._id === order._id) {
              return { ...item, status: order.status };
            }

            return item;
          })
        );

        setLoadingState((prev) => ({ ...prev, isStatusUpdatedLoading: false }));
        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");
      setLoadingState((prev) => ({ ...prev, isStatusUpdatedLoading: false }));
      toast.error(error?.response?.data.message);
    } finally {
      setLoadingState((prev) => ({ ...prev, isStatusUpdatedLoading: false }));
    }
  };

  const changeOrderStatus = (e, orderId) => {
    const { value } = e.target;

    updateOrderStatus(orderId, value);
  };

  const removeOrder = async (orderId) => {
    try {
      setLoadingState((prev) => ({ ...prev, isLoadingRemoveOrder: true }));

      const response = await axios.delete(backendUrl + `/api/order/delete`, {
        data: { orderId },
        withCredentials: true,
      });

      if (response.data.success) {
        setLoadingState((prev) => ({ ...prev, isLoadingRemoveOrder: false }));
        toast.success(response.data.message);
        setOrdersList((prev) => prev.filter((item) => item._id !== orderId));
      }
    } catch (error) {
      console.log(error, "error");
      setLoadingState((prev) => ({ ...prev, isLoadingRemoveOrder: false }));
      toast.error(error.response.data.message);
    } finally {
      setLoadingState((prev) => ({ ...prev, isLoadingRemoveOrder: false }));
    }
  };

  useEffect(() => {
    getOrdersList(page, limit, search);

    // Встановлюємо параметри в URL при зміні сторінки або ліміту
    setSearchParams({
      page,
      limit,
      search,
    });
  }, [page, limit, search, setSearchParams]);

  const loading =
    loadingState.isOrdersLoading ||
    loadingState.isStatusUpdatedLoading ||
    loadingState.isLoadingRemoveOrder;

  if (loading) return <Loader />;

  return (
    <section className="orders-list">
      <BreadCrumbs>{[<span key={0}>Список замовлень</span>]}</BreadCrumbs>
      {isModalOpen && (
        <ModalWindow
          title="Видалити замовлення"
          content={`Ви справді хочете видалити це замовлення "${orderToDelete.orderName}" ?`}
          confirmAction={() => {
            removeOrder(orderToDelete.orderId);
            setIsModalOpen(false);
          }}
        />
      )}
      <div className="toolbar-wrapper">
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
                setSearch(searchValue.trim());
              }
            }}
            value={searchValue}
          />
          <svg
            onClick={() => setSearch(searchValue.trim())}
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
      </div>
      {ordersList.length ? (
        <>
          <div className="table-box">
            <h2>Список замовлень</h2>

            <table className="table">
              <thead>
                <tr className="head-row">
                  <th className="head-cell">
                    <b>Замовлення</b>
                  </th>
                  <th className="head-cell">
                    <b>Товари</b>
                  </th>
                  <th className="head-cell">
                    <b>Адреса</b>
                  </th>
                  <th className="head-cell">
                    <b>ID</b>
                  </th>
                  <th className="head-cell">
                    <b>Імʼя</b>
                  </th>
                  <th className="head-cell">
                    <b>Ціна</b>
                  </th>
                  <th className="head-cell">
                    <b>Статус</b>
                  </th>
                  <th className="head-cell">
                    <b>Дата</b>
                  </th>
                  <th className="head-cell">
                    <b>Метод Оплати</b>
                  </th>
                  <th className="head-cell">
                    <b>Дії</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                {ordersList.map((item) => {
                  const date = new Date(item.createdAt);

                  return (
                    <tr className="table-row" key={item._id}>
                      <td className="table-cell">
                        <div className="img-box">
                          <svg
                            width="80px"
                            height="80px"
                            viewBox="0 0 100 100"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              fill="#FBF063"
                              d="M7 22L50 0l43 22-43 21.001L7 22z"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              fill="#F29C1F"
                              d="M50.003 42.997L7 22v54.28l43.006 21.714-.003-54.997z"
                            />
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              fill="#F0C419"
                              d="M50 97.994L93.006 76.28V22L50.003 42.997 50 97.994z"
                            />
                            <path
                              opacity=".5"
                              fillRule="evenodd"
                              clipRule="evenodd"
                              fill="#F29C1F"
                              d="M27.036 11.705l42.995 21.498 2.263-1.105-43.047-21.524z"
                            />
                            <path
                              opacity=".5"
                              fillRule="evenodd"
                              clipRule="evenodd"
                              fill="#ffffff"
                              d="M21.318 14.674L63.3 36.505l15.99-7.809L35.788 7.271z"
                            />
                            <path
                              opacity=".5"
                              fillRule="evenodd"
                              clipRule="evenodd"
                              fill="#ffffff"
                              d="M63.312 36.505l15.978-7.818v11l-15.978 8.817V36.505z"
                            />
                          </svg>
                        </div>
                      </td>
                      <td className="table-cell product-list-cell">
                        {item.items.map((value) => (
                          <div key={value._id} className="product">
                            <div className="wrap-img-cell">
                              <img
                                src={
                                  value?.images[0]
                                    ? value?.images[0]?.url
                                    : assets.no_image
                                }
                                alt={value?.name}
                              />
                            </div>
                            <a
                              href={`${frontendUrl}/product/${value.productId}`}
                              className="product-title"
                              target="_blank"
                            >
                              {value?.name.length > 30
                                ? `${value?.name.slice(0, 30)}...`
                                : value?.name}
                            </a>
                            <div className="product-size">
                              {value.size === "nosize" ? "" : value.size}
                            </div>
                            <div className="product-qty">
                              {value.quantity} шт.
                            </div>
                          </div>
                        ))}
                      </td>
                      <td className="table-cell address-cell">
                        <div className="details__address">
                          <b className="address-item">Адреса доставки:</b>
                          <div className="address-item">
                            Пошта:{" "}
                            <b>{item?.shippingAddress?.postName.optionLabel}</b>
                            ,
                          </div>
                          <div className="address-item">
                            Область: <b>{item?.shippingAddress?.region}</b>,
                          </div>
                          <div className="address-item">
                            Населений пункт:{" "}
                            <b>{item?.shippingAddress?.city}</b>,
                          </div>
                          <div className="address-item">
                            Відділення №:{" "}
                            <b>{item?.shippingAddress?.postBranchName}</b>,
                          </div>
                          <div className="address-item">
                            Телефон: <b>{item?.shippingAddress?.phone}</b>
                          </div>
                        </div>
                      </td>
                      <td className="table-cell name">{item._id}</td>
                      <td className="table-cell category">
                        {item.shippingAddress.firstName}{" "}
                        {item.shippingAddress.lastName}
                      </td>
                      <td className="table-cell">
                        {item.totalPrice} {currency}
                      </td>
                      <td className="table-cell status">
                        <div className="wrap-status-details">
                          <div
                            className="status-circle"
                            style={{
                              backgroundColor: statuses[item.status].color,
                            }}
                          ></div>
                          <select
                            id={`status-select-${item._id}`}
                            value={item.status}
                            className="status-select"
                            onChange={(e) => changeOrderStatus(e, item._id)}
                          >
                            <option value="pending">
                              {statuses.pending.title}
                            </option>
                            <option value="shipped">
                              {statuses.shipped.title}
                            </option>
                            <option value="delivered">
                              {statuses.delivered.title}
                            </option>
                            <option value="canceled">
                              {statuses.canceled.title}
                            </option>
                          </select>
                        </div>
                      </td>
                      <td className="table-cell">
                        {date.toLocaleDateString("uk-UA")}
                      </td>
                      <td className="table-cell">
                        {item.paymentMethod === "cash" && "Готівка"}
                      </td>
                      <td className="table-cell">
                        <div className="action-cell">
                          <svg
                            onClick={() => {
                              setOrderToDelete((prev) => ({
                                ...prev,
                                orderId: item._id,
                                orderName: item._id,
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
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="empty-page">
          <h2>Немає продуктів</h2>
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
  );
};

export default Orders;
