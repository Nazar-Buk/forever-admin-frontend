import { useEffect, useState } from "react";

const NetworkStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine); //navigator.onLine — це вбудована властивість браузера,
  // яка повертає true або false залежно від статусу інтернет-з'єднання.

  useEffect(() => {
    // ВАЖЛИВО! сказати що такі події як online, offline взаємодіють із вікном браузера та викликаються незалежно від реакту, тобто
    // useEffect тут скоріше для того щоб підписка була лише один раз і при розмонтуванні компонента ми могли відписатися від слухачів подій.

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline); // Коли інтернет з’явився — подія online, оновлює стан  у true.
    window.addEventListener("offline", handleOffline); // Коли інтернет зник — подія offline, оновлює стан у false.

    return () => {
      console.log("Компонент розмонтовується.");
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (!isOnline) {
    return (
      <div className="network-warning">
        ❌ Your internet connection was lost. Try again later.
      </div>
    );
  }

  return null;
};

export default NetworkStatus;
