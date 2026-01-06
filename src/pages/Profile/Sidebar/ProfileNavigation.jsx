const ProfileNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { key: "profile", label: "Profile" },
    {key :"orders",label:"Orders"},
    { key: "security", label: "Security" },
    { key: "notifications", label: "Notifications" }
  ];

  return (
    <nav className="mt-6 space-y-2">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => setActiveTab(tab.key)}
          className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium
            ${activeTab === tab.key
              ? "bg-green-600 text-white"
              : "text-gray-300 hover:bg-gray-700"}
          `}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
};

export default ProfileNavigation;
