import { guessColor } from "../assets";
import { GameCard } from "../components";
import { tasks } from "../helper/data";

const Games = () => {
  return (
    <div className="p-4 m-4">
      <h1 className="font-bold text-lg text-gray-300 p-3 border-b mb-4">
        GAMES
      </h1>
      <div
        className={`grid grid-cols-7 xl:grid-cols-5 lg:grid-cols-3 sm:grid-cols-3 xs:grid-cols-2
         gap-3 p-2`}
      >
        <GameCard
          key={"guessCards"}
          id={"guesscard"}
          name={"Guess Card"}
          image={guessColor}
          description={"guess cards and Earn Reawads immediatly"}
          category={"game"}
          prize={30}
          firstItem={false}
        />
        {tasks
          .filter((item) => item.category === "Game")
          .map(({ name, description, category, id, prize, image }) => (
            <GameCard
              key={id}
              id={id}
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

export default Games;
