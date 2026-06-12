export default function Card({ children, className = "" }) {
  return (
    <div
      className={`bg-[#111827] border border-gray-800 rounded-2xl shadow-lg p-5 ${className}`}
    >
      {children}
    </div>
  );
}