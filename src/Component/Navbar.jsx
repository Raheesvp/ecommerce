import React, { useContext, useState, useRef, useEffect } from "react";
import { Search, User, ShoppingCart, Heart, Menu, X, Trophy, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { SearchContext } from "../Context/SearchContext";

import { toast } from "react-toastify";
import { AuthContext } from "../Context/AuthContext";
import { productService } from "../Services/ProductService";
import { WishlistContext } from "../Context/WishlistContext";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  const { user, isAuthenticated } = useContext(AuthContext);
  const { cartLength } = useContext(CartContext);
  const { wishlistLength } = useContext(WishlistContext);
  const { searchTerm, setSearchTerm, applySearch } = useContext(SearchContext);

  const mobileMenuRef = useRef(null);
  const searchTimeout = useRef(null);
  const navigate = useNavigate();

  // Handle Scroll Effect
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleProfileClick = () => {
    if (isAuthenticated) {
      navigate("/profile");
    } else {
      toast.error("Please log in to view your profile", {
        position: "top-right",
        autoClose: 3000,
      });
      navigate("/login");
    }
  };

  const fetchSuggestions = async (query) => {
    if (!query) {
      setSuggestions([]);
      return;
    }
    try {
      const data = await productService.searchProducts(query);
      setSuggestions(data.slice(0, 5));
    } catch (err) {
      setSuggestions([]);
    }
  };

  const handleSearchChange = (e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);

    if (searchTimeout.current) clearTimeout(searchTimeout.current);

    if (newValue.trim() === "") {
      setSuggestions([]);
      return;
    }

    searchTimeout.current = setTimeout(() => {
      fetchSuggestions(newValue);
    }, 300);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    applySearch();
    navigate("/products");
    setMobileMenuOpen(false);
    setSuggestions([]);
  };

  const handleNavigate = (path) => {
    navigate(path);
    setMobileMenuOpen(false);
    setSuggestions([]);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 py-4 transition-all duration-300">
      <nav
        className={`max-w-7xl mx-auto rounded-2xl md:rounded-full border transition-all duration-500 ${
          isScrolled 
          ? "bg-black/80 backdrop-blur-xl border-white/10 shadow-2xl" 
          : "bg-gray-900/40 backdrop-blur-md border-white/5 shadow-lg"
        }`}
      >
        <div className="px-5 sm:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            
            {/* Logo Section */}
            <div
              onClick={() => handleNavigate("/")}
              className="flex items-center cursor-pointer group"
            >
              <div className="bg-red-600 p-1.5 rounded-lg mr-3 group-hover:rotate-12 transition-transform duration-300">
                <Trophy size={20} className="text-white" />
              </div>
              <span className="text-xl font-black tracking-tighter text-white uppercase italic">
                Wolf<span className="text-red-500">Athletix</span>
              </span>
            </div>

            {/* Desktop Center Links */}
            <div className="hidden lg:flex items-center space-x-2">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "Contact", path: "/contact" },
                { name: "About", path: "/about" },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.path)}
                  className="px-5 py-2 text-sm font-semibold text-gray-300 hover:text-white transition-all rounded-full hover:bg-white/10"
                >
                  {item.name}
                </button>
              ))}
            </div>

            {/* Right Action Bar */}
            <div className="flex items-center space-x-1 sm:space-x-3">
              
              {/* Desktop Search Input */}
              <div className="hidden md:block relative">
                <form onSubmit={handleSearch} className="relative group">
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Find gear..."
                    className="bg-white/5 border border-white/10 rounded-full px-5 py-2 pl-11 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all w-48 focus:w-64 text-sm text-white placeholder-gray-500"
                  />
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-red-500" />
                </form>

                {/* Suggestions Dropdown */}
                {suggestions.length > 0 && (
                  <div className="absolute top-full right-0 mt-3 w-80 bg-gray-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2">
                    {suggestions.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          handleNavigate(`/product/${product.id}`);
                          setSearchTerm("");
                        }}
                        className="flex items-center p-3 hover:bg-white/10 cursor-pointer border-b border-white/5 last:border-0 transition-colors"
                      >
                        <img src={product.image} alt={product.name} className="w-12 h-12 object-cover rounded-lg mr-4 bg-gray-800" />
                        <div className="flex flex-col min-w-0">
                          <span className="text-sm font-bold text-white truncate">{product.name}</span>
                          <span className="text-xs text-red-400 font-mono">₹{product.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Icon Group */}
              <div className="flex items-center bg-white/5 rounded-full p-1 border border-white/5">
                {/* Wishlist */}
                <button
                  onClick={() => handleNavigate("/Wishlist")}
                  className="relative p-2 text-gray-400 hover:text-red-400 transition-colors"
                >
                  <Heart size={20} />
                  {wishlistLength > 0 && (
                    <span className="absolute top-1 right-1 bg-red-500 text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full text-white ring-2 ring-gray-900">
                      {wishlistLength}
                    </span>
                  )}
                </button>

                {/* Cart */}
                <button
                  onClick={() => handleNavigate("/CartPage")}
                  className="relative p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <ShoppingCart size={20} />
                  {cartLength > 0 && (
                    <span className="absolute top-1 right-1 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full ring-2 ring-gray-900">
                      {cartLength}
                    </span>
                  )}
                </button>

                {/* Profile (Desktop) */}
                <button
                  onClick={handleProfileClick}
                  className="ml-1 p-0.5 rounded-full hover:ring-2 hover:ring-red-500 transition-all"
                >
                  {user?.profileImageUrl && user.profileImageUrl !== "undefined" ? (
                    <img
                      src={user.profileImageUrl}
                      alt="Profile"
                      className="w-8 h-8 rounded-full object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${user.firstName || 'User'}&background=random`;
                      }}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-300">
                      <User size={18} />
                    </div>
                  )}
                </button>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 text-white bg-red-600 rounded-full hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        <div 
          ref={mobileMenuRef}
          className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
            mobileMenuOpen ? "max-h-[500px] opacity-100 border-t border-white/10" : "max-h-0 opacity-0"
          }`}
        >
          <div className="px-6 py-6 space-y-4 bg-gray-900/50">
            {/* Mobile Search */}
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search products..."
                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500"
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            </form>

            <div className="grid grid-cols-1 gap-2">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "Contact", path: "/contact" },
                { name: "About", path: "/about" },
                { name: "My Account", path: "/profile" },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.path)}
                  className="flex items-center justify-between w-full px-4 py-3 text-gray-300 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                >
                  <span className="font-medium">{item.name}</span>
                  <ChevronRight size={16} className="text-gray-600" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Navbar;