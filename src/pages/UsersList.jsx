import { useContext, useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { AdminContext } from "../context/AdminContext";
import { backendUrl } from "../App";
import { assets } from "../admin_assets/assets";
import BreadCrumbs from "../components/BreadCrumbs";
import Loader from "../components/Loader";
import ModalWindow from "../components/ModalWindow";

const UsersList = () => {
  const { setIsModalOpen, isModalOpen } = useContext(AdminContext);

  const [users, setUsers] = useState([]);
  const [isLoadingState, setIsLoadingState] = useState({
    isLoadingUsersList: true,
    isLoadingUpdateUserRole: false,
    isLoadingRemoveUser: false,
  });

  const [userToDelete, setUserToDelete] = useState({
    userId: "",
    username: "",
  });

  const usersList = async () => {
    try {
      setIsLoadingState((prev) => ({ ...prev, isLoadingUsersList: true }));

      const response = await axios.get(backendUrl + "/api/user/all-users", {
        withCredentials: true,
      });

      if (response.data.success) {
        setUsers(response.data.users);
        setIsLoadingState((prev) => ({ ...prev, isLoadingUsersList: false }));
      }
    } catch (error) {
      console.log(error, "error");
      setIsLoadingState((prev) => ({ ...prev, isLoadingUsersList: false }));
      toast.error(error.message);
    }
  };

  const updateUserRole = async (id, newRole) => {
    try {
      setIsLoadingState((prev) => ({ ...prev, isLoadingUpdateUserRole: true }));

      const response = await axios.patch(
        backendUrl + `/api/user/${id}/role`,
        {
          newRole,
        },
        { withCredentials: true }
      );

      if (response.data.success) {
        const updatedUser = response.data.updatedUser;

        setUsers((prevUsers) =>
          prevUsers.map((user) =>
            user._id === updatedUser._id
              ? { ...user, role: updatedUser.role }
              : user
          )
        );

        setIsLoadingState((prev) => ({
          ...prev,
          isLoadingUpdateUserRole: false,
        }));

        toast.success(response.data.message);
      }
    } catch (error) {
      console.log(error, "error");
      setIsLoadingState((prev) => ({
        ...prev,
        isLoadingUpdateUserRole: false,
      }));
      toast.error(error.response.data.message);
    } finally {
      setIsLoadingState((prev) => ({
        ...prev,
        isLoadingUpdateUserRole: false,
      }));
    }
  };

  const removeUser = async (id) => {
    try {
      setIsLoadingState((prev) => ({ ...prev, isLoadingRemoveUser: true }));

      const response = await axios.delete(backendUrl + `/api/user/${id}`, {
        withCredentials: true,
      });

      if (response.data.success) {
        setIsLoadingState((prev) => ({ ...prev, isLoadingRemoveUser: false }));
        toast.success(response.data.message);

        const { deletedUserId } = response.data;
        setUsers((prev) => prev.filter((item) => item._id !== deletedUserId));
      }
    } catch (error) {
      console.log(error, "error");
      setIsLoadingState((prev) => ({ ...prev, isLoadingRemoveUser: false }));
      toast.error(error.response.data.message);
    } finally {
      setIsLoadingState((prev) => ({ ...prev, isLoadingRemoveUser: false }));
    }
  };

  const formattedDate = (dateString) => {
    const date = new Date(dateString);
    const formatted = date.toLocaleDateString("uk-UA");

    return formatted;
  };

  const changeUserRole = (e, userId) => {
    const { value } = e.target;
    updateUserRole(userId, value);
  };

  useEffect(() => {
    usersList();
  }, []);

  const isLoading =
    isLoadingState.isLoadingUsersList ||
    isLoadingState.isLoadingUpdateUserRole ||
    isLoadingState.isLoadingRemoveUser;

  if (isLoading) return <Loader />;

  return (
    <section className="users-list">
      <BreadCrumbs>{[<span key={0}>Список користувачів</span>]}</BreadCrumbs>
      {isModalOpen && (
        <ModalWindow
          title="Видалити користувача"
          content={`Ви справді хочете видалити цього користувача "${userToDelete.username}" ?`}
          confirmAction={() => {
            removeUser(userToDelete.userId);
            setIsModalOpen(false);
          }}
        />
      )}

      {users.length ? (
        <>
          <div className="table-box">
            <h2>Список користувачів</h2>
            <table className="table">
              <thead>
                <tr className="head-row">
                  <th className="head-cell">
                    <b>ID</b>
                  </th>
                  <th className="head-cell">
                    <b>Імʼя</b>
                  </th>
                  <th className="head-cell">
                    <b>Емейл</b>
                  </th>
                  <th className="head-cell">
                    <b>Роль</b>
                  </th>
                  <th className="head-cell">
                    <b>Створено</b>
                  </th>
                  <th className="head-cell">
                    <b>Оновлено</b>
                  </th>
                  <th className="head-cell">
                    <b>Дії</b>
                  </th>
                </tr>
              </thead>
              <tbody>
                {users.map((item) => (
                  <tr className="table-row" key={item._id}>
                    <td className="table-cell name">{item._id}</td>
                    <td className="table-cell category">{item.name}</td>
                    <td className="table-cell">{item.email}</td>

                    <td className="table-cell">
                      {item.role === "super-admin" ? (
                        "BOSS"
                      ) : (
                        <select
                          value={item.role}
                          className="role-select"
                          onChange={(e) => changeUserRole(e, item._id)}
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      )}
                    </td>
                    <td className="table-cell">
                      {formattedDate(item.createdAt)}
                    </td>
                    <td className="table-cell">
                      {formattedDate(item.updatedAt)}
                    </td>
                    <td className="table-cell">
                      <div className="action-cell">
                        {item.role === "super-admin" ? (
                          <span style={{ fontSize: "30px" }}>😎</span>
                        ) : (
                          <svg
                            onClick={() => {
                              setUserToDelete((prev) => ({
                                ...prev,
                                userId: item._id,
                                username: item.name,
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
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      ) : (
        <div className="empty-page">
          <h2>Немає користувачів</h2>
          <img src={assets.empty_page} alt="no users" />
        </div>
      )}
    </section>
  );
};

export default UsersList;
