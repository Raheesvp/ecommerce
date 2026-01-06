const InfoGrid = ({ user }) => {
  if (!user) return null;

  const fields = [
    { label: "First Name", value: user.firstName || user.FirstName },
    { label: "Last Name", value: user.lastName || user.LastName },
    { label: "Email", value: user.email  },
    { label: "Mobile Number", value: user.mobileNumber || user.PhoneNumber },
  
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {fields.map((field, index) => (
        <div
          key={index}
          className="bg-gray-800/50 border border-gray-700 rounded-xl p-4"
        >
          <p className="text-sm text-gray-400 mb-1">
            {field.label}
          </p>
          <p className="text-white font-medium">
            {field.value}
          </p>
        </div>
      ))}
    </div>
  );
};

export default InfoGrid;
