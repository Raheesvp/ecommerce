import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { adminService } from "../../Services/AdminService";
import { productService } from "../../Services/ProductService"; 
import { toast } from "react-toastify";
import { 
  Edit3, Upload, IndianRupee, Tag, Info, 
  Save, ArrowLeft, Package, List, PlusCircle, Loader2 
} from "lucide-react";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  
  // States for Category management
  const [categories, setCategories] = useState([]);
  const [typedCategoryName, setTypedCategoryName] = useState("");

  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
  });
  
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  // 1. Fetch categories and existing product data on mount
  useEffect(() => {
    const initializeData = async () => {
      try {
        // Load categories list for the datalist selection
        const catRes = await adminService.getAllCategories();
        setCategories(catRes.data || catRes);

        // Fetch the specific product details
        const response = await productService.getProductById(id);
        const p = response.data;
        
        setProduct({
          name: p.name,
          description: p.description,
          price: p.price,
          stock: p.stock,
          categoryId: p.categoryId,
        });

        // Initialize the category name in the input field
        setTypedCategoryName(p.categoryName || p.category || "");
        
        if (p.imageUrl) setPreview(p.imageUrl);
        
      } catch (err) {
        console.error("Fetch Error:", err);
        toast.error("Could not find product data");
        navigate("/admin/ViewProducts");
      } finally {
        setFetching(false);
      }
    };
    initializeData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCategoryInputChange = (e) => {
    const value = e.target.value;
    setTypedCategoryName(value);

    // Sync with categoryId if it matches an existing category
    const foundCategory = categories.find(
      (cat) => cat.name.toLowerCase() === value.toLowerCase()
    );
    setProduct(prev => ({ ...prev, categoryId: foundCategory ? foundCategory.id : "" }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
        console.log("File selected ",file.name)
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData();
    
    // Explicitly mapping keys to match C# DTO: UpdateProductRequest
    formData.append("Name", product.name);
    formData.append("Description", product.description);
    formData.append("Price", product.price);
    
    // SOLUTION: Parse Stock as Integer to ensure C# Model Binder recognizes it
    formData.append("Stock", parseInt(product.stock, 10));
    
    // Pass Category as String (matches: public string Category { get; set; })
    formData.append("Category", typedCategoryName); 

    // Include required fields to prevent 400 Bad Request
    formData.append("OriginalPrice", product.price); 
    formData.append("Featured", false);

    if (imageFile) {
        // Key "Images" must match: public List<IFormFile> Images
        formData.append("Images", imageFile); 
    }

    try {
        await adminService.updateProduct(id, formData);
        toast.success("Product updated successfully!");
        
        // Small timeout ensures DB Commit finishes before ViewProducts re-fetches
        setTimeout(() => navigate("/admin/ViewProducts"), 500);
    } catch (err) {
        console.error("Update Error:", err.response?.data);
        const errorMsg = err.response?.data?.message || "Update failed. Check console.";
        toast.error(errorMsg);
    } finally {
        setLoading(false);
    }
  };

  if (fetching) return (
    <div className="flex flex-col items-center justify-center p-20">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="text-gray-500">Syncing product data...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Edit3 className="text-blue-600" size={28} />
          <h2 className="text-2xl font-bold text-gray-800">Edit Product</h2>
        </div>
        <button 
          onClick={() => navigate("/admin/ViewProducts")}
          className="flex items-center text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={18} className="mr-1" /> Back to Inventory
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left: Image Upload Section */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <div className="relative aspect-square rounded-lg border-2 border-dashed border-gray-300 overflow-hidden group">
              {preview ? (
                <img src={preview} alt="Product" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <Package size={40} />
                </div>
              )}
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
                <Upload className="text-white" size={24} />
              </div>
              <input 
                type="file" 
                onChange={handleFileChange} 
                className="absolute inset-0 opacity-0 cursor-pointer" 
                accept="image/*"
              />
            </div>
            <p className="text-[10px] text-gray-400 mt-2 text-center italic">Only upload to replace current image</p>
          </div>
        </div>

        {/* Right: Details Section */}
        <div className="md:col-span-2 space-y-4">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Tag size={14} className="mr-2" /> Product Name
              </label>
              <input
                type="text"
                name="name"
                value={product.name}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Info size={14} className="mr-2" /> Description
              </label>
              <textarea
                name="description"
                value={product.description}
                onChange={handleInputChange}
                rows="4"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <IndianRupee size={14} className="mr-2" /> Price
                </label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <Package size={14} className="mr-2" /> Stock Level
                </label>
                <input
                  type="number"
                  name="stock"
                  value={product.stock}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            {/* Category Section */}
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <List size={14} className="mr-2" /> Category Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  list="category-list"
                  value={typedCategoryName}
                  onChange={handleCategoryInputChange}
                  placeholder="Select or type new category"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  required
                />
                <datalist id="category-list">
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.name} />
                  ))}
                </datalist>

                {typedCategoryName && !product.categoryId && (
                  <div className="absolute right-3 top-2.5 flex items-center text-amber-600 text-xs font-bold animate-pulse">
                    <PlusCircle size={14} className="mr-1" /> NEW
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center transition-all disabled:bg-gray-400"
              >
                {loading ? (
                    <Loader2 className="animate-spin" />
                ) : (
                    <><Save size={18} className="mr-2" /> Save Changes</>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;