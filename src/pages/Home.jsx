import React from "react";
import Navbar from "../Component/Navbar";
import Banner from "../Component/Banner";
import FeaturedProducts from "./HomePage/Featured";
import TrendingLeagues from "./HomePage/TrendingLeague";
import RecentlyViewed from "./HomePage/RecentlyViewed";
import Newsletter from "./HomePage/NewsLetterSignup";
import Footer from "../Component/Footer";

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black overflow-x-hidden">
      {/* Navigation: Always at the top */}
      <Navbar />
      
      <main className="flex-grow">
        {/* 1. Hero Section: Direct visual impact with the main banner */}
        <Banner />

        {/* 2. Featured Section: 
            This component now handles its own internal 'useEffect' 
            to fetch data from /api/Products/featured 
        */}
        <FeaturedProducts />

        {/* 3. Category Navigation: Browse by League (PL, La Liga, etc.) */}
        <TrendingLeagues />

        {/* 4. Personalized History: Show user's local browsing history */}
        <RecentlyViewed />

        {/* 5. Lead Generation: Newsletter signup */}
        <Newsletter />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}

export default Home;