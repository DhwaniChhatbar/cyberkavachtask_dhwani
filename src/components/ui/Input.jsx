export default function Input(props) {
  return (
    <input
      {...props}
      className="w-full bg-[#1F2937] border border-gray-700 rounded-xl p-3 text-white focus:border-violet-500 outline-none"
    />
  );
}