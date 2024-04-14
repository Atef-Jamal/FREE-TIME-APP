import { lazy } from "react";
const GameCard = lazy(() => import("../components/Offers/GameCard"));
import { tasks } from "../helper/data";

const OffersSignUp = () => {
  return (
    <div className="p-4 m-4">
      <h1 className="font-bold text-lg text-gray-300 p-3 border-b mb-4">
        SIGN UP
      </h1>
      <div
        className={`grid grid-cols-7 xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-3 xs:grid-cols-2
     gap-3 p-2`}
      >
        {tasks
          .filter((item) => item.category === "Signup")
          .map(({ name, description, category, _id, prize, image }) => (
            <GameCard
              key={_id}
              _id={_id}
              name={name}
              image={image}
              description={description}
              category={category}
              prize={prize}
            />
          ))}
      </div>
    </div>
  );
};

export default OffersSignUp;
