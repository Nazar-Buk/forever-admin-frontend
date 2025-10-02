import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import { assets } from "../admin_assets/assets";
import PieChartWithPaddingAngle from "./PieChartWithPaddingAngle";
import Loader from "./Loader";

const CloudinaryUsage = ({ loadingState, setLoadingState, backendUrl }) => {
  const [cloudinaryData, setCloudinaryData] = useState({});

  const fetchCloudinaryData = async () => {
    try {
      setLoadingState((prev) => ({ ...prev, isLoadingCloudinaryData: true }));

      const response = await axios.get(backendUrl + "/api/cloudinary-usage");
      if (response.data.success) {
        setCloudinaryData(response.data.memoryData);

        setLoadingState((prev) => ({
          ...prev,
          isLoadingCloudinaryData: false,
        }));
      }
    } catch (error) {
      console.log(error, "error");
      setLoadingState((prev) => ({
        ...prev,
        isLoadingCloudinaryData: false,
      }));
      toast.error(
        error.response?.data?.message ||
          "Something went wrong with fetchCloudinaryUsageData!"
      );
    } finally {
      setLoadingState((prev) => ({
        ...prev,
        isLoadingCloudinaryData: false,
      }));
    }
  };

  const {
    bandwidth,
    plan,
    storage,
    storageLimitGB,
    totalUsedCredits,
    transformations,
  } = cloudinaryData;

  const chartsData = {
    data: [
      { name: `Used ${totalUsedCredits} credits`, value: totalUsedCredits },
      {
        name: `Limit ${storageLimitGB?.limit} credits`,
        value: storageLimitGB?.limit,
      },
    ],
  };

  useEffect(() => {
    fetchCloudinaryData();
  }, []);

  const loading = loadingState.isLoadingCloudinaryData;

  return (
    <section className="cloudinary-box">
      {loading && <Loader />}
      <h2 className="box-title">Cloudinary Usage / Limits</h2>
      <div className="wrap-cloudinary-content">
        <PieChartWithPaddingAngle chartsData={chartsData} />

        <div className="cloudinary-info__box">
          <div className="wrapper-info">
            <div className="picture-title">
              <img className="info__img" src={assets.plan} alt="Plan icon" />
              <h2 className="info__title">
                Current Plan: <span>{plan}</span>
              </h2>
            </div>
          </div>
          <div className="wrapper-info">
            <div className="picture-title">
              <img
                className="info__img"
                src={assets.picture_icon}
                alt="Transformation icon"
              />
              <h2 className="info__title">Transformation</h2>
            </div>
            <p className="info__count">{transformations?.used}</p>
          </div>

          <div className="wrapper-info">
            <div className="picture-title">
              <img
                className="info__img"
                src={assets.speedometer_icon}
                alt="Bandwidth icon"
              />
              <h2 className="info__title">Bandwidth</h2>
            </div>
            <p className="info__count">
              {bandwidth?.used.credits} {bandwidth?.used.unit}
            </p>
          </div>

          <div className="wrapper-info">
            <div className="picture-title">
              <img
                className="info__img"
                src={assets.storage_icon}
                alt="Storage icon"
              />
              <h2 className="info__title">Storage</h2>
            </div>
            <p className="info__count">
              {storage?.used.value} {storage?.used.unit}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CloudinaryUsage;
