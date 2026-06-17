const EmptyState = ({
  title = "No Data Found",
  description = "Nothing to show here yet.",
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-gray-400">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-sm mt-1">{description}</p>
    </div>
  );
};

export default EmptyState;