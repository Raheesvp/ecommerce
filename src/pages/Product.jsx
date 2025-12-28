import React, { useContext, useEffect, useState, useMemo } from "react";
import { Filter } from "lucide-react";
import api from "../Api/AxiosInstance";
import { CartContext } from "../Context/CartContext";
import { WishlistContext } from "../Context/WishlistContext";
import ProductCard from "../Component/CartDesign";
import { useNavigate } from "react-router-dom";

function Product() {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { addToWishlist, wishlist } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        console.error("Error fetching products", err);
      }
    };
    fetchProducts();
  }, []);

  // Reset page when filters/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [sortOption, categoryFilter]);

  // Filter + Sort (memoized)
  const filteredProducts = useMemo(() => {
    let result = products.filter((p) => {
      return (
        categoryFilter === "All" ||
        p.category?.toLowerCase() === categoryFilter.toLowerCase()
      );
    });

    return result.sort((a, b) => {
      if (sortOption === "Featured")
        return (b.featured === "true") - (a.featured === "true");
      if (sortOption === "Price: Low to High") return a.price - b.price;
      if (sortOption === "Price: High to Low") return b.price - a.price;
      if (sortOption === "Newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortOption === "Top Rated") return b.rating - a.rating;
      return 0;
    });
  }, [products, sortOption, categoryFilter]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-20 pb-10 px-4">
      {/* Filters & Sorting */}
      <div className="max-w-7xl mx-auto mb-10">
        <div className="flex items-center gap-4">
          <Filter size={16} className="text-white" />
          <span className="text-white text-sm font-medium">Sort By:</span>

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="bg-white text-black border rounded-lg px-3 py-2 text-sm"
          >
            <option>All</option>
            <option>Featured</option>
            <option>Newest</option>
            <option>Price: Low to High</option>
            <option>Price: High to Low</option>
            <option>Top Rated</option>
          </select>
        </div>
      </div>

      {/* Product Grid */}
      {paginatedProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {paginatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={addToCart}
                onAddToWishlist={addToWishlist}
                isInWishlist={isInWishlist}
                onClick={() =>
                  p.stock > 0 && navigate(`/products/${p.id}`)
                }
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-10">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => p - 1)}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                return (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-2 rounded ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-700 text-white"
                    }`}
                  >
                    {page}
                  </button>
                );
              })}

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
                className="px-4 py-2 bg-gray-700 text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-gray-400">
          No products found. Try adjusting your filters.
        </div>
      )}
    </div>
  );
}

export default Product;
