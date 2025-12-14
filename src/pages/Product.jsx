import React, { useContext, useEffect, useState } from "react";
import { Filter, Grid3X3 } from "lucide-react";
import api from "../Api/AxiosInstance";
import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/WishlistContext";
import ProductCard from "../Component/CartDesign";
import { useNavigate } from "react-router-dom";
import ProductDetails from "./ProductDetails";


function Product() {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const { addToWishlist, wishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);

  const navigate = useNavigate();

  const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching data...", err);
      }
    };
    fetchProducts();
  }, []);

  // Apply category filter
  let filteredProducts = products.filter((p) => {
    return categoryFilter === "All" || p.category?.toLowerCase() === categoryFilter.toLowerCase();
  });

  // Sorting
  filteredProducts = filteredProducts.sort((a, b) => {
    if (sortOption === "Featured") return (b.featured === "true") - (a.featured === "true");
    if (sortOption === "Price: Low to High") return a.price - b.price;
    if (sortOption === "Price: High to Low") return b.price - a.price;
    if (sortOption === "Newest") return new Date(b.createdAt) - new Date(a.createdAt);
    if (sortOption === "Top Rated") return b.rating - a.rating;
    return 0;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-20 pb-10 px-4
 bg-blue-600">
      {/* Filters & Sorting */}
      <div className="max-w-7xl mx-auto flex flex-col gap-4 mb-15">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3 flex-wrap mt-8">
            <div className="flex items-center gap-2 text-white-600  ">
              <Filter size={16}  />
              <span className="text-sm font-medium text-white ">Sort By:</span>
            </div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="bg-white border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option>All</option>
              <option>Featured</option>
              <option>Newest</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Top Rated</option>
            </select>

          </div>

          {/* Grid view indicator */}
  
        </div>
      </div>

      {/* Product Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onAddToCart={addToCart}
              onAddToWishlist={addToWishlist}
              isInWishlist={isInWishlist}
              onClick={() => product.stock>0 &&  navigate(`/products/${p.id}`)}
          
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-gray-600">
            No products found. Try adjusting your filters.
          </p>
        </div>
      )}
    </div>
  );
}

export default Product;