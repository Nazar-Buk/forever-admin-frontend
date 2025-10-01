import BreadCrumbs from "../components/BreadCrumbs";
import CloudinaryUsage from "../components/CloudinaryUsage";

const DashBoard = () => {
  return (
    <section className="dashboard">
      <BreadCrumbs />

      <h2 className="page-title">Dashboard</h2>
      <CloudinaryUsage />
    </section>
  );
};

export default DashBoard;
