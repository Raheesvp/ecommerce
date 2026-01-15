import React from "react";

const EditForm = ({ user, setUser }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Red Elite Theme Styles
  const inputStyle = "w-full bg-black/40 text-white border border-white/10 rounded-xl px-4 py-3.5 outline-none focus:border-red-600/50 focus:ring-1 focus:ring-red-600/20 transition-all placeholder-gray-600 text-sm font-medium italic";
  const labelStyle = "text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1 mb-1.5 block";

  return (
    <div className="space-y-6">
      {/* First Name Field */}
      <div className="group">
        <label className={labelStyle}>Identification: First Name</label>
        <input
          name="firstName"
          value={user.firstName || user.FirstName || ""}
          onChange={handleChange}
          placeholder="ENTER FIRST NAME"
          className={inputStyle}
        />
      </div>

      {/* Last Name Field */}
      <div className="group">
        <label className={labelStyle}>Identification: Last Name</label>
        <input
          name="lastName"
          value={user.lastName || user.LastName || ""}
          onChange={handleChange}
          placeholder="ENTER LAST NAME"
          className={inputStyle}
        />
      </div>

      {/* Mobile Number Field */}
      <div className="group">
        <label className={labelStyle}>Comm Link: Mobile Number</label>
        <input
          name="mobileNumber"
          value={user.mobileNumber || user.phone || ""}
          onChange={handleChange}
          placeholder="+X XXX XXX XXXX"
          className={inputStyle}
        />
      </div>
    </div>
  );
};

export default EditForm;