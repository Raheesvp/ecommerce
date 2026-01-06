import React, { useState, useContext } from "react";
import api from "../../Api/AxiosInstance";
import { toast } from "react-toastify";
import { AuthContext } from "../../Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Package, DollarSign, Tag, Archive, FileText, Gift, Upload, Plus } from "lucide-react";

const NewProduct = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState({
    name: "",
    price: "",
    originalPrice: "",
    category: "",
    stock: "",
    description: "",
    offer: "",
    images: [],
  });

  const [dragActive, setDragActive] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct({ ...product, [name]: value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setProduct({ ...product, images: files });
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      setProduct({ ...product, images: files });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", product.name);
      formData.append("price", Number(product.price));
      formData.append("originalPrice", Number(product.originalPrice));
      formData.append("category", product.category);
      formData.append("stock", Number(product.stock));
      formData.append("description", product.description);
      formData.append("offer", product.offer || "");

      // Append images
      product.images.forEach((img) => formData.append("images", img));

      // POST request (Axios handles multipart/form-data automatically)
      await api.post("/products", formData);

      toast.success("Product added successfully!");

      // Reset form
      setProduct({
        name: "",
        price: "",
        originalPrice: "",
        category: "",
        stock: "",
        description: "",
        offer: "",
        images: [],
      });

    } catch (err) {
      if (err.response) {
        console.error("Backend error:", err.response.status, err.response.data);
      } else {
        console.error("Network error:", err.message);
      }
      toast.error("Failed to add product. Check backend logs!");
    }
  };

  const removeImage = (index) => {
    const newImages = product.images.filter((_, i) => i !== index);
    setProduct({ ...product, images: newImages });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full mb-4">
            <Plus className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
            Add New Product
          </h1>
          <p className="text-slate-600 text-lg">Create and customize your product listing</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-slate-200">
            {/* Basic Information Section */}
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
                <Package className="w-6 h-6 mr-3 text-blue-600" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-slate-700 placeholder-slate-400"
                  />
                </div>

                <div>
                  <label className=" text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    Current Price *
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    placeholder="0.00"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className=" text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <DollarSign className="w-4 h-4 mr-1 text-slate-400" />
                    Original Price
                  </label>
                  <input
                    type="number"
                    name="originalPrice"
                    value={product.originalPrice}
                    onChange={handleChange}
                    placeholder="0.00"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className=" text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Tag className="w-4 h-4 mr-1" />
                    Category *
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    placeholder="Enter category"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  />
                </div>

                <div>
                  <label className=" text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Archive className="w-4 h-4 mr-1" />
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={product.stock}
                    onChange={handleChange}
                    placeholder="0"
                    required
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Description and Offer Section */}
            <div className="mb-8 border-t border-slate-200 pt-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
                <FileText className="w-6 h-6 mr-3 text-blue-600" />
                Details & Offers
              </h2>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={product.description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Describe your product features, benefits, and specifications..."
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 resize-none"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-slate-700 mb-2 flex items-center">
                    <Gift className="w-4 h-4 mr-1" />
                    Special Offer
                  </label>
                  <input
                    type="text"
                    name="offer"
                    value={product.offer}
                    onChange={handleChange}
                    placeholder="e.g., Buy 2 Get 1 Free, 20% Off"
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Image Upload Section */}
            <div className="border-t border-slate-200 pt-8">
              <h2 className="text-2xl font-semibold text-slate-800 mb-6 flex items-center">
                <Upload className="w-6 h-6 mr-3 text-blue-600" />
                Product Images
              </h2>

              <div
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-200 ${dragActive
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-300 hover:border-slate-400'
                  }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <Upload className="w-12 h-12 mx-auto mb-4 text-slate-400" />
                <p className="text-lg font-medium text-slate-700 mb-2">
                  Drag and drop images here
                </p>
                <p className="text-sm text-slate-500 mb-4">
                  or click to select files
                </p>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 cursor-pointer"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose Files
                </label>
              </div>

              {/* Image Preview */}
              {product.images.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-slate-700 mb-3">
                    Selected Images ({product.images.length})
                  </p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {product.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-slate-100 rounded-lg flex items-center justify-center border border-slate-200">
                          <span className="text-sm text-slate-500 text-center px-2">
                            {image.name}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full text-xs hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="border-t border-slate-200 pt-8">
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 px-6 rounded-xl font-semibold text-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transform hover:scale-[1.02] transition-all duration-200 focus:ring-4 focus:ring-blue-200"
              >
                Add Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewProduct;