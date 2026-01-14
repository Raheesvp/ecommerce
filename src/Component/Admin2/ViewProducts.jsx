import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { adminService } from "../../Services/AdminService";
import { productService } from "../../Services/ProductService";
import { toast } from "react-toastify";
import {
  Edit, Trash2, Plus, Search,
  Package, IndianRupee, AlertCircle, Filter,
  Loader2, RefreshCw, Archive, X, RotateCcw, ChevronRight
} from "lucide-react";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [archivedData, setArchivedData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts();
      setProducts(response.data || []);
    } catch (err) {
      toast.error("Failed to load inventory manifest");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchArchives = async () => {
    try {
      const response = await adminService.getArchivedProducts();
      setArchivedData(response.data || []);
      setShowArchiveModal(true);
    } catch (err) {
      toast.error("Failed to sync archives");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, location.key]);

  const handleDelete = async (id) => {
    if (window.confirm("Move this item to archives? It will be hidden from the store.")) {
      try {
        await adminService.deleteProduct(id);
        setProducts(prev => prev.filter((item) => item.id !== id));
        toast.success("Item moved to archives");
      } catch (err) {
        toast.error("Security override failed");
      }
    }
  };

  const handleRestore = async (id) => {
    try {
      await adminService.restoreProduct(id);
      setArchivedData(prev => prev.filter(item => item.id !== id));
      fetchProducts();
      toast.success("Inventory restored successfully");
    } catch (err) {
      toast.error("Restore sequence failed");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="animate-spin text-blue-600" size={48} strokeWidth={2.5} />
      <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">Syncing Inventory Database...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 mb-1">
            <Package size={18} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Alpha Operations</span>
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-gray-900">
            Product <span className="text-blue-600">Inventory</span>
          </h2>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchArchives} 
            className="flex items-center px-5 py-2.5 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-bold text-xs uppercase tracking-tight"
          >
            <Archive size={16} className="mr-2" /> View Archives
          </button>
          <button 
            onClick={fetchProducts} 
            className="p-2.5 text-gray-500 bg-white border border-gray-200 rounded-xl hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
            title="Refresh Data"
          >
            <RefreshCw size={20} />
          </button>
          <button 
            onClick={() => navigate("/admin/AddProduct")} 
            className="flex items-center px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 font-bold text-xs uppercase tracking-tight"
          >
            <Plus size={18} className="mr-1" /> New Item
          </button>
        </div>
      </div>

      {/* Search & Utility Bar */}
      <div className="bg-white p-2 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-2">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-600 transition-colors" size={20} />
          <input
            type="text"
            placeholder="Search equipment by name or ID..."
            className="w-full pl-12 pr-4 py-3 bg-gray-50/50 border-none rounded-xl focus:ring-0 text-sm font-medium placeholder:text-gray-400 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 hover:border-blue-200 hover:text-blue-600 transition-all text-xs font-bold uppercase">
          <Filter size={16} className="mr-2" /> Filter
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-[2rem] shadow-xl shadow-gray-200/50 border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Equipment Details</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Market Value</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Stock Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Protocol</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center space-x-5">
                        <div className="relative">
                          <img
                            src={product.image || "/placeholder-image.png"}
                            alt={product.name}
                            className="w-14 h-14 rounded-2xl object-cover border-2 border-gray-100 shadow-sm group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <div>
                          <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors uppercase italic tracking-tight">{product.name}</p>
                          <p className="text-[10px] font-mono text-gray-400 mt-0.5">UID: {String(product.id).padStart(6, '0')}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center font-black text-gray-800 text-lg italic">
                        <IndianRupee size={16} className="mr-0.5 text-gray-300" />
                        {product.price?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center">
                        {product.stock <= 5 ? (
                          <div className="flex items-center px-3 py-1.5 rounded-lg bg-red-50 text-red-600 border border-red-100">
                            <AlertCircle size={14} className="mr-2" />
                            <span className="text-[10px] font-black uppercase tracking-tighter">{product.stock} Units - CRITICAL</span>
                          </div>
                        ) : (
                          <div className="flex items-center px-3 py-1.5 rounded-lg bg-green-50 text-green-600 border border-green-100">
                            <span className="text-[10px] font-black uppercase tracking-tighter">{product.stock} Available</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => navigate(`/admin/EditProduct/${product.id}`)}
                          className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-white rounded-xl border border-transparent hover:border-blue-100 hover:shadow-sm transition-all"
                          title="Edit Manifest"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-white rounded-xl border border-transparent hover:border-red-100 hover:shadow-sm transition-all"
                          title="Decommission Item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-24 text-center">
                    <div className="flex flex-col items-center text-gray-300">
                        <Package size={64} strokeWidth={1} className="mb-4 opacity-20" />
                        <p className="text-sm font-bold uppercase tracking-[0.2em]">Zero equipment found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Archive Modal */}
      {showArchiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4 animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden border border-white/20">
            <div className="flex justify-between items-center px-10 py-8 border-b border-gray-100">
              <div>
                <h3 className="text-2xl font-black italic uppercase tracking-tighter flex items-center">
                  <Archive className="mr-3 text-blue-600" /> Archived <span className="ml-2 text-gray-400">Vault</span>
                </h3>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mt-1">Inactive Equipment Manifest</p>
              </div>
              <button 
                onClick={() => setShowArchiveModal(false)} 
                className="p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-10 max-h-[60vh] overflow-y-auto space-y-4 custom-scrollbar">
              {archivedData.length === 0 ? (
                <div className="text-center py-20 text-gray-400">
                    <Archive size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="text-xs font-black uppercase tracking-widest">Vault is empty</p>
                </div>
              ) : (
                archivedData.map(item => (
                  <div key={item.id} className="group flex justify-between items-center p-5 bg-gray-50/50 rounded-[1.5rem] border border-gray-100 hover:border-blue-200 hover:bg-white transition-all">
                    <div className="flex items-center space-x-4">
                        <img 
                          src={item.image || "/placeholder-image.png"} 
                          className="w-12 h-12 rounded-xl object-cover grayscale opacity-60 group-hover:grayscale-0 group-hover:opacity-100 transition-all" 
                          alt="" 
                        />
                        <div>
                            <p className="font-bold text-gray-800 uppercase italic leading-tight">{item.name}</p>
                            <p className="text-[10px] font-mono text-gray-400">UID: {item.id}</p>
                        </div>
                    </div>
                    <button 
                      onClick={() => handleRestore(item.id)} 
                      className="flex items-center px-5 py-2 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 shadow-lg shadow-blue-200 transition-all"
                    >
                      <RotateCcw size={14} className="mr-2" /> Restore
                    </button>
                  </div>
                ))
              )}
            </div>
            <div className="px-10 py-6 bg-gray-50 border-t border-gray-100 text-right">
                <button 
                    onClick={() => setShowArchiveModal(false)}
                    className="text-xs font-black text-gray-400 hover:text-gray-600 uppercase tracking-widest"
                >
                    Close Secure Vault
                </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewProducts;