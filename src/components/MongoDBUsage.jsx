import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

import PieChartWithPaddingAngle from "./PieChartWithPaddingAngle";

const chartClass = "wrap-mongo-chart";
const COLORS = ["#FF8042", "#3CB371", "#c40000", "#FFBB28"];

const MongoDBUsage = ({ setLoadingState, backendUrl }) => {
  const [mongoData, setMongoData] = useState({});

  const fetchMongoDBData = async () => {
    try {
      setLoadingState((prev) => ({ ...prev, isLoadingMongoData: true }));

      const response = await axios.get(backendUrl + "/api/mongo-usage");

      if (response.data.success) {
        setMongoData(response.data.mongoUsage);

        setLoadingState((prev) => ({ ...prev, isLoadingMongoData: false }));
      }
    } catch (error) {
      console.log(error, "error");
      setLoadingState((prev) => ({ ...prev, isLoadingMongoData: false }));
      toast.error(
        error.response?.data?.message ||
          "Something went wrong with fetchMongoDBData!"
      );
    }
  };

  console.log(mongoData, "mongoData");

  const { limitData, usedData } = mongoData;

  const chartsData = {
    data: [
      {
        name: `Used ${usedData?.totalDbData.value} ${usedData?.totalDbData.unit}`,
        value: usedData?.totalDbData.value,
      },
      {
        name: `Limit ${limitData?.value} ${limitData?.unit}`,
        value: limitData?.value,
      },
    ],
  };

  useEffect(() => {
    fetchMongoDBData();
  }, []);

  return (
    <section className="mongo-box">
      <h2 className="box-title">MongoDB Usage / Limits</h2>
      <PieChartWithPaddingAngle
        chartsData={chartsData}
        chartClass={chartClass}
        COLORS={COLORS}
      />
    </section>
  );
};

export default MongoDBUsage;
