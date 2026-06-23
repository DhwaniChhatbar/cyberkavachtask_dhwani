import React from "react";

const WaitlistCard = ({
  registrations = 0,
  capacity = 0,
}) => {
  const safeRegistrations = Number(registrations) || 0;
  const safeCapacity = Number(capacity) || 0;

  const waitlist =
    safeRegistrations > safeCapacity
      ? safeRegistrations - safeCapacity
      : 0;

  const availableSlots =
    safeCapacity > safeRegistrations
      ? safeCapacity - safeRegistrations
      : 0;

  return (
    <div className="bg-gray-900 p-6 rounded-2xl">
      <h2 className="text-xl font-bold mb-4">
        Waitlist Status
      </h2>

      <div className="space-y-3 text-gray-300">
        <p>
          Capacity :{" "}
          <span className="font-semibold text-white">
            {safeCapacity}
          </span>
        </p>

        <p>
          Total Registrations :{" "}
          <span className="font-semibold text-white">
            {safeRegistrations}
          </span>
        </p>

        <p>
          Available Slots :{" "}
          <span className="font-semibold text-green-400">
            {availableSlots}
          </span>
        </p>

        <p>
          Waitlist :{" "}
          <span
            className={`font-semibold ${
              waitlist > 0
                ? "text-red-400"
                : "text-green-400"
            }`}
          >
            {waitlist}
          </span>
        </p>

        {waitlist > 0 ? (
          <p className="text-sm text-red-300 mt-4">
            Capacity exceeded. Additional registrations are on the waitlist.
          </p>
        ) : (
          <p className="text-sm text-green-300 mt-4">
            Registration is within capacity.
          </p>
        )}
      </div>
    </div>
  );
};

export default WaitlistCard;