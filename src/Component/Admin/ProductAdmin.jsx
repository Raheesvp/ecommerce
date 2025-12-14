import React, { useEffect, useState } from "react";
import api from "../../Api/AxiosInstance";
import { toast } from "react-toastify";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({});

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (err) {
      console.error("Error fetching products:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/products/${id}`);
      toast.success("Product deleted!");
      fetchProducts();
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete product!");
    }
  };

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData(product);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) setFormData({ ...formData, image: file });
  };

  const handleUpdate = async () => {

      if(formData.stock<1 &&  <p className="text-red-600 font-semibold mb-2"></p>){
        toast.error("Product is Out of Stock");
        return ;
      }

    try {
      const payload = {
        name: formData.name,
        price: formData.price,
        category: formData.category,
        description: formData.description,
        image: formData.image,
        images: formData.images,
        offer: formData.offer,
        rating: formData.rating,
        originalPrice: formData.originalPrice,
        featured: formData.featured,
        createdAt: formData.createdAt,
        stock:formData.stock,
      };
      await api.put(`/products/${editingProduct.id}`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      toast.success("Product updated!");
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error("Update error:", err);
      toast.error("Failed to update product!");
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-white mb-6">Manage Products</h2>

      <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
        <table className="w-full border-collapse text-sm">
          <thead className="bg-indigo-100 text-indigo-700">
            <tr>
              <th className="p-3 font-semibold text-left">Name</th>
              <th className="p-3 font-semibold text-left">Image</th>
              <th className="p-3 font-semibold text-left">Price</th>
              <th className="p-3 font-semibold text-left">Category</th>
              <th className="p-3 font-semibold text-left">Stock</th>
              <th className="p-3 font-semibold text-left">Actions</th>

            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => (
                <tr key={p.id} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-medium text-gray-700">{p.name}</td>
                  <td className="p-3">
                    {p.image ? (
                      <img
                        src={typeof p.image === "string" ? p.image : URL.createObjectURL(p.image)}
                        alt={p.name}
                        className="w-16 h-16 object-cover rounded-md border"
                      />
                    ) : (
                      <span className="text-gray-400 italic">No Image</span>
                    )}
                  </td>
                  <td className="p-3 font-semibold text-green-600">${p.price}</td>
                  <td className="p-3 text-gray-700">{p.category}</td>
                  <td className="p-3 font-semibold text-purple-600">{p.stock}</td>

                  <td className="p-3 space-x-2">
                    <button
                      onClick={() => handleEditClick(p)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-6 text-center text-gray-500 italic">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96 ">
            <h3 className="text-xl font-bold mb-4 text-blue-800">Edit Product</h3>

            <input
              type="text"
              name="name"
              value={formData.name || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-2 focus:outline-none focus:ring-2 focus:ring-indigo-400 text-black"
              placeholder="Name"
            />

            {editingProduct.image && (
              <img
                src={typeof editingProduct.image === "string" ? editingProduct.image : URL.createObjectURL(editingProduct.image)}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-md mb-2 border text-black"
              />
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded-md mb-2 text-black"
            />

            <input type="number" name="stock" value={formData.stock || 0} 
            onChange={handleChange} className="w-full p-2 border rounded-md mb-2 text-black" 
            placeholder="Stock Quantity"/>



            <div className="flex items-center gap-3 mb-2">
  <button
    type="button"
    onClick={() => setFormData({ ...formData, stock: (formData.stock || 0) - 1 })}
    className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-md"
  >
    -
  </button>

  <span className="font-semibold text-black">
    {formData.stock || 0}
  </span>

  <button
    type="button"
    onClick={() => setFormData({ ...formData, stock: (formData.stock || 0) + 1 })}
    className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-md"
  >
    +
  </button>
</div>


            <input
              type="number"
              name="price"
              value={formData.price || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-2 text-black"
              placeholder="Price"
            />

            <input
              type="text"
              name="category"
              value={formData.category || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-2 text-black"
              placeholder="Category"
            />

            <textarea
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              className="w-full p-2 border rounded-md mb-2 text-black"
              placeholder="Description"
            />

            <div className="flex justify-end space-x-2 mt-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="px-3 py-1 bg-gray-400 hover:bg-gray-500 text-white rounded-md transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded-md transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
