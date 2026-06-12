export default function Button({
  children,
  className = "",
  ...props
}) {
  return (
    <button
      {...props}
      className={`bg-violet-600 hover:bg-violet-700 rounded-xl px-4 py-2 font-semibold transition duration-300 ${className}`}
    >
      {children}
    </button>
  );
}