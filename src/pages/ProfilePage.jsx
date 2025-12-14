import React, { useContext, useEffect, useState } from "react";
import api from "../Api/AxiosInstance";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { 
  User, Mail, Lock, Camera, Edit3, Save, X, Shield, 
  CreditCard, MapPin, Phone, Calendar, Award, 
  ShoppingBag, Heart, LogOut, Bell, Settings 
} from "lucide-react";
import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/WishlistContext";

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const { cartLength } = useContext(CartContext);
  const { wishlistLength } = useContext(WishlistContext);
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    orders: 0,
    wishlist: 0,
    reviews: 0
  });

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (!storedUser) {
        toast.error("You are not logged in!");
        navigate("/login");
        return;
      }

      try {
        setIsLoading(true);
        const res = await api.get(`/users/${storedUser.id}`);
        setUser(res.data);
        
        // Fetch user stats (mock data - replace with actual API calls)
        setStats({
          orders: 12,
          wishlist: 8,
          reviews: 5
        });
      } catch (err) {
        console.error("Error fetching user:", err.response?.data || err.message);
        toast.error("Failed to load profile data!");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const validatePassword = (password) => {
    if (password.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return null;
  };

const handlePasswordUpdate = async () => {
  try {
    const res = await api.get(`/users/${user.id}`);
    if (res.data.password !== passwordData.currentPassword) {
      toast.error("Current password is incorrect!");
      return;
    }

    await api.patch(`/users/${user.id}`, {
      password: passwordData.newPassword,
      confirmPassword: passwordData.newPassword
    });

    toast.success("Password changed successfully!");
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
  } catch (err) {
    console.error("Error changing password:", err);
    toast.error("Something went wrong!");
  }
};


  const handleSave = async () => {
    try {
      const res = await api.patch(`/users/${user.id}`, user);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data.id));
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Failed to update profile!");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        toast.error("Please select a valid image file");
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB");
        return;
      }

      const imageUrl = URL.createObjectURL(file);
      setUser((prev) => ({ ...prev, image: imageUrl }));
      
      // Here you would typically upload the image to your server
      // uploadProfileImage(file);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  const handleCancel = () => {
    // Reload original user data
    const fetchOriginal = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        const res = await api.get(`/users/${storedUser}`);
        setUser(res.data);
      }
    };
    fetchOriginal();
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-20 pb-10 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
            My Profile
          </h1>
          <p className="text-gray-400">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700/50">
              {/* Profile Summary */}
              <div className="text-center mb-6">
                <div className="relative inline-block">
                  <img
                    src={user.image}
                    alt="Profile"
                    className="w-24 h-24 rounded-2xl border-4 border-green-500/50 object-cover shadow-lg mx-auto"
                  />
                  <label htmlFor="image-upload" className="absolute bottom-0 right-0 bg-green-500 p-2 rounded-full cursor-pointer hover:bg-green-600 transition-colors">
                    <Camera size={16} className="text-white" />
                    <input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <h2 className="text-xl font-bold text-white mt-4">{user.firstName} {user.lastName}</h2>
                <p className="text-gray-400 text-sm">{user.email}</p>
                <div className="mt-2">
                  <span className="inline-block bg-green-500/20 text-green-400 text-xs px-3 py-1 rounded-full border border-green-500/30">
                    Premium Member
                  </span>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {[
                  { id: "profile", icon: User, label: "Profile Info" },
                  { id: "security", icon: Shield, label: "Security" },
                  { id: "notifications", icon: Bell, label: "Notifications" },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                      activeTab === item.id
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "text-gray-400 hover:text-white hover:bg-gray-700/50"
                    }`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.label}</span>
                  </button>
                ))}
              </nav>

              {/* Stats */}
              <div className="mt-6 p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
                <h3 className="text-white font-semibold mb-3">Your Stats</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Orders</span>
                    <span className="text-white font-bold">{cartLength}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Wishlist</span>
                    <span className="text-white font-bold">{wishlistLength}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-sm">Reviews</span>
                    <span className="text-white font-bold">{stats.reviews}</span>
                  </div>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 mt-6 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-xl transition-all duration-200 border border-red-500/20"
              >
                <LogOut size={20} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Profile Info Tab */}
            {activeTab === "profile" && (
              <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <User size={24} />
                    Personal Information
                  </h2>
                  {!isEditing && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200"
                    >
                      <Edit3 size={18} />
                      Edit Profile
                    </button>
                  )}
                </div>

                {!isEditing ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InfoCard icon={User} label="Full Name" value={`${user.firstName} ${user.lastName}`} />
                    <InfoCard icon={Mail} label="Email" value={user.email} />
                    <InfoCard icon={Phone} label="Phone" value={user.phone || "Not set"} />
                    <InfoCard icon={MapPin} label="Address" value={user.address || "Not set"} />
                    <InfoCard icon={Calendar} label="Member Since" value="January 2024" />
                    <InfoCard icon={Award} label="Loyalty Points" value="1,250 Points" />
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">First Name</label>
                        <input
                          type="text"
                          name="firstName"
                          value={user.firstName}
                          onChange={handleChange}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                          placeholder="First Name"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Last Name</label>
                        <input
                          type="text"
                          name="lastName"
                          value={user.lastName}
                          onChange={handleChange}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                          placeholder="Last Name"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Email</label>
                        <input
                          type="email"
                          name="email"
                          value={user.email}
                          onChange={handleChange}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                          placeholder="Email"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Phone</label>
                        <input
                          type="tel"
                          name="phone"
                          value={user.phone || ""}
                          onChange={handleChange}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                          placeholder="Phone Number"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-gray-400 text-sm font-medium mb-2">Address</label>
                        <input
                          type="text"
                          name="address"
                          value={user.address || ""}
                          onChange={handleChange}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                          placeholder="Full Address"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 font-medium"
                      >
                        <Save size={18} />
                        Save Changes
                      </button>
                      <button
                        onClick={handleCancel}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl transition-all duration-200 font-medium"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === "security" && (
              <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                  <Shield size={24} />
                  Security Settings
                </h2>

                <div className="space-y-6 max-w-md">
                  {/* Change Password Section */}
                  <div className="bg-gray-700/30 rounded-xl p-6 border border-gray-600/50">
                    <h3 className="text-white font-semibold mb-4">Change Password</h3>

                    <div className="space-y-4">
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-1">Current Password</label>
                        <input
                          type="password"
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                          placeholder="Enter current password"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-1">New Password</label>
                        <input
                          type="password"
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                          placeholder="Enter new password"
                        />
                        <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters long</p>
                      </div>
                      <div>
                        <label className="block text-gray-400 text-sm font-medium mb-1">Confirm Password</label>
                        <input
                          type="password"
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          className="w-full p-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors"
                          placeholder="Confirm new password"
                        />
                      </div>

                      <button
                        onClick={handlePasswordUpdate}
                        className="w-full flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl transition-all duration-200 font-medium"
                      >
                        <Lock size={18} />
                        Change Password
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Notifications Tab */}
            {activeTab === "notifications" && (
              <div className="bg-gray-800/50 rounded-2xl p-8 backdrop-blur-sm border border-gray-700/50">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2 mb-6">
                  <Bell size={24} />
                  Notification Settings
                </h2>
                <div className="text-center py-12">
                  <Bell size={64} className="mx-auto text-gray-500 mb-4" />
                  <h3 className="text-xl text-white mb-2">Notification settings coming soon</h3>
                  <p className="text-gray-400">We're working on bringing you customizable notification preferences</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Reusable Info Card Component
const InfoCard = ({ icon: Icon, label, value }) => (
  <div className="bg-gray-700/30 rounded-xl p-4 border border-gray-600/50">
    <div className="flex items-center gap-3 mb-2">
      <Icon size={20} className="text-green-400" />
      <span className="text-gray-400 text-sm font-medium">{label}</span>
    </div>
    <p className="text-white font-semibold">{value}</p>
  </div>
);

export default ProfilePage;