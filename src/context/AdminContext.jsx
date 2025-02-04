import { createContext, useState, useEffect } from "react";

export const AdminContext = createContext(); // створюємо контекст та називаю його MyContext

// створюємо првайдер для контексту

const AdminContextProvider = (props) => {
  // Тут створюю дані які будуть використовуватися через контекст

  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  ); // шукаю дані в localStorage по назві token

  useEffect(() => {
    localStorage.setItem("token", token); // записую дані в localStorage, перший параметр назва ключа, другий параметр -- дані
  }, [token]);

  const value = {
    token,
    setToken,
  };

  return (
    <AdminContext.Provider value={value}>
      {props.children}
    </AdminContext.Provider>
  );
};

export default AdminContextProvider;
