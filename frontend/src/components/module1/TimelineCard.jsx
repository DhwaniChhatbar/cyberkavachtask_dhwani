import React from "react";

const TimelineCard = ({ timeline }) => {
  return (
    <div className="bg-gray-900 rounded-xl p-4 border border-gray-800">
      <div className="flex items-start gap-3">
        <div className="w-3 h-3 bg-blue-500 rounded-full mt-2"></div>

        <div className="flex-1">
          <h3 className="font-semibold text-white">
            {timeline.action}
          </h3>

          <p className="text-gray-400 text-sm mt-1">
            {timeline.comment}
          </p>

          <p className="text-xs text-gray-500 mt-2">
            {new Date(timeline.createdAt || Date.now()).toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TimelineCard;