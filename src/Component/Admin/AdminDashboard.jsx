import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area
} from "recharts";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  Plus,
  Edit,
  TrendingUp,
  DollarSign,
  Eye,
  Calendar,
  Menu,
  X,
  Settings,
  LogOut,
  Bell,
  Search,
  ArrowLeft,
  Save,
  Trash2,
  ChevronDown,
  ChevronUp,
  Download,
  Filter,
  MoreVertical,
  UserPlus,
  Activity,
  PieChart as PieChartIcon,
  BarChart3,
  CreditCard
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../Api/AxiosInstance";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [viewMode, setViewMode] = useState('dashboard');
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const [usersCount, setUsersCount] = useState(0);
  const [ordersCount, setOrdersCount] = useState(0);
  const [productCount, setProductCount] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [recentOrders, setRecentOrders] = useState([]);
  const [topProducts, setTopProducts] = useState([]);

  const [dailySalesData, setDailySalesData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [customerGrowthData, setCustomerGrowthData] = useState([]);

  // Data for different sections
  const [usersData, setUsersData] = useState([]);
  const [ordersData, setOrdersData] = useState([]);
  const [productsData, setProductsData] = useState([]);

  const navigate = useNavigate();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user"));
      if (stored && stored.role === "admin") {
        // Already logged in, redirect to dashboard
        navigate("/admin/dashboard", { replace: true });
      }
    } catch (e) {
      // ignore parse errors
    }
  }, [navigate]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await api.get("/users");
        const users = res.data;
        setUsersData(users);

        // Count users
        setUsersCount(users.length);

        const resProducts = await api.get("/products");
        setProductsData(resProducts.data);
        setProductCount(resProducts.data.length);

        // Process category data for chart
        const categoryStats = processCategoryData(resProducts.data);
        setCategoryData(categoryStats);

        // Process customer growth data - now using login activity
        const growthData = processCustomerGrowthData(users);
        setCustomerGrowthData(growthData);

        // Count total orders across all users
        let totalOrders = 0;
        let totalRevenue = 0;
        let salesByDay = {};
        let allOrders = [];
        let productSales = {};

        users.forEach(user => {
          if (Array.isArray(user.order)) {
            totalOrders += user.order.length;

            user.order.forEach(order => {
              // Add user info to order for display
              allOrders.push({
                ...order,
                user: {
                  id: user.id,
                  name: `${user.firstName} ${user.lastName}`,
                  email: user.email,
                }
              });

              if (order.amount && order.date) {
                totalRevenue += Number(order.amount) ||0;
                const day = new Date(order.date).toISOString().split('T')[0];
                if (!salesByDay[day]) salesByDay[day] = 0;
                salesByDay[day] += order.amount;
              }

              // Track product sales
              if (order.items) {
                order.items.forEach(item => {
                  if (!productSales[item.name]) {
                    productSales[item.name] = { sales: 0, revenue: 0 };
                  }
                  productSales[item.name].sales += item.quantity;
                  productSales[item.name].revenue += item.price * item.quantity;
                });
              }
            });
          }
        });

        // Get top 5 products
        const topProductsList = Object.entries(productSales)
          .map(([name, stats]) => ({ name, ...stats }))
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 5);
        setTopProducts(topProductsList);

        // Get recent orders (last 5)
      const sortedOrders = [...allOrders]
      .filter(o=>o.date)
  .sort((a, b) => new Date(b.date) - new Date(a.date))
  .slice(0, 5);

        setRecentOrders(sortedOrders);

        setOrdersData(allOrders);
        setRevenue(Number(totalRevenue.toFixed(2)));
        setOrdersCount(totalOrders);

        // Prepare daily sales data for chart
        let formattedDailySales = Object.entries(salesByDay).map(([day, sales]) => ({ day, sales }));
        formattedDailySales.sort((a, b) => new Date(a.day) - new Date(b.day));
        setDailySalesData(formattedDailySales);

      } catch (err) {
        console.error(err);
        toast.error("Error Fetching Dashboard Data");
      }
    };

    fetchDashboardData();
  }, []);

  const processCategoryData = (products) => {
    const categoryCount = products.reduce((acc, product) => {
      const category = product.category || "Uncategorized";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(categoryCount).map(([name, value]) => ({ name, value }));
  };

  const processCustomerGrowthData = (users) => {
    // First, collect all login activity from users
    const loginActivity = [];

    users.forEach(user => {
      // Check if user has loginHistory array
      if (user.loginHistory && Array.isArray(user.loginHistory)) {
        user.loginHistory.forEach(login => {
          if (login.timestamp) {
            loginActivity.push({
              userId: user.id,
              timestamp: login.timestamp
            });
          }
        });
      }
      // If no login history, use the createdAt date as a fallback
      else if (user.createdAt) {
        loginActivity.push({
          userId: user.id,
          timestamp: user.createdAt
        });
      }
    });

    // Group login activity by month
    const monthlyData = {};

    loginActivity.forEach(login => {
      const d = new Date(login.timestamp);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

      if (!monthlyData[key]) {
        monthlyData[key] = {
          monthLabel: d.toLocaleString("default", { month: "short", year: "numeric" }),
          uniqueUsers: new Set(),
          totalLogins: 0
        };
      }

      // Add user to unique users set for this month
      monthlyData[key].uniqueUsers.add(login.userId);
      monthlyData[key].totalLogins += 1;
    });

    // Convert to array and calculate cumulative values
    let cumulativeUsers = 0;
    const result = Object.entries(monthlyData)
      .sort((a, b) => a[0].localeCompare(b[0])) // Sort by date
      .map(([monthKey, data]) => {
        const uniqueUsersCount = data.uniqueUsers.size;
        cumulativeUsers += uniqueUsersCount;

        return {
          month: data.monthLabel,
          newCustomers: uniqueUsersCount,
          totalCustomers: cumulativeUsers,
          totalLogins: data.totalLogins
        };
      });

    return result;
  };

  const handleSidebarClick = (item) => {
    if (item.id === 'dashboard') {
      setViewMode('dashboard');
      setActiveSection('dashboard');
    } else if (['users', 'orders', 'products', 'manage-products'].includes(item.id)) {
      setViewMode('data-view');
      setActiveSection(item.id);
    } else if (item.onClick) {
      item.onClick();
    } else {
      setActiveSection(item.id);
    }
  };

  const goBackToDashboard = () => {
    setViewMode('dashboard');
    setActiveSection('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Admin Logged out successfully");
    navigate("/login", { replace: true });
  };

  const renderDataView = () => {
    switch (activeSection) {
      case 'users':
        return navigate('/admin/users')
      case 'orders':
        return navigate('/admin/orderadmin');
      case 'products':
        return navigate('/admin/productadmin');
      case 'manage-products':
        return navigate('/admin/newproductadmin');
      default:
        return (
          <div className="bg-white rounded-xl p-8 shadow-lg border border-gray-200 text-center">
            <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              {sidebarItems.find(item => item.id === activeSection)?.icon && (
                React.createElement(sidebarItems.find(item => item.id === activeSection).icon, {
                  className: "w-8 h-8 text-blue-600"
                })
              )}
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2 capitalize">
              {activeSection.replace('-', ' ')} Section
            </h2>
            <p className="text-gray-600">This section is under development.</p>
          </div>
        );
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered': return 'text-green-600 bg-green-50 border-green-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'shipped': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'View Users', icon: Users },
    { id: 'orders', label: 'View Orders', icon: ShoppingCart },
    { id: 'products', label: 'Edit Product', icon: Edit },
    { id: 'manage-products', label: 'Add Products', icon: Plus },
  ];

  // Mock notifications data
  const notifications = [
    { id: 1, text: 'New order received', time: '2 min ago', read: false },
    { id: 2, text: 'Server load is high', time: '15 min ago', read: false },
    { id: 3, text: 'New user registered', time: '1 hour ago', read: true },
    { id: 4, text: 'Payment processed', time: '2 hours ago', read: true },
  ];

  const unreadNotifications = notifications.filter(n => !n.read).length;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} bg-white shadow-lg transition-all duration-300 flex flex-col z-10`}>
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-6 h-6 text-white" />
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <h1 className="text-xl font-bold text-gray-800">Admin Panel</h1>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleSidebarClick(item)}
                className={`w-full flex items-center px-3 py-3 text-left rounded-lg transition-all duration-200 ${activeSection === item.id
                  ? 'bg-blue-50 text-blue-600 border-r-2 border-blue-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                  }`}
              >
                <Icon className="w-5 h-5" />
                {sidebarOpen && <span className="ml-3 font-medium">{item.label}</span>}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
              A
            </div>
            {sidebarOpen && (
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-800">Admin User</p>
                <p className="text-xs text-gray-500">admin@example.com</p>
              </div>
            )}
          </div>
          {sidebarOpen && (
            <button
              onClick={handleLogout}
              className="mt-3 w-full flex items-center justify-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              {/* Back to Dashboard button for data views */}
              {viewMode === 'data-view' && (
                <button
                  onClick={goBackToDashboard}
                  className="ml-4 flex items-center px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </button>
              )}

              <h2 className="ml-4 text-2xl font-bold text-gray-800 capitalize">
                {activeSection.replace('-', ' ')}
              </h2>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search Bar */}
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  placeholder="Search..."
                  className="block w-64 pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 relative"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="p-4 border-b border-gray-200">
                      <h3 className="font-semibold text-gray-800">Notifications</h3>
                    </div>
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.map(notification => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 ${!notification.read ? 'bg-blue-50' : ''}`}
                        >
                          <p className="text-sm font-medium text-gray-800">{notification.text}</p>
                          <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
                        </div>
                      ))}
                    </div>
                    <div className="p-2 border-t border-gray-200">
                      <button className="w-full text-center text-sm text-blue-600 hover:text-blue-800 py-2">
                        Mark all as read
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Profile Menu */}
              <div className="relative">
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    A
                  </div>
                  {profileOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-20">
                    <div className="p-4 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-800">Admin User</p>
                      <p className="text-xs text-gray-500">admin@example.com</p>
                    </div>
                    <div className="p-2">
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                        Profile Settings
                      </button>
                      <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-lg">
                        System Settings
                      </button>
                    </div>
                    <div className="p-2 border-t border-gray-200">
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg flex items-center"
                      >
                        <LogOut className="w-4 h-4 mr-2" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {viewMode === 'dashboard' ? (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Users</p>
                      <p className="text-3xl font-bold text-gray-800">{usersCount}</p>
                      <p className="text-sm text-green-600 mt-1 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" /> +5.2% from last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Orders</p>
                      <p className="text-3xl font-bold text-gray-800">{ordersCount}</p>
                      <p className="text-sm text-green-600 mt-1 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" /> +12.7% from last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center">
                      <ShoppingCart className="w-6 h-6 text-green-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-3xl font-bold text-gray-800">{productCount}</p>
                      <p className="text-sm text-green-600 mt-1 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" /> +3.1% from last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center">
                      <Package className="w-6 h-6 text-purple-600" />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-600">Revenue</p>
                      <p className="text-3xl font-bold text-gray-800">₹{revenue.toLocaleString()}</p>
                      <p className="text-sm text-green-600 mt-1 flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" /> +15.3% from last month
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-yellow-50 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-6 h-6 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Daily Sales Chart */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Sales Overview</h3>
                    <div className="flex items-center space-x-2">
                      <button className="text-xs px-3 py-1 bg-blue-50 text-blue-600 rounded-lg">Week</button>
                      <button className="text-xs px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-lg">Month</button>
                      <button className="text-xs px-3 py-1 text-gray-500 hover:bg-gray-100 rounded-lg">Year</button>
                    </div>
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={dailySalesData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="day" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Area type="monotone" dataKey="sales" stroke="#3b82f6" fill="url(#colorSales)" />
                      <defs>
                        <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>

                {/* Customer Growth Chart */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Customer Growth</h3>
                    <Users className="w-5 h-5 text-gray-400" />
                  </div>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={customerGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="month" stroke="#6b7280" />
                      <YAxis stroke="#6b7280" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#fff',
                          border: '1px solid #e5e7eb',
                          borderRadius: '8px',
                          boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
                        }}
                      />
                      <Line type="monotone" dataKey="totalCustomers" stroke="#3b82f6" strokeWidth={2} dot={{ r: 4 }} />
                      <Line type="monotone" dataKey="newCustomers" stroke="#10b981" strokeWidth={2} dot={{ r: 4 }} />
                    </LineChart>
                  </ResponsiveContainer>
                  <div className="flex justify-center mt-4 space-x-6">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">Total Customers</span>
                    </div>
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                      <span className="text-sm text-gray-600">New Customers</span>
                    </div>
                  </div>
                </div>
              </div>


              {/* Additional Charts and Data */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Product Categories */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 lg:col-span-1">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Product Categories</h3>
                    <PieChartIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                {/* Top Products */}
                <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200 lg:col-span-2">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800">Top Selling Products</h3>
                    <BarChart3 className="w-5 h-5 text-gray-400" />
                  </div>
                  <div className="space-y-4">
                    {topProducts.map((product, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <Package className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{product.name}</p>
                            <p className="text-sm text-gray-500">{product.sales} units sold</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">₹{product.revenue.toLocaleString()}</p>
                          <p className="text-sm text-green-600">+{Math.floor(Math.random() * 20) + 5}%</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-200">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
                    <Download className="w-4 h-4 mr-1" /> Export
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-gray-500 text-sm border-b">
                        <th className="pb-3 font-medium">Order ID</th>
                        <th className="pb-3 font-medium">Customer</th>
                        <th className="pb-3 font-medium">Date</th>
                        <th className="pb-3 font-medium">Amount</th>
                        <th className="pb-3 font-medium">Status</th>
                        <th className="pb-3 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentOrders.map((order, index) => (
                        <tr key={index} className="text-sm">
                          <td className="py-4 font-medium text-gray-800">#{order.id?.substring(0, 8) || `ORD-${index + 1000}`}</td>
                          <td className="py-4">
                            <div>
                              <p className="font-medium text-gray-800">{order.user?.name || 'Unknown Customer'}</p>
                              <p className="text-gray-500">{order.user?.email || 'No email'}</p>
                            </div>
                          </td>
                          <td className="py-4 text-gray-500">{new Date(order.date).toLocaleDateString()}</td>
                          <td className="py-4 font-medium">₹{order.amount?.toLocaleString() || '0'}</td>
                          <td className="py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                              {order.status || 'pending'}
                            </span>
                          </td>
                          <td className="py-4">
                            <button className="text-blue-600 hover:text-blue-800 p-1">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          ) : (
            renderDataView()
          )}
        </main>
      </div>

      {/* Overlay for mobile when sidebar is openn */}

      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-0 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
};

export default AdminDashboard;