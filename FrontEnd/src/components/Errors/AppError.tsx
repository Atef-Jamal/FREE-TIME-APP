const AppError = () => {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col items-center justify-center gap-y-5 mx-2">
        <p className="text-[#6ea8af] text-8xl sm:text-6xl font-bold tracking-wider">
          <strong>O</strong>ops!
        </p>

        <p className="text-lg xs:text-sm tracking-wider text-[#81a1afee] font-bold text-center">
          An unexpected error occurred!
        </p>

        <button
          onClick={() =>
            (window.location.href = import.meta.env.VITE_CLIENT_BASE_URL)
          }
          className="w-full py-2 xs:py-1 text-[#95aeb9]  text-2xl sm:text-lg font-bold bg-[#0f1b22f1] rounded-lg"
        >
          Reload APP
        </button>
      </div>
    </div>
  );
};

export default AppError;
