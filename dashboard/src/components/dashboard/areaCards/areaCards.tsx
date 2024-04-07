import AreaCard from "./AreaCard";
import "./AreaCards.scss";

const AreaCards = () => {
  return (
    <section className="content-area-cards">
      <AreaCard
        colors={["#e4e8ef", "#475be8"]}
        percentFillValue={80}
        cardInfo={{
          title: "Todays Sales",
          value: "$20.4K",
          text: "We have sold 123 items.",
        }}
      />
    </section>
  );
};

export default AreaCards;