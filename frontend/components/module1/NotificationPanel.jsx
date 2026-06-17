import React from "react";

const NotificationPanel = ({ notifications }) => {
  return (
    <div className="bg-gray-900 rounded-2xl p-5 shadow-lg">
      <h2 className="text-xl font-bold text-white mb-4">
        Notifications
      </h2>

      {notifications.length === 0 ? (
        <div className="text-gray-400">
          No notifications available.
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification._id}
              className="bg-gray-800 rounded-xl p-4 border border-gray-700"
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-blue-400">
                  {notification.type}
                </span>

                <span className="text-xs text-gray-500">
                  {new Date(
                    notification.createdAt
                  ).toLocaleString()}
                </span>
              </div>

              <p className="text-white mt-2">
                {notification.message}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotificationPanel;