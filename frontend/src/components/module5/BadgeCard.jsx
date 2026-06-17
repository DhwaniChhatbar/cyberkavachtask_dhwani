import React from "react";
import { FaMedal, FaStar } from "react-icons/fa";

const BadgeCard = ({ badge = "No Badge", points = 0 }) => {
  const badgeStyles = {
    Platinum: {
      border: "border-cyan-400",
      text: "text-cyan-300",
      bg: "bg-cyan-500/20",
      gradient: "from-cyan-900/30 to-cyan-700/10",
    },

    Gold: {
      border: "border-yellow-400",
      text: "text-yellow-300",
      bg: "bg-yellow-500/20",
      gradient: "from-yellow-900/30 to-yellow-600/10",
    },

    Silver: {
      border: "border-gray-400",
      text: "text-gray-200",
      bg: "bg-gray-500/20",
      gradient: "from-gray-800 to-gray-700",
    },

    Bronze: {
      border: "border-orange-400",
      text: "text-orange-300",
      bg: "bg-orange-500/20",
      gradient: "from-orange-900/30 to-orange-700/10",
    },

    "No Badge": {
      border: "border-gray-700",
      text: "text-white",
      bg: "bg-gray-800",
      gradient: "from-gray-900 to-gray-800",
    },
  };

  const style = badgeStyles[badge] || badgeStyles["No Badge"];

  return (
    <div
      className={`
        w-full
        rounded-3xl
        border
        ${style.border}
        bg-gradient-to-r
        ${style.gradient}
        p-6
        shadow-xl
        transition-all
        duration-300
        hover:-translate-y-1
        hover:shadow-2xl
      `}
    >
      <div className="flex items-center gap-5">
        <div
          className={`
            h-16 w-16
            rounded-full
            flex items-center justify-center
            ${style.bg}
          `}
        >
          <FaMedal className={`text-4xl ${style.text}`} />
        </div>

        <div className="flex-1">
          <h2 className={`text-3xl font-bold ${style.text}`}>
            {badge}
          </h2>

          <div className="mt-2 flex items-center gap-2 text-gray-300">
            <FaStar className="text-yellow-400" />
            <span className="text-lg font-medium">
              {points} Points
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadgeCard;