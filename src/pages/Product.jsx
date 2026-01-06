 import React, { useContext, useEffect, useState, useMemo } from "react";
 import { Filter } from "lucide-react";
 import { CartContext } from "../Context/CartContext";
 import { WishlistContext } from "../Context/WishlistContext";
 import ProductCard from "../Component/CartDesign";
 import { useNavigate } from "react-router-dom";
 import { productService } from "../Services/ProductService";




function Product() {
  const [products, setProducts] = useState([]);
  const [sortOption, setSortOption] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [totalPages,setTotalPages] = useState(1);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const { addToWishlist, wishlist = [] } = useContext(WishlistContext);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  const isInWishlist = (id) => wishlist.some((item) => item.id === id);




const mapSortOption = (option) => {
  switch (option) {
    case "Price: Low to High":
      return { sortBy: "price", order: "asc" };
    case "Price: High to Low":
      return { sortBy: "price", order: "desc" };
    case "Newest":
      return { sortBy: "createdAt", order: "desc" };
    case "Top Rated":
      return { sortBy: "rating", order: "desc" };
    default:
      return {};
  }
};



useEffect(() => {
  const fetchProducts = async () => {
    try {
      const sort = mapSortOption(sortOption);

      const params = {
        page: currentPage,
        pageSize: itemsPerPage,
        sortBy: sort.sortBy,
        order: sort.order,
        category: categoryFilter !== "All" ? categoryFilter : undefined
      };

      const res = await productService.getProductByFilter(params);

      setProducts(res.data.items);
      setTotalPages(res.data.totalPages);
    

console.group("Product Sort Debug");
console.log("UI Sort:", sortOption);
console.log("API Params:", sort);
console.log("Prices:", res.data.items.map(p => p.price));
console.log("Ratings:", res.data.items.map(p => p.rating));
console.log("CreatedAt:", res.data.items.map(p => p.createdAt));
console.groupEnd();


        } catch (err) {
      console.error("Error fetching products", err);
      setProducts([]);
    }
  };

  fetchProducts();
}, [currentPage, sortOption, categoryFilter]);



useEffect(()=>{
  setCurrentPage(1);
},[sortOption,categoryFilter]);



  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 pt-20 pb-10 px-4">
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center gap-4 mt-5">
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

      {products.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAddToCart={addToCart}
                onAddToWishlist={addToWishlist}
                isInWishlist={isInWishlist}
                onClick={() => p.stock > 0 && navigate(`/product/${p.id}`)}
              />
            ))}
          </div>
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