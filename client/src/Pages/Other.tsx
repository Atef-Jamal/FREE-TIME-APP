import { empty } from "../assets";

const Other = () => {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="flex flex-col items-center justify-center mt-10 ">
        <img alt={""} src={empty} />
        <span className="text-gray-400 tracking-wider font-bold my-4 sm:text-sm ">
          Empty
        </span>
        <span className="text-gray-400 tracking-wider sm:text-sm ">
          There is No tasks Here Right Now
        </span>
      </div>
    </div>
  );
};

export default Other;
