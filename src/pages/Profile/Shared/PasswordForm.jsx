const PasswordForm = ({ passwordData, setPasswordData, onSubmit }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-md space-y-5">
      <div>
        <label className="text-gray-400 text-sm">Current Password</label>
        <input
          type="password"
          name="currentPassword"
          value={passwordData.currentPassword || ""}
          onChange={handleChange}
          className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
        />
      </div>

      <div>
        <label className="text-gray-400 text-sm">New Password</label>
        <input
          type="password"
          name="newPassword"
          value={passwordData.newPassword || ""}
          onChange={handleChange}
          className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
        />
      </div>

      <div>
        <label className="text-gray-400 text-sm">Confirm New Password</label>
        <input
          type="password"
          name="confirmPassword"
          value={passwordData.confirmPassword || ""}
          onChange={handleChange}
          className="w-full mt-1 px-4 py-2 rounded-lg bg-gray-800 text-white border border-gray-700"
        />
      </div>

      <button type="button"
        onClick={onSubmit}
        className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-semibold"
      >
        Update Password
      </button>
    </div>
  );
};

export default PasswordForm;
