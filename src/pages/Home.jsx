import React, { useContext, useEffect, useState } from 'react';
import Navbar from '../Component/Navbar';
import Footer from '../Component/Footer'
import Banner from '../Component/Banner';
import { CartContext } from '../Context/CartContext';
import { WishlistContext } from '../Context/WishlistContext';
import api from '../Api/AxiosInstance';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthContext';

function Home() {

  const { cart, addToCart } = useContext(CartContext);
  const { wishlist, addToWishlist } = useContext(WishlistContext);

  const [products, setProducts] = useState([]);
 




  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/products');
        setProducts(res.data);
      } catch (err) {
        console.error(err);
      } 
    };
    fetchProducts();
  }, []);

  const isInWishlist = (id) => wishlist.some((item) => item.id === id);

  return (
    <div>
      <Navbar />
      <Banner />
     
      <Footer />
    </div>
  );
}

export default Home;
