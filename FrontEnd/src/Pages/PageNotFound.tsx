import { useNavigate } from "react-router-dom";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="flex items-center justify-center h-full">
      <div className="flex flex-col items-center justify-center gap-y-5 mx-2">
        <p className="text-[#6ea8af] text-8xl sm:text-6xl font-bold tracking-wider">
          <strong>O</strong>ops!
        </p>
        <div className="w-full ">
          <p className="text-lg xs:text-sm tracking-wider text-[#81a1afee] font-bold text-center">
            404 - PAGE NOT FOUND
          </p>
          <p className="text-lg xs:text-sm tracking-wider text-[#81a1afee] font-bold text-center">
            the page you are looking for might be or removed
          </p>
          <p className="text-lg xs:text-sm tracking-wider text-[#81a1afee] font-bold text-center">
            had it's name changed or is temporarily unavailable
          </p>
        </div>
        <button
          onClick={() => navigate("/")}
          className="w-full py-2 xs:py-1 text-[#95aeb9]  text-2xl sm:text-lg font-bold bg-[#0f1b22f1] rounded-lg"
        >
          GO TO HOMEPAGE
        </button>
      </div>
    </div>
  );
};

export default PageNotFound;
