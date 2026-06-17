import React from "react";
import MemberAttendanceCard from "../components/module4/MemberAttendanceCard";

const AttendanceReport = () => {
  const members = [
    {
      name: "Rahul Sharma",
      status: "Checked Out",
      checkIn: "10:00 AM",
      checkOut: "4:00 PM",
    },
    {
      name: "Priya Patel",
      status: "Checked In",
      checkIn: "10:20 AM",
      checkOut: "-",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <h1 className="text-3xl font-bold text-white mb-6">
        Attendance Report
      </h1>

      <div className="grid md:grid-cols-2 gap-6">
        {members.map((member, index) => (
          <MemberAttendanceCard
            key={index}
            {...member}
          />
        ))}
      </div>
    </div>
  );
};

export default AttendanceReport;