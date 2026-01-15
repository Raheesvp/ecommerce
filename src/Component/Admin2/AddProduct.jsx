import React, { useState, useEffect } from "react";
import { adminService } from "../../Services/AdminService";
import { toast } from "react-toastify";
import { 
  Package, Upload, IndianRupee, Tag, List, 
  Info, Save, Loader2, PlusCircle, LayoutGrid, 
  Star,
  Zap,
  ShieldCheck
} from "lucide-react";

const AddProduct = () => {
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]); 
  const [typedCategoryName, setTypedCategoryName] = useState(""); 
  const [hoverRating,setHoverRating] = useState(0);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    stock: "",
    categoryId: "",
    rating:0,
    featured:false
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
    if (parseFloat(product.originalPrice) <= parseFloat(product.price)) {
      toast.error("Original Price (MRP) must be greater than the Selling Price");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("Name", product.name);
      formData.append("Description", product.description);
      formData.append("Price", product.price);
      formData.append("Stock", product.stock);
      formData.append("OriginalPrice", product.originalPrice); 
      formData.append("Category", typedCategoryName);
      formData.append("Offer", "No Offer"); 
      formData.append("Rating", product.rating);
      formData.append("Featured", product.featured);

      if (imageFile) {
        formData.append("Images", imageFile); 
      }

      await adminService.createProduct(formData);
      toast.success("Product added to inventory!");

      setProduct({ name: "", description: "", price: "", originalPrice: "", stock: "", categoryId: "" ,rating:"",featured:false});
      setTypedCategoryName("");
      setImageFile(null);
      setPreview(null);
    } catch (err) {
      const backendMessage = err.response?.data?.message || "Internal Server Error (500)";
      toast.error(backendMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-6">
        <div>
          <div className="flex items-center space-x-2 text-blue-600 mb-2">
            <Package size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Logistics Branch</span>
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">
            Enlist New <span className="text-blue-600">Product</span>
          </h2>
        </div>
        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest max-w-xs md:text-right">
          Ensure all technical specifications and pricing protocols are accurate.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image & Status */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100">
            <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center">
              <Upload size={14} className="mr-2" /> Visual Identity
            </h3>
            
            <div className="relative group aspect-square rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center overflow-hidden transition-all hover:border-blue-400 hover:bg-blue-50/30">
                {preview ? (
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-6 space-y-2">
                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
                        <Upload className="text-gray-300" size={28} />
                    </div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-tighter">Upload High-Res Asset</p>
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
                <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center">
              <Star size={14} className="mr-2 text-yellow-500" /> Performance Rating
            </h3>
            <div className="flex items-center justify-center space-x-2 bg-gray-50 p-4 rounded-2xl">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setProduct({ ...product, rating: star })}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="transition-transform active:scale-90"
                >
                  <Star
                    size={28}
                    fill={(hoverRating || product.rating) >= star ? "#EAB308" : "none"}
                    className={`transition-colors ${(hoverRating || product.rating) >= star ? "text-yellow-500" : "text-gray-300"}`}
                  />
                </button>
              ))}
            </div>

              <div className="bg-white p-6 rounded-[2rem] shadow-xl shadow-blue-900/5 border border-gray-100">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 flex items-center">
              <Zap size={14} className="mr-2 text-blue-600" /> Priority Status
            </h3>
            <div className="flex p-1 bg-gray-100 rounded-2xl">
              <button
                type="button"
                onClick={() => setProduct({ ...product, featured: false })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${!product.featured ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
              >
                Standard
              </button>
              <button
                type="button"
                onClick={() => setProduct({ ...product, featured: true })}
                className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${product.featured ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-gray-400 hover:text-gray-600'}`}
              >
                <ShieldCheck size={14} /> Elite / Featured
              </button>
            </div>
            <p className="text-[9px] text-gray-400 mt-3 px-2 text-center font-bold uppercase tracking-tighter leading-tight">
              Featured products appear in the priority storefront carousel.
            </p>
          </div>
    

            <p className="text-center mt-2 text-[10px] font-bold text-gray-400 uppercase italic">
              Level {product.rating || 0} Professional Grade
            </p>
          </div>
        </div>
        
        

        {/* Right Column: Detailed Specs */}
        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-blue-900/5 border border-gray-100 space-y-6">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center">
                        <Tag size={12} className="mr-2 text-blue-600" /> Designation (Name)
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-gray-800 placeholder:text-gray-300 transition-all"
                        placeholder="e.g. Stealth Compression Top"
                        required
                    />
                </div>

                <div className="md:col-span-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center">
                        <Info size={12} className="mr-2 text-blue-600" /> Operational Details (Description)
                    </label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleInputChange}
                        rows="4"
                        className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 placeholder:text-gray-300 transition-all"
                        placeholder="Technical fabric specs, fit, and performance benefits..."
                        required
                    ></textarea>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center">
                        <IndianRupee size={12} className="mr-2 text-blue-600" /> Deployment Price
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            name="price"
                            value={product.price}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-black text-gray-800"
                            required
                        />
                        <IndianRupee size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center">
                        MRP Value (Strike)
                    </label>
                    <div className="relative">
                        <input
                            type="number"
                            name="originalPrice"
                            value={product.originalPrice}
                            onChange={handleInputChange}
                            className="w-full pl-10 pr-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-gray-400"
                            required
                        />
                         <IndianRupee size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-200" />
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center">
                        <LayoutGrid size={12} className="mr-2 text-blue-600" /> Category Manifest
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            list="category-list"
                            value={typedCategoryName}
                            onChange={handleCategoryInputChange}
                            placeholder="Type name..."
                            className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-gray-800"
                            required
                        />
                        <datalist id="category-list">
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.name} />
                            ))}
                        </datalist>

                        {typedCategoryName && !product.categoryId && (
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 bg-blue-100 text-blue-600 px-2 py-0.5 rounded text-[8px] font-black tracking-widest animate-pulse">
                                NEW
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2 flex items-center">
                        <List size={12} className="mr-2 text-blue-600" /> Initial Stock
                    </label>
                    
                    <input
                        type="number"
                        name="stock"
                        value={product.stock}
                        onChange={handleInputChange}
                        className="w-full px-5 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-blue-500 font-bold text-gray-800"
                        required
                    />
                </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 hover:bg-blue-600 text-white font-black italic uppercase tracking-widest py-4 rounded-3xl flex items-center justify-center transition-all shadow-xl shadow-gray-200 disabled:bg-gray-400 disabled:shadow-none"
              >
                {loading ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <>
                    <Save size={18} className="mr-2" /> Commit Product to Vault
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