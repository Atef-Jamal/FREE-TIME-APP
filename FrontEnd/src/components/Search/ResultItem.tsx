const ResultItem = ({
  searchElement,
  searchQuery,
}: {
  searchElement: {
    _id: string;
    title: string;
    description: string;
    link: string;
  };
  searchQuery: string;
}) => {
  const slices = searchElement.title.split(
    new RegExp(`(${searchQuery})`, "gi")
  );
  return slices.map((slice, i) => {
    const isMatched =
      slice.toLocaleLowerCase() === searchQuery.toLocaleLowerCase();
    return (
      <span
        key={i}
        className={`${
          isMatched ? "bg-[#80f064e7] text-[#495064]" : "text-[#afaaaa]"
        } sm:text-sm `}
      >
        {slice}
      </span>
    );
  });
};

export default ResultItem;
