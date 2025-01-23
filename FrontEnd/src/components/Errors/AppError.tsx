const AppError = () => {
  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-2 flex flex-col items-center justify-center gap-y-5">
        <p className="text-8xl font-bold tracking-wider text-[#6ea8af] sm:text-6xl">
          <strong>O</strong>ops!
        </p>

        <p className="text-center text-sm font-bold tracking-wider text-[#81a1afee] sm:text-lg">
          An unexpected error occurred!
        </p>

        <button
          onClick={() => (window.location.href = import.meta.env.VITE_CLIENT_BASE_URL)}
          className="w-full rounded-lg bg-[#0f1b22f1] py-1 text-2xl font-bold text-[#95aeb9] sm:text-lg md:py-2"
        >
          Reload APP
        </button>
      </div>
    </div>
  );
};

export default AppError;
