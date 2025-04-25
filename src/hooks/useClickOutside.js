import { useEffect } from "react";

// Зробив так щоб кастомний селект закривався при кліку не на нього самого, а десь клікнути на екран і він закривається
// Поки я не дуже розумію що тут відбувається =)
const useClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      // Якщо клік всередині елемента — нічого не робимо

      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      // Інакше викликаємо колбек

      handler(event);
    };

    document.addEventListener("mousedown", listener); // mousedown -- це подія, яка спрацьовує відразу, як користувач натискає кнопку миші (до відпускання)
    document.addEventListener("touchstart", listener); // touchstart -- спрацьовує, коли користувач торкається екрану

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]);
};

export default useClickOutside;
