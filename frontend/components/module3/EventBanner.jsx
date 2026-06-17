import React from "react";

const EventBanner = ({ poster, name }) => {
  return (
    <div className="rounded-2xl overflow-hidden">
      <img
        src={
          poster ||
          "https://via.placeholder.com/1200x400?text=Event+Banner"
        }
        alt={name}
        className="w-full h-72 object-cover"
      />
    </div>
  );
};

export default EventBanner;