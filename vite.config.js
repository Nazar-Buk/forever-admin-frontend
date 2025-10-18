import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5174, // щоб на цьому потрі запускався,

    // allowedHosts: [
    //   // allowedHosts ЦЕ ДОЗВОЛЯЄ РОБИТИ ТУНЕЛЬ розкоментуй
    //   ".loca.lt", // дозволить будь-який localtunnel-домен
    //   ".ngrok.io", // якщо захочеш тестити через ngrok
    //   ".srv.us", // саме твій випадок (lt видав піддомен на цьому хості)
    // ],
  },
  // base: "/forever-admin-frontend/", // розкоментуй base щоб дивитися проект локально
  base: "/", // для того щоб можна було розгорнути на хостингу
});
