const Skeleton = ({ className }: { className: string }) => {
  return (
    <div
      className={`relative skeleton-box overflow-hidden bg-[#3f4055] animate-pulse rounded-md ${className}`}
    ></div>
  );
};

export default Skeleton;
