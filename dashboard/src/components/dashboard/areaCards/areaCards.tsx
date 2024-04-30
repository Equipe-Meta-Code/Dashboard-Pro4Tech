import AreaCard from "./areaCard";
import "./AreaCards.scss";

const AreaCards = () => {
  return (
    <section className="content-area-cards">
      <AreaCard colors={["#0088FE", "#00C49F"]} percentFillValue={60} metaVendas={50000} />

    </section>
  );
};

export default AreaCards;
