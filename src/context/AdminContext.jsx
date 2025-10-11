import { createContext, useState, useEffect } from "react";

export const AdminContext = createContext(); // створюємо контекст та називаю його MyContext

// створюємо првайдер для контексту

const AdminContextProvider = (props) => {
  // Тут створюю дані які будуть використовуватися через контекст

  // const currency = "$";
  const currency = "грн";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUseData] = useState({
    username: "",
    userRole: "",
  });

  isModalOpen
    ? (document.body.style.overflow = "hidden") // Забороняємо скролінг сайту
    : (document.body.style.overflow = ""); // Відновлюємо скролінг сайту

  const value = {
    currency,
    isModalOpen,
    setIsModalOpen,
    userData,
    setUseData,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
