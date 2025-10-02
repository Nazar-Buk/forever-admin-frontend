import { useState } from "react";

import BreadCrumbs from "../components/BreadCrumbs";
import CloudinaryUsage from "../components/CloudinaryUsage";
import MongoDBUsage from "../components/MongoDBUsage";
import Loader from "../components/Loader";

const backendUrl = import.meta.env.VITE_BACKEND_URL;

const DashBoard = () => {
  const [loadingState, setLoadingState] = useState({
    isLoadingCloudinaryData: true,
    isLoadingMongoData: true,
  });

  const loading =
    loadingState.isLoadingCloudinaryData || loadingState.isLoadingMongoData;

  return (
    <section className="dashboard">
      <BreadCrumbs />
      {loading && <Loader />}

      <h2 className="page-title">Dashboard</h2>
      <CloudinaryUsage
        setLoadingState={setLoadingState}
        backendUrl={backendUrl}
      />
      <MongoDBUsage setLoadingState={setLoadingState} backendUrl={backendUrl} />
    </section>
  );
};

export default DashBoard;
