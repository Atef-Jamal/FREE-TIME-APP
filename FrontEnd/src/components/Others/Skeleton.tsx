const Skeleton = ({ className }: { className: string }) => {
  return (
    <div
      className={`relative skeleton-box overflow-hidden bg-[#3f4055] animate-pulse ${
        className || "rounded-md"
      }`}
    ></div>
  );
};

export default Skeleton;
