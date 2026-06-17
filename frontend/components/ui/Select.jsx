export default function Select({ children, ...props }) {
  return (
    <select
      {...props}
      className="w-full bg-[#1F2937] border border-gray-700 rounded-xl p-3 text-white focus:border-violet-500 outline-none"
    >
      {children}
    </select>
  );
}