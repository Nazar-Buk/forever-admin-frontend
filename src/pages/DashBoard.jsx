import { useState } from "react";

import BreadCrumbs from "../components/BreadCrumbs";
import CloudinaryUsage from "../components/CloudinaryUsage";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const DashBoard = () => {
  const [loadingState, setLoadingState] = useState({
    isLoadingCloudinaryData: true,
  });

  return (
    <section className="dashboard">
      <BreadCrumbs />

      <h2 className="page-title">Dashboard</h2>
      <CloudinaryUsage
        loadingState={loadingState}
        setLoadingState={setLoadingState}
        backendUrl={backendUrl}
      />
    </section>
  );
};

export default DashBoard;
