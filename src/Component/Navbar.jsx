import React, { useContext, useState, useRef, useEffect } from "react";
import { Search, User, ShoppingCart, Heart, Menu, X, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { SearchContext } from "../Context/SearchContext";
import { WishlistContext } from "../Context/WishlistContext";
import { toast } from "react-toastify";
import api from "../Api/AxiosInstance";  
import { AuthContext } from "../Context/AuthContext";

const Navbar = () => {
  const [profileOpen, setProfileOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  
  const { user } = useContext(AuthContext);

  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navigate = useNavigate();

  const { cartLength } = useContext(CartContext);
  const { wishlistLength } = useContext(WishlistContext);
  const { searchTerm, setSearchTerm, applySearch } = useContext(SearchContext);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  const fetchSuggestions = async (query) => {
    try {
      const res = await api.get(`/products?search=${query}`); 
      
      setSuggestions(res.data.slice(0, 5));
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.trim() === "") {
      setSuggestions([]);
      return;
    }

    fetchSuggestions(value);
  };

  const highlightMatch = (text, query) => {
    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={i} className="text-red-500 font-semibold">
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applySearch();
    navigate("/products");
    setSearchOpen(false);
    setMobileMenuOpen(false);
    setSuggestions([]);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setProfileOpen(false);
    setSuggestions([]);
  };

  const handleSignOut = () => {
    localStorage.removeItem("user");
    toast.success("Signed out successfully!");
    navigate("/login");
    setProfileOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 pt-4">
      <nav
        className={`max-w-6xl mx-auto rounded-full shadow-2xl backdrop-blur-md border border-gray-700/50
        ${isScrolled ? "shadow-xl bg-gray-900/90" : "bg-gray-900/80"}`} >
        <div className="px-6 sm:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              onClick={() => handleNavigate("/")}
              className="flex items-center cursor-pointer py-2 group"
            >
              <div>
                <div className="text-lg font-bold text-white leading-none group-hover:text-red-400 transition-colors">
                  Wolf Athletix
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {[
                { name: "Home", icon: null, path: "/" },
                { name: "Products", path: "/products" },
                { name: "Contact", icon: null, path: "/contact" },
                { name: "About", icon: null, path: "/about" }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.path)}
                  className="flex items-center px-4 py-2 text-gray-200 hover:text-white font-medium transition-all duration-300 rounded-full hover:bg-gray-800/60 relative group" >
                  {item.icon && <span className="mr-2">{item.icon}</span>}
                  {item.name}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-red-500 to-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
                </button>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center space-x-2">
              {/* Mobile Search Icon */}
              <button
                onClick={() => setSearchOpen(!searchOpen)}
                className="p-2.5 text-gray-300 hover:text-white transition-all duration-300 rounded-full hover:bg-gray-800/60 md:hidden"
              >
                <Search size={20} />
              </button>

              {/* Desktop Search */}
              <form onSubmit={handleSearch} className="hidden md:flex items-center relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search football gear..."
                  className="bg-gray-800/70 border border-gray-600/50 rounded-full px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 w-56 text-sm text-white placeholder-gray-300 backdrop-blur-sm"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Search size={16} />
                </button>

                {/*  Suggestions */}
                {suggestions.length > 0 && (
                  <div className="absolute top-full mt-2 left-0 w-full bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto backdrop-blur-md">
                    {suggestions.map((item) => (
                      <div key={item.id} onClick={() => handleNavigate(`/products/${item.id}`)} className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-700/80 transition border-b border-gray-600 last:border-b-0" >
                        <img  src={item.image}  alt={item.name}  className="w-8 h-8 object-cover rounded"/>
                        <span className="text-white text-sm">{highlightMatch(item.name, searchTerm)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </form>

              {/* Wishlist */}
              <button
                onClick={() => handleNavigate("/Wishlist")}
                className="relative p-2.5 text-gray-300 hover:text-white rounded-full transition-all duration-300 hover:bg-gray-800/60"
              >
                <Heart size={20} className="transition-transform" />
                {wishlistLength > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-800 shadow-lg">
                    {wishlistLength}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => handleNavigate("/CartPage")}
                className="relative p-2.5 text-gray-300 hover:text-white rounded-full transition-all duration-300 hover:bg-gray-800/60"
              >
                <ShoppingCart size={20} className="" />
                {cartLength > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-gray-800 shadow-lg">
                    {cartLength}
                  </span>
                )}
              </button>

              {/* Profile Dropdown */}
              <div  className={`${user ? "display" : "relative hidden lg:block"}`} ref={profileRef}>
                <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white transition-all duration-300 rounded-full hover:bg-gray-800/60 group"
                >
                  <User size={20} className="transition-transform" />
                  <span className="text-sm font-medium">Account</span>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-52 bg-gray-800 rounded-2xl border border-gray-600 shadow-2xl py-2 z-50 animate-fade-in-down backdrop-blur-md">
                    <button
                      onClick={() => handleNavigate("/profile")}
                      className="w-full text-left px-4 py-3 text-gray-200 hover:bg-gray-700/80 hover:text-white transition-all duration-200 flex items-center"
                    >
                      <User size={16} className="mr-2" />
                      My Profile
                    </button>
                    <button
                      onClick={() => handleNavigate("/Order")}
                      className="w-full text-left px-4 py-3 text-gray-200 hover:bg-gray-700/80 hover:text-white transition-all duration-200 flex items-center"
                    >
                      <Trophy size={16} className="mr-2" />
                      Order History
                    </button>
                    <hr className="my-2 border-gray-600" />
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-3 text-red-400 hover:bg-gray-700/80 transition-all duration-200 flex items-center"
                    >
                      <X size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 text-gray-300 hover:text-white transition-all duration-300 rounded-full hover:bg-gray-800/60"
              >
                <div className="relative w-6 h-6">
                  <Menu
                    size={24}
                    className={`absolute transition-all duration-300 ${
                      mobileMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"
                    }`}
                  />
                  <X
                    size={24}
                    className={`absolute transition-all duration-300 ${
                      mobileMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"
                    }`}
                  />
                </div>
              </button>
            </div>
          </div>

          {/* Mobile Search */}
          {searchOpen && (
            <div className="md:hidden border-t border-gray-600/50 px-4 py-4 relative">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search football gear..."
                  className="w-full bg-gray-800/70 border border-gray-600/50 rounded-full px-4 py-2.5 pl-10 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 text-sm text-white placeholder-gray-300"
                />
                <button
                  type="submit"
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300 hover:text-red-400 transition-colors"
                >
                  <Search size={16} />
                </button>
              </form>

              {/* ✅ Suggestions for mobile too */}
              {suggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-50 max-h-60 overflow-y-auto backdrop-blur-md">
                  {suggestions.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleNavigate(`/products/${item.id}`)}
                      className="flex items-center gap-3 p-3 cursor-pointer hover:bg-gray-700/80 transition border-b border-gray-600 last:border-b-0"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 object-cover rounded"
                      />
                      <span className="text-white text-sm">{highlightMatch(item.name, searchTerm)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div
            ref={mobileMenuRef}
            className="lg:hidden border-t border-gray-600/50 bg-gray-800/95 backdrop-blur-md rounded-b-3xl"
          >
            <div className="px-8 py-4 space-y-2">
              {[
                { name: "Home", path: "/" },
                { name: "Products",  path: "/products" },
                { name: "Trending", path: "/trending" },
                { name: "Contact",  path: "/contact" },
                { name: "About",  path: "/about" }
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.path)}
                  className="flex items-center w-full text-left py-3 px-4 text-gray-200 hover:text-white hover:bg-gray-700/80 font-medium transition-all duration-200 rounded-full"
                >
                  {item.icon && <span className="mr-3">{item.icon}</span>}
                  {item.name}
                </button>
              ))}

              <hr className="border-gray-600/50 my-3" />
              
              <button
                onClick={() => handleNavigate("/profile")}  
                className="flex items-center w-full text-left py-3 px-4 text-gray-200 hover:text-white hover:bg-gray-700/80 font-medium transition-all duration-200 rounded-full"
              >
                <User size={16} className="mr-3" />
                My Profile
              </button>
              
              <button
                onClick={() => handleNavigate("/Order")}
                className="flex items-center w-full text-left py-3 px-4 text-gray-200 hover:text-white hover:bg-gray-700/80 font-medium transition-all duration-200 rounded-full"
              >
                <Trophy size={16} className="mr-3" />
                Order History
              </button>
              
              <button
                onClick={handleSignOut}
                className="flex items-center w-full text-left py-3 px-4 text-red-400 hover:bg-gray-700/80 font-medium transition-all duration-200 rounded-full"
              >
                <X size={16} className="mr-3" />
                Sign Out
              </button>
            </div>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Navbar;