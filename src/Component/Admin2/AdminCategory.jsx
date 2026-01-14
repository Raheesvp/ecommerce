import React, { useState, useEffect, useCallback } from "react";
import { adminService } from "../../Services/AdminService";
import { productService } from "../../Services/ProductService"; 
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { 
  FolderPlus, Edit, Trash2, Search, 
  FolderTree, Loader2, RefreshCw, X, Package, ArrowRight,
  TrendingUp, Layers, Boxes
} from "lucide-react";

const ManageCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // States for Category Items display
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryProducts, setCategoryProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);

  const BASE_URL = "https://localhost:5174";

  const getFullImageUrl = (path) => {
    if (!path) return "/placeholder-image.png";
    if (path.startsWith("http")) return path;
    const cleanPath = path.startsWith("/") ? path : `/${path}`;
    return `${BASE_URL}${cleanPath}`;
  };

  const fetchCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await adminService.getAllCategories();
      const data = response.data?.data || response.data || response.result || response;
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleCategoryClick = async (category) => {
    if (selectedCategory?.id === category.id) {
      setSelectedCategory(null);
      setCategoryProducts([]);
      return;
    }

    setSelectedCategory(category);
    setLoadingProducts(true);
    
    try {
      const responseData = await productService.getProductByCategoryId(category.id);
      const extractedList = responseData?.data && Array.isArray(responseData.data) 
        ? responseData.data 
        : (Array.isArray(responseData) ? responseData : []);
      
      setCategoryProducts(Array.isArray(extractedList) ? extractedList : []);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message;
      setCategoryProducts([]);
      toast.error(`Sync Error: ${errorMsg}`);
    } finally {
      setLoadingProducts(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;
    try {
      setIsAdding(true);
      await adminService.createCategory({ name: newCategoryName });
      toast.success("New Department Created");
      setNewCategoryName("");
      fetchCategories();
    } catch (err) {
      toast.error(err.response?.data?.message || "Creation failed");
    } finally {
      setIsAdding(false);
    }
  };

  const handleEdit = async (category) => {
    const { value: updatedName } = await Swal.fire({
      title: "RENAME CATEGORY",
      input: "text",
      inputLabel: "Update designation for " + category.name,
      inputValue: category.name,
      showCancelButton: true,
      background: "#ffffff",
      confirmButtonColor: "#2563eb",
      inputValidator: (value) => {
        if (!value) return "Name is mandatory";
      }
    });

    if (updatedName && updatedName !== category.name) {
      try {
        await adminService.updateCategory(category.id, { name: updatedName });
        toast.success("Category Designated Successfully");
        if(selectedCategory?.id === category.id) setSelectedCategory({...category, name: updatedName});
        fetchCategories();
      } catch (err) {
        toast.error("Update sequence failed");
      }
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "DECOMMISSION CATEGORY?",
      text: "Warning: This affects all items linked to this manifest!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      confirmButtonText: "YES, DELETE"
    });

    if (result.isConfirmed) {
      try {
        await adminService.deleteCategory(id);
        toast.success("Category removed from database");
        if(selectedCategory?.id === id) setSelectedCategory(null);
        fetchCategories();
      } catch (err) {
        toast.error("Deletion Blocked: Check active dependencies.");
      }
    }
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="animate-spin text-blue-600" size={48} />
      <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">Synchronizing Categories...</p>
    </div>
  );

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <Layers size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Alpha Hierarchy</span>
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">
            Category <span className="text-blue-600">Structure</span>
          </h2>
        </div>
        <button 
          onClick={fetchCategories} 
          className="p-3 bg-white border border-gray-200 rounded-2xl hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COMPARTMENT: Configuration & Manifest */}
        <div className={`${selectedCategory ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-8 transition-all duration-500`}>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Entry Module */}
            <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100 h-fit">
              <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-6 flex items-center">
                <FolderPlus size={14} className="mr-2 text-blue-600" /> New Entry
              </h3>
              <form onSubmit={handleCreate} className="space-y-4">
                <input
                  type="text" 
                  placeholder="Designation Name"
                  className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-gray-800 transition-all placeholder:text-gray-300"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  required
                />
                <button 
                  type="submit" 
                  disabled={isAdding} 
                  className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black italic uppercase tracking-widest text-xs hover:bg-blue-600 disabled:bg-gray-400 transition-all shadow-lg"
                >
                  {isAdding ? <Loader2 className="animate-spin mx-auto" size={20} /> : "DEPLOY"}
                </button>
              </form>
            </div>

            {/* Manifest Table */}
            <div className="md:col-span-2 bg-white rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center relative">
                <Search className="absolute left-10 text-gray-400" size={18} />
                <input
                  type="text" 
                  placeholder="Search Manifest..."
                  className="w-full pl-14 pr-6 py-3 bg-white border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-sm outline-none shadow-inner"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="overflow-x-auto max-h-[550px]">
                <table className="w-full text-left">
                  <thead className="bg-white text-gray-400 text-[10px] font-black uppercase tracking-widest sticky top-0 border-b border-gray-50">
                    <tr>
                      <th className="px-8 py-4">DESIGNATION</th>
                      <th className="px-8 py-4 text-center">PROTOCOL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredCategories.map((cat) => (
                      <tr 
                        key={cat.id} 
                        className={`group transition-all cursor-pointer ${selectedCategory?.id === cat.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}
                        onClick={() => handleCategoryClick(cat)}
                      >
                        <td className="px-8 py-6">
                          <div className="flex items-center justify-between">
                            <span className={`font-bold uppercase italic tracking-tight ${selectedCategory?.id === cat.id ? 'text-blue-700' : 'text-gray-800'}`}>
                              {cat.name}
                            </span>
                            <ArrowRight size={16} className={`transition-all ${selectedCategory?.id === cat.id ? 'translate-x-0 opacity-100 text-blue-500' : '-translate-x-4 opacity-0 text-gray-300 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                          </div>
                        </td>
                        <td className="px-8 py-6" onClick={(e) => e.stopPropagation()}>
                          <div className="flex items-center justify-center space-x-3">
                            <button onClick={() => handleEdit(cat)} className="p-2 text-gray-400 hover:text-blue-600 rounded-xl hover:bg-white transition-all shadow-sm border border-transparent hover:border-blue-100"><Edit size={16} /></button>
                            <button onClick={() => handleDelete(cat.id)} className="p-2 text-gray-400 hover:text-red-600 rounded-xl hover:bg-white transition-all shadow-sm border border-transparent hover:border-red-100"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COMPARTMENT: Live Inventory Preview */}
        {selectedCategory && (
          <div className="lg:col-span-5 space-y-4 animate-in slide-in-from-right duration-500">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-blue-100 overflow-hidden flex flex-col h-full max-h-[750px]">
              <div className="p-8 bg-gray-900 text-white flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                    <Boxes size={80} />
                </div>
                <div className="relative z-10">
                  <h3 className="font-black italic uppercase text-2xl tracking-tighter">{selectedCategory.name}</h3>
                  <p className="text-blue-400 text-[10px] font-black uppercase tracking-widest mt-1">{categoryProducts.length} Items Deployed</p>
                </div>
                <button onClick={() => { setSelectedCategory(null); setCategoryProducts([]); }} className="p-2 hover:bg-gray-800 rounded-full transition-all relative z-10">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50/50">
                {loadingProducts ? (
                  <div className="flex flex-col items-center justify-center py-24 text-gray-400">
                    <Loader2 className="animate-spin mb-4 text-blue-500" size={40} />
                    <p className="text-[10px] font-black uppercase tracking-widest">Scanning Storefront...</p>
                  </div>
                ) : categoryProducts.length > 0 ? (
                  categoryProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-5 p-4 border border-gray-100 rounded-3xl hover:shadow-xl transition-all bg-white group">
                      <div className="w-20 h-20 rounded-2xl bg-gray-50 flex-shrink-0 overflow-hidden border border-gray-100 shadow-inner">
                        <img 
                          src={getFullImageUrl(product.image || product.imageUrl)} 
                          alt={product.name} 
                          className="w-full h-full object-contain p-2 group-hover:scale-110 transition-transform duration-500"
                          onError={(e) => e.target.src = "/placeholder-image.png"}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-black text-gray-800 truncate text-sm uppercase italic">{product.name}</h4>
                        <div className="flex justify-between items-center mt-2">
                          <span className="text-blue-600 font-black text-lg italic">₹{product.price.toLocaleString()}</span>
                          <span className={`text-[9px] px-3 py-1 rounded-lg font-black uppercase tracking-widest ${product.stock > 0 ? 'bg-green-50 text-green-600 border border-green-100' : 'bg-red-50 text-red-600 border border-red-100'}`}>
                            {product.stock > 0 ? `STOCK: ${product.stock}` : 'DEPLETED'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center py-24 text-gray-300">
                    <Package size={64} className="mb-4 opacity-10" />
                    <p className="text-[10px] font-black uppercase tracking-widest">No Inventory in this Department</p>
                  </div>
                )}
              </div>
              
              <div className="p-6 bg-white border-t border-gray-50">
                 <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-2xl text-[10px] font-black uppercase tracking-widest text-gray-400 hover:border-blue-300 hover:text-blue-500 transition-all">
                    Generate Department Report
                 </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ManageCategories;