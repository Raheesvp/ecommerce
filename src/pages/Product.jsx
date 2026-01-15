import React, { useContext, useEffect, useState } from "react";
import { Filter, ShoppingBag, X, CheckCircle2, LogIn, UserPlus, ArrowRight, ChevronLeft, ChevronRight, SlidersHorizontal, Tag } from "lucide-react";
import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/WishlistContext";
import ProductCard from "../Component/CartDesign"; // Ensure this is the updated ProductCard
import { useNavigate } from "react-router-dom";
import { productService } from "../Services/ProductService";
import * as Dialog from "@radix-ui/react-dialog";
import { AuthContext } from "../Context/AuthContext";
import { Toaster, toast } from "sonner";
import { adminService } from "../Services/AdminService";

function Product() {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("All");
  
  // ✅ Categories State
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState("All"); // Stores 'All' or categoryId
  
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { user } = useContext(AuthContext);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const { addToWishlist, wishlist = [] } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  const getFullImageUrl = (path) => {
    const BACKEND_URL = "https://localhost:57401";
    if (!path) return "https://via.placeholder.com/150";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BACKEND_URL}${cleanPath}`;
  };

  const handleProtectedAction = (action) => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      action();
    }
  };

  const handleAddToCartWithModal = async (product) => {
    try {
      await addToCart(product);
      toast.custom((t) => (
        <div className="w-[350px] md:w-[400px] bg-gray-900 border border-white/10 rounded-2xl p-4 shadow-2xl flex items-center gap-4 animate-in slide-in-from-right-5 duration-300 backdrop-blur-xl">
          <div className="relative flex-shrink-0">
            <div className="w-16 h-16 bg-white/5 rounded-xl overflow-hidden border border-white/10 p-1">
              <img 
                src={getFullImageUrl(
                  product?.imageUrl || product?.image || (product?.images && product.images[0]?.url) || product?.Image
                )} 
                className="w-full h-full object-cover rounded-lg" 
                alt="" 
                onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
              />
            </div>
            <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1 text-white shadow-lg ring-2 ring-gray-900">
              <CheckCircle2 size={12} strokeWidth={3} />
            </div>
          </div>
          <div className="flex-1 overflow-hidden">
            <h4 className="text-white font-bold text-sm truncate uppercase tracking-tight">{product.name}</h4>
            <p className="text-gray-400 text-xs mt-0.5 font-medium">Equipped to your bag</p>
            <button 
              onClick={() => { navigate("/CartPage"); toast.dismiss(t); }}
              className="mt-2 text-red-500 text-xs font-black uppercase tracking-widest flex items-center gap-1 hover:text-red-400 transition-colors"
            >
              Checkout <ArrowRight size={12} />
            </button>
          </div>
          <button onClick={() => toast.dismiss(t)} className="text-gray-600 hover:text-white transition-colors self-start">
            <X size={16} />
          </button>
        </div>
      ), { duration: 4000, position: 'bottom-right' });
    } catch (error) {
      toast.error("Failed to add to cart");
    }
  };

  const mapSortOption = (option) => {
    switch (option) {
      case "Price: Low to High": return { sortBy: "price", order: "asc" };
      case "Price: High to Low": return { sortBy: "price", order: "desc" };
      case "Newest": return { sortBy: "createdAt", order: "desc" };
      case "Top Rated": return { sortBy: "rating", order: "desc" };
      default: return {};
    }
  };

  // ✅ Fetch Categories on Mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch categories from your adminService
        const categoriesData = await adminService.getAllCategories();
        setCategories(categoriesData.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
        toast.error("Failed to load categories");
      }
    };

    fetchCategories();
  }, []);

  // ✅ Fetch Products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (categoryFilter !== "All") {
          // Use Category Specific Endpoint
          const res = await productService.getProductByCategoryId(categoryFilter);
          
          // Normalize the data extraction
          const list = Array.isArray(res) ? res : (res?.data || []);
          
          setProducts(list);
          setTotalPages(1); // For category-specific results, we show all at once
        } else {
          // Use Filtered Endpoint (All)
          const sort = mapSortOption(sortOption);
          const params = {
            page: currentPage,
            pageSize: itemsPerPage,
            sortBy: sort.sortBy,
            order: sort.order,
          };

          // Get all products with pagination
          const res = await productService.getProductByFilter(params);
          
          // Extract from paged result structure
          const productList = res.data?.items || res?.items || [];
          const pages = res.data?.totalPages || res?.totalPages || 1;
          
          setProducts(productList);
          setTotalPages(pages);
        }
      } catch (err) {
        console.error("Error fetching products", err);
        toast.error("Failed to load products");
        setProducts([]);
        setTotalPages(1);
      }
    };
    fetchProducts();
  }, [currentPage, sortOption, categoryFilter]);

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortOption, categoryFilter]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-500/30">
      <Toaster expand={true} richColors theme="dark" />

      {/* Hero Header Section */}
      <div className="relative pt-32 pb-8 px-4 border-b border-white/5 bg-gradient-to-b from-red-500/5 to-transparent">
        <div className="max-w-7xl mx-auto space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter leading-none">
                Elite <span className="text-red-600">Gear</span>
              </h1>
              <p className="text-gray-500 mt-2 font-medium max-w-md">
                Professional grade equipment designed for the modern athlete. 
              </p>
            </div>
            
            {/* Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
                <SlidersHorizontal size={16} className="text-red-500" />
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Sort</span>
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="bg-transparent text-white text-sm font-bold outline-none cursor-pointer focus:text-red-500 transition-colors"
                >
                  <option className="bg-gray-900" value="All">All</option>
                  <option className="bg-gray-900" value="Newest">Newest</option>
                  <option className="bg-gray-900" value="Price: Low to High">Price: Low to High</option>
                  <option className="bg-gray-900" value="Price: High to Low">Price: High to Low</option>
                  <option className="bg-gray-900" value="Top Rated">Top Rated</option>
                </select>
              </div>
            </div>
          </div>

          {/* ✅ Category Filter Navigation */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2 text-gray-500">
              <Tag size={14} className="text-red-600" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Deployment Sectors</span>
            </div>
            <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar scroll-smooth">
              <button
                onClick={() => setCategoryFilter("All")}
                className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 flex-shrink-0 ${
                  categoryFilter === "All"
                    ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20"
                    : "bg-white/5 border-white/5 text-gray-500 hover:border-white/10"
                }`}
              >
                All Gear
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategoryFilter(cat.id)}
                  className={`whitespace-nowrap px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all border-2 flex-shrink-0 ${
                    categoryFilter === cat.id
                      ? "bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20"
                      : "bg-white/5 border-white/5 text-gray-500 hover:border-white/10 hover:text-white"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={() => handleProtectedAction(() => handleAddToCartWithModal(p))}
              onAddToWishlist={(prod) => handleProtectedAction(() => addToWishlist(prod))}
              isInWishlist={isInWishlist}
            />
          ))}
        </div>

        {/* Empty State */}
        {products.length === 0 && (
          <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-3xl">
            <ShoppingBag size={48} className="text-gray-800 mb-4" />
            <h3 className="text-xl font-bold text-gray-400 uppercase tracking-widest">No gear matches your search</h3>
            <button 
              onClick={() => { setSortOption("All"); setCategoryFilter("All"); }}
              className="mt-6 text-red-500 font-bold hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}

        {/* Pagination - Only show when viewing all products (not category filtered) */}
        {totalPages > 1 && categoryFilter === "All" && (
          <div className="flex justify-center items-center gap-4 mt-16">
            <button 
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => prev - 1)}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-red-600 hover:border-red-600 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="text-sm font-black italic text-white px-4">
              PAGE {currentPage} <span className="text-gray-600 mx-2">/</span> {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-red-600 hover:border-red-600 disabled:opacity-20 disabled:hover:bg-transparent transition-all"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        )}
      </div>

      {/* Auth Modal */}
      <Dialog.Root open={isAuthModalOpen} onOpenChange={setIsAuthModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] animate-in fade-in duration-300" />
          <Dialog.Content 
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-[#111] border border-white/10 p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)] z-[60] rounded-[2rem] focus:outline-none animate-in zoom-in-95 duration-200"
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-red-600/10 rounded-3xl flex items-center justify-center mb-8 rotate-3 border border-red-500/20">
                <LogIn className="text-red-500" size={36} />
              </div>
              <Dialog.Title className="text-white text-3xl font-black italic uppercase tracking-tighter">
                Join the <span className="text-red-600">Pack</span>
              </Dialog.Title>
              <Dialog.Description className="text-gray-500 mt-4 mb-10 text-sm font-medium leading-relaxed">
                Sign in to save your favorite gear and manage your pro equipment inventory.
              </Dialog.Description>
              <div className="flex flex-col w-full gap-4">
                <button 
                  onClick={() => navigate("/login")} 
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black italic uppercase tracking-widest py-4 rounded-xl transition-all active:scale-95 shadow-lg shadow-red-900/20"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => navigate("/register")} 
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-black italic uppercase tracking-widest py-4 rounded-xl transition-all border border-white/10"
                >
                  Register
                </button>
                <Dialog.Close asChild>
                  <button className="text-gray-600 text-[10px] mt-6 hover:text-white uppercase tracking-[0.3em] font-black transition-colors">
                    Back to Gear
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default Product;