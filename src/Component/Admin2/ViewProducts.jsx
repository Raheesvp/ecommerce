import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { adminService } from "../../Services/AdminService";
import { productService } from "../../Services/ProductService";
import { toast } from "react-toastify";
import {
  Edit, Trash2, Plus, Search,
  Package, IndianRupee, AlertCircle, Filter,
  Loader2, RefreshCw
} from "lucide-react";

const ViewProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation(); // Used to detect navigation back to this page

  // 1. Memoized fetch function to prevent unnecessary recreations
  const fetchProducts = useCallback(async () => {
    try {
      setLoading(true);
      // We call the service and ensure we get the latest data
      const response = await productService.getAllProducts();

      // Ensure we are setting an array
      setProducts(response.data || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load current inventory");
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Effect to fetch data on mount and whenever the location changes
  // (This ensures that when you navigate back from EditProduct, it refreshes)
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts, location.key]);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      try {
        await adminService.deleteProduct(id);
        setProducts(prev => prev.filter((p) => p.id !== id));
        toast.success("Product removed from inventory");
      } catch (err) {
        toast.error("Delete failed. Product may be linked to existing orders.");
      }
    }
  };

  // 3. Filter logic
  const filteredProducts = (products || []).filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 space-y-4">
      <Loader2 className="animate-spin text-blue-600" size={40} />
      <p className="text-gray-500 font-medium">Syncing inventory data...</p>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-2">
          <Package className="text-blue-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Product Inventory</h2>
        </div>
        <div className="flex gap-2">
          <button
            onClick={fetchProducts}
            className="p-2 text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all"
            title="Refresh Data"
          >
            <RefreshCw size={20} />
          </button>
          <button
            onClick={() => navigate("/admin/AddProduct")}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-md shadow-blue-100"
          >
            <Plus size={18} className="mr-2" /> Add New Product
          </button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search products by name..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-100 transition-all">
          <Filter size={18} className="mr-2" /> Filter
        </button>
      </div>

      {/* Product Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Product</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider">Stock Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-600 uppercase tracking-wider text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <img
                          src={product.image || "/placeholder-image.png" ||product.name || product.imageUrl}
                          alt={product.name}
                          className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                        />
                        <div>
                          <p className="font-semibold text-gray-800 line-clamp-1">{product.name}</p>
                          <p className="text-[10px] font-mono text-gray-400 uppercase">
                            ID: {String(product.id).substring(0, 8)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center font-bold text-gray-700">
                        <IndianRupee size={14} className="mr-1 text-gray-400" />
                        {product.price?.toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        {product.stock <= 5 ? (
                          <div className="flex items-center px-2.5 py-1 rounded-full bg-red-50 text-red-600 border border-red-100">
                            <AlertCircle size={14} className="mr-1.5" />
                            <span className="text-xs font-bold">{product.stock} Low Stock</span>
                          </div>
                        ) : (
                          <div className="flex items-center px-2.5 py-1 rounded-full bg-green-50 text-green-600 border border-green-100">
                            <span className="text-xs font-bold">{product.stock} Available</span>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => navigate(`/admin/EditProduct/${product.id}`)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                          title="Edit Details"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                          title="Delete Product"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center text-gray-400">
                      <Package size={48} className="mb-2 opacity-20" />
                      <p className="text-sm font-medium">No products match your criteria</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewProducts;