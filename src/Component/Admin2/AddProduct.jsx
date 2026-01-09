import React, { useState, useEffect } from "react";
import { adminService } from "../../Services/AdminService";
import { toast } from "react-toastify";
import { Package, Upload, IndianRupee, Tag, List, Info, Save, Loader2, PlusCircle } from "lucide-react";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]); 
  const [typedCategoryName, setTypedCategoryName] = useState(""); 
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    categoryId: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);

  const loadCategories = async () => {
    try {
      const res = await adminService.getAllCategories();
      setCategories(res.data || res); 
    } catch (err) {
      console.error("Failed to load categories", err);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleCategoryInputChange = (e) => {
    const value = e.target.value;
    setTypedCategoryName(value);

    const foundCategory = categories.find(
      (cat) => cat.name.toLowerCase() === value.toLowerCase()
    );

    if (foundCategory) {
      setProduct({ ...product, categoryId: foundCategory.id });
    } else {
      setProduct({ ...product, categoryId: "" }); 
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // --- FRONTEND VALIDATION ---
    if (parseFloat(product.originalPrice) <= parseFloat(product.price)) {
      toast.error("Original Price (MRP) must be greater than the Selling Price");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      
      // 1. Basic Info
      formData.append("Name", product.name);
      formData.append("Description", product.description);
      formData.append("Price", product.price);
      formData.append("Stock", product.stock);
      
      // Use the actual value from the state
      formData.append("OriginalPrice", product.originalPrice); 

      // 2. The Category String (Matches: public string Category { get; set; })
      formData.append("Category", typedCategoryName);

      // 3. Optional/Default Fields (Matching DTO)
      formData.append("Offer", "No Offer"); 
      formData.append("Rating", 0);
      formData.append("Featured", false);

      // 4. Image List (Matches: public List<IFormFile> Images { get; set; })
      if (imageFile) {
        formData.append("Images", imageFile); 
      }

      console.log("Sending Product Data...");
      await adminService.createProduct(formData);
      
      toast.success("Product added successfully!");

      // 5. Reset Form
      setProduct({ name: "", description: "", price: "", originalPrice: "", stock: "", categoryId: "" });
      setTypedCategoryName("");
      setImageFile(null);
      setPreview(null);

    } catch (err) {
      console.error("ADD PRODUCT ERROR:", err);
      // Detailed error logging for 500 errors
      const backendMessage = err.response?.data?.message || "Internal Server Error (500). Check Backend Console.";
      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center space-x-2 mb-6">
        <Package className="text-blue-600" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">Add New Product</h2>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Image Upload */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Image</label>
            <div className="relative group aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden transition-colors hover:border-blue-400">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                    <p className="text-xs text-gray-500">Click to upload image</p>
                  </div>
                )}
                <input 
                  type="file" 
                  onChange={handleFileChange} 
                  className="absolute inset-0 opacity-0 cursor-pointer" 
                  accept="image/*"
                  required
                />
            </div>
          </div>
        </div>

        {/* Right Column: Details */}
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
                placeholder="Product title"
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
                rows="3"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Details about product..."
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
                   MRP (Original Price)
                </label>
                <input
                  type="number"
                  name="originalPrice"
                  value={product.originalPrice}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  required
                />
              </div>
            </div>

            <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <List size={14} className="mr-2" /> Stock
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
                  placeholder="Type name (Will create if new)"
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
              
              {product.categoryId && (
                <p className="text-[10px] text-green-600 mt-1 ml-1 font-medium">
                  ✓ Matches existing category (ID: {product.categoryId})
                </p>
              )}
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
                  <>
                    <Save size={18} className="mr-2" /> Save Product
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;