import React, { useContext, useEffect, useState } from "react";
import { Filter, ShoppingBag, X, CheckCircle2, LogIn, UserPlus, ArrowRight, ChevronLeft, ChevronRight, SlidersHorizontal } from "lucide-react";
import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/WishlistContext";
import ProductCard from "../Component/CartDesign"; // Ensure this is the updated ProductCard
import { useNavigate } from "react-router-dom";
import { productService } from "../Services/ProductService";
import * as Dialog from "@radix-ui/react-dialog";
import { AuthContext } from "../Context/AuthContext";
import { Toaster, toast } from "sonner";

function Product() {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const sort = mapSortOption(sortOption);
        const params = {
          page: currentPage,
          pageSize: itemsPerPage,
          sortBy: sort.sortBy,
          order: sort.order,
          category: categoryFilter !== "All" ? categoryFilter : undefined,
        };
        const res = await productService.getProductByFilter(params);
        setProducts(res.data.items);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching products", err);
        setProducts([]);
      }
    };
    fetchProducts();
  }, [currentPage, sortOption, categoryFilter]);

  useEffect(() => {
    setCurrentPage(1);
  }, [sortOption, categoryFilter]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white selection:bg-red-500/30">
      <Toaster expand={true} richColors theme="dark" />

      {/* Hero Header Section */}
      <div className="relative pt-32 pb-12 px-4 border-b border-white/5 bg-gradient-to-b from-red-500/5 to-transparent">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
              Elite <span className="text-red-600">Gear</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium max-w-md">
              Professional grade equipment designed for the modern athlete. 
              Dominate the field with Wolf Athletix.
            </p>
          </div>
          
          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2">
              <SlidersHorizontal size={16} className="text-red-500" />
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">Sort</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-transparent text-white text-sm font-bold outline-none cursor-pointer focus:text-red-500 transition-colors"
              >
                <option className="bg-gray-900">All</option>
                <option className="bg-gray-900">Featured</option>
                <option className="bg-gray-900">Newest</option>
                <option className="bg-gray-900">Price: Low to High</option>
                <option className="bg-gray-900">Price: High to Low</option>
                <option className="bg-gray-900">Top Rated</option>
              </select>
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

        {/* Pagination */}
        {totalPages > 1 && (
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
    </div>
  );
}

export default Product;