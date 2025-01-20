import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex h-full items-center justify-center">
      <div className="mx-auto flex w-[90%] max-w-[500px] flex-col items-center justify-center gap-y-5">
        <p className="text-6xl font-bold tracking-wider text-[#6ea8af] lg:text-8xl">
          <strong>O</strong>ops!
        </p>
        <div className="w-full">
          <p className="text-center text-sm font-bold tracking-wider text-[#81a1afee] lg:text-lg">
            404 - PAGE NOT FOUND
          </p>
          <p className="text-center text-sm font-bold tracking-wider text-[#81a1afee] lg:text-lg">
            the page you are looking for might be or removed, had it's name changed or is temporarily
            unavailable
          </p>
          {/* <p className="text-center text-sm font-bold tracking-wider text-[#81a1afee] lg:text-lg">
            
          </p> */}
        </div>
        <button
          onClick={() => navigate("/")}
          className="w-full rounded-lg bg-[#0f1b22f1] py-2 text-lg font-bold text-[#95aeb9] lg:text-2xl"
        >
          GO TO HOMEPAGE
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
