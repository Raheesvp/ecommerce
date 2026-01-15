import React from "react";

const InfoGrid = ({ user }) => {
  if (!user) return null;

  const fields = [
    { label: "Designation: First Name", value: user.firstName || user.FirstName },
    { label: "Designation: Last Name", value: user.lastName || user.LastName },
    { label: "Comm-Link: Email Address", value: user.email },
    { label: "Comm-Link: Mobile Number", value: user.mobileNumber || user.PhoneNumber },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {fields.map((field, index) => (
        <div
          key={index}
          className="group relative bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl p-5 transition-all duration-300 hover:border-red-600/30 hover:bg-black/60"
        >
          {/* Accent Line */}
          <div className="absolute top-4 left-0 w-[2px] h-8 bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity" />
          
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 mb-2">
            {field.label}
          </p>
          
          <p className="text-white font-bold italic uppercase tracking-tight text-lg">
            {field.value || "---"}
          </p>

          {/* Background Glow on Hover */}
          <div className="absolute inset-0 bg-red-600/5 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity pointer-events-none" />
        </div>
      ))}
    </div>
  );
};

export default InfoGrid;