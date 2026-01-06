import React, { useContext, useState, useRef, useEffect } from "react";
import { Search, User, ShoppingCart, Heart, Menu, X, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../Context/CartContext";
import { SearchContext } from "../Context/SearchContext";
import { WishlistContext } from "../Context/WishlistContext";
import { toast } from "react-toastify";
import api from "../Api/AxiosInstance";
import { AuthContext } from "../Context/AuthContext";
import { productService } from "../Services/ProductService";

const Navbar = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [suggestions, setSuggestions] = useState([]);

  // Destructure global user and the setter from AuthContext
  const { user, setUser } = useContext(AuthContext);

  const mobileMenuRef = useRef(null);
  const navigate = useNavigate();


  const searchTimeout = useRef(null);

  


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
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (query) => {
        if(!query){
          setSuggestions([]);
          return;
        }

        try{
          const data = await productService.searchProducts(query);
          setSuggestions(data.slice(0,5));
          console.log(data)
        }catch(err){
          setSuggestions([]);
        }
    }

  const handleSearchChange = (e) => {
    const newValue = e.target.value; // Declare 'newValue' here
    setSearchTerm(newValue);

    // Clear previous timer
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    if (newValue.trim() === "") {
      setSuggestions([]);
      return;
    }

    // Start a new timer
    searchTimeout.current = setTimeout(() => {
      fetchSuggestions(newValue); // Pass 'newValue' to the function
    }, 300);
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
    setSuggestions([]);
  };


  return (
    <div className="fixed top-0 left-0 w-full z-50 px-4 pt-4">
      <nav
        className={`max-w-6xl mx-auto rounded-full shadow-2xl backdrop-blur-md border border-gray-700/50
        ${isScrolled ? "shadow-xl bg-gray-900/90" : "bg-gray-900/80"}`}
      >
        <div className="px-6 sm:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div
              onClick={() => handleNavigate("/")}
              className="flex items-center cursor-pointer py-2 group"
            >
              <div className="text-lg font-bold text-white leading-none group-hover:text-red-400 transition-colors">
                Wolf Athletix
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1">
              {[
                { name: "Home", path: "/" },
                { name: "Products", path: "/products" },
                { name: "Contact", path: "/contact" },
                { name: "About", path: "/about" },
              ].map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigate(item.path)}
                  className="flex items-center px-4 py-2 text-gray-200 hover:text-white font-medium transition-all duration-300 rounded-full hover:bg-gray-800/60 relative group"
                >
                  {item.name}
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-red-500 to-red-600 scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-full"></span>
                </button>
              ))}
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-2">
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
                <button type="submit" className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-300">
                  <Search size={16} />
                </button>

              {/* Suggestions Dropdown */}
              {suggestions.length > 0 && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden z-[60]">
                  {suggestions.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => {
                        // NAVIGATE TO DETAILS PAGE
                        handleNavigate(`/product/${product.id}`);
                        setSearchTerm("");
                      }}
                      className="flex items-center p-3 hover:bg-gray-800 cursor-pointer border-b border-gray-800 last:border-0 transition-colors"
                    >
                      <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-md mr-3" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white truncate w-40">{product.name}</span>
                        <span className="text-xs text-red-400">₹{product.price}</span>
                      </div>
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
                <Heart size={20} />
                {wishlistLength > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {wishlistLength}
                  </span>
                )}
              </button>

              {/* Cart */}
              <button
                onClick={() => handleNavigate("/CartPage")}
                className="relative p-2.5 text-gray-300 hover:text-white rounded-full transition-all duration-300 hover:bg-gray-800/60"
              >
                <ShoppingCart size={20} />
                {cartLength > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartLength}
                  </span>
                )}
              </button>

              {/* ✅ ENHANCED PROFILE SECTION */}
              {user && (
                <div className="hidden lg:block relative ml-2">
                  <button
                    onClick={() => handleNavigate("/profile")}
                    className="flex items-center space-x-2 p-1 pr-3 text-gray-300 hover:text-white transition-all duration-300 rounded-full hover:bg-gray-800/60 group border border-gray-700/30"
                  >
                    <div className="relative">
                      {/* Check for valid image URL and ignore placeholder strings */}
                      {user.profileImageUrl && 
                       user.profileImageUrl !== "undefined" && 
                       !user.profileImageUrl.includes("your-default-image") ? (
                        <img
                          src={user.profileImageUrl}
                          alt="Profile"
                          className="w-8 h-8 rounded-full object-cover border border-gray-600 group-hover:border-red-500 transition-colors"
                          onError={(e) => {
                            // Fallback to UI Avatars if the Cloudinary link fails
                            e.target.onerror = null; 
                            e.target.src = `https://ui-avatars.com/api/?name=${user.firstName || 'User'}&background=random`;
                          }}
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 border border-gray-600">
                          <User size={18} />
                        </div>
                      )}
                    </div>
                    
                  
                  </button>
                </div>
              )}

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 text-gray-300 hover:text-white transition-all duration-300 rounded-full hover:bg-gray-800/60"
              >
                {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Navbar;