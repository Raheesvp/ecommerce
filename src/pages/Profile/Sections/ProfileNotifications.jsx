import React, { useState } from "react";
import { Bell, Mail, Smartphone } from "lucide-react";

const ProfileNotifications = () => {
  const [settings, setSettings] = useState({
    email: true,
    sms: false,
    push: true
  });

  const toggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

    const Toggle = ({ icon: Icon, label, enabled, onChange }) => (
  <div className="flex items-center justify-between bg-gray-700/30 p-4 rounded-xl border border-gray-600/50">
    <div className="flex items-center gap-3">
      <Icon size={20} className="text-green-400" />
      <span className="text-white font-medium">{label}</span>
    </div>

    <button
      onClick={onChange}
      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
        enabled ? "bg-green-500" : "bg-gray-600"
      }`}
    >
      <span
        className={`block w-5 h-5 bg-white rounded-full transform transition-transform ${
          enabled ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  </div>
);

  return (
    <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
        <Bell size={24} />
        Notification Settings
      </h2>

      <div className="space-y-4 max-w-md">
        <Toggle
          icon={Mail}
          label="Email Notifications"
          enabled={settings.email}
          onChange={() => toggle("email")}
        />

        <Toggle
          icon={Smartphone}
          label="SMS Notifications"
          enabled={settings.sms}
          onChange={() => toggle("sms")}
        />

        <Toggle
          icon={Bell}
          label="Push Notifications"
          enabled={settings.push}
          onChange={() => toggle("push")}
        />
      </div>

      

      <p className="text-gray-500 text-xs mt-6">
        Notification preferences will be saved automatically.
      </p>
    </div>
  );




  
};

export default ProfileNotifications;


