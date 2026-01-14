import React, { useState, useEffect } from "react";
import { ShoppingBag, ArrowLeft, Loader2, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Component/Navbar";
import { productService } from "../../Services/ProductService";

const RecentlyViewedPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistoryDetails = async () => {
      try {
        setLoading(true);
        // 1. Load the array of IDs from localStorage
        const savedIds = JSON.parse(localStorage.getItem("wolf_history_ids")) || [];

        if (savedIds.length > 0) {
          // 2. Fetch full product details for each ID
          const productPromises = savedIds.map((id) =>
            productService.getById(id)
          );
          
          const results = await Promise.all(productPromises);
          
          // 3. Filter out any nulls (if a product no longer exists in DB)
          setHistory(results.filter((p) => p !== null));
        }
      } catch (err) {
        console.error("Failed to load history products", err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistoryDetails();
  }, []);

//   // ✅ Fixed Clear History Functionality
//   const clearHistory = () => {
//     localStorage.removeItem("wolf_history_ids");
//     setHistory([]);
//   };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Navbar />

      <main className="flex-grow py-12 md:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter">
              Your <span className="text-red-600">History</span>
            </h1>
            <p className="text-gray-500 mt-2 font-medium uppercase text-xs tracking-[0.2em]">
              Items you've recently scouted
            </p>
          </div>

          {/* Show Clear button only if there is history */}
          {/* {history.length > 0 && (
            <button 
              onClick={clearHistory}
              className="flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors font-bold text-sm uppercase italic"
            >
              <Trash2 className="w-5 h-5" /> Clear All History
            </button>
          )} */}
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin text-red-600 mb-4" />
            <p className="font-black italic uppercase tracking-widest text-xs">Retrieving Scout Data...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-32 border-2 border-dashed border-white/5 rounded-3xl">
            <h3 className="text-2xl font-bold text-gray-600 mb-6 italic">
              NO RECENT ACTIVITY FOUND
            </h3>
            <button
              onClick={() => navigate("/products")}
              className="bg-red-600 text-white px-8 py-4 rounded-xl font-black italic flex items-center gap-3 mx-auto hover:bg-red-700 transition-all"
            >
              <ArrowLeft className="w-5 h-5" /> START SHOPPING
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {history.map((product) => (
              <div
                key={product.id}
                className="group bg-gray-900/40 border border-white/5 rounded-2xl overflow-hidden hover:border-red-600/30 transition-all duration-500 shadow-xl"
              >
                {/* Image Section */}
                <div
                  className="relative aspect-[4/5] overflow-hidden cursor-pointer"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <img
                    src={product.image || product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                </div>

                {/* Details Section */}
                <div className="p-6">
                  <h3 className="text-lg font-black italic uppercase mb-2 truncate">
                    {product.name}
                  </h3>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-bold text-red-600">
                      ${product.price}
                    </span>
                    <button 
                      onClick={() => navigate(`/product/${product.id}`)}
                      className="p-3 bg-white/5 hover:bg-red-600 rounded-xl transition-colors group/btn"
                    >
                      <ShoppingBag className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* <Footer/> */}
    </div>
  );
};

export default RecentlyViewedPage;