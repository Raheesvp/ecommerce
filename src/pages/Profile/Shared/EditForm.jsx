import React from "react";

const EditForm = ({ user, setUser }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({
      ...prev,
      [name]: value
    }));
  };

const inputStyle = "w-full bg-gray-900/50 text-white border border-gray-600 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all placeholder-gray-400";

  return (
    <div className="space-y-4">
      <input
        name="firstName"
        value={user.firstName ||user.FirstName || ""}
        onChange={handleChange}
        placeholder="First Name"
        className={inputStyle}
      />

      <input
        name="lastName"
        value={user.lastName || user.LastName || ""}
        onChange={handleChange}
        placeholder="Last Name"
        className={inputStyle}
      />

    

      <input
        name="mobileNumber"
        value={user.mobileNumber ||user.phone || ""}
        onChange={handleChange}
        placeholder="Mobile Number"
        className={inputStyle}
      />

   
    </div>
  );
};

export default EditForm;
