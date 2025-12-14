import React, { useState, useEffect, useContext } from "react";
import { ChevronDown, Star, TrendingUp, Award, Users, ArrowRight, Play, ShoppingBag, Shield, Trophy, Heart, Footprints } from "lucide-react";
import Footer from './Footer'

// Mocking the Contexts and API for a standalone file execution
const CartContext = React.createContext({ addToCart: () => console.log('Cart functionality placeholder') });
const WishlistContext = React.createContext({ addToWishlist: () => console.log('Wishlist functionality placeholder') });
// Mock useNavigate for standalone demonstration (The only declaration remaining)
const useNavigate = () => (path) => console.log(`Navigating to: ${path}`);
// Mocking AxiosInstance (though not used in the final logic)
const api = { get: (url) => Promise.resolve({ data: [] }) }; 

// --- PLACEHOLDER DATA FOR DEMO/TESTING ---
const placeholderPlayers = [
  { id: 1, name: "Lionel Messi", faceImage: "https://i.pinimg.com/736x/fe/61/d7/fe61d7549678d90e014d77b4e09659fa.jpg" },
  { id: 2, name: "Cristiano Ronaldo", faceImage: "https://i.pinimg.com/736x/a5/49/5c/a5495cb9c8cd77c3c985604c3e7bed69.jpg" },
  { id: 3, name: "Kylian Mbappé", faceImage: "https://i.pinimg.com/736x/26/e5/4f/26e54f1e3798ceb7fe33355577d47401.jpg" },
  { id: 4, name: "Ousmane Dembele", faceImage: "https://i.pinimg.com/1200x/c0/13/48/c01348e00137360e854bdd89186d474c.jpg" },
  { id: 5, name: "Neymar Jr", faceImage: "https://i.pinimg.com/1200x/cb/f9/48/cbf948f4f885ced34c6d953ec6c65e27.jpg" },
];

// --- FULL LANDSCAPE BACKGROUND IMAGE DATA ---
const backgroundImages = [
  "https://www.fanatics.com/content/ws/all/05e6a958-a395-492a-b83c-4c19ef2fc15a__2400X1095.png?w=2400",
  "https://www.fanatics.com/content/ws/all/c1507edc-2d7a-4969-8905-fd6491526e11__2400X972.jpg?w=2400",
"https://www.fanatics.com/content/ws/all/22d23fd1-7c59-4554-864d-fbfd33c9853e__2400X972.jpg?w=2400",
"https://www.fanatics.com/content/ws/all/08d61660-ea52-49ec-89ed-bc9ef31cff11__2400X972.jpg?w=2400"
];

// -----------------------------------------------------------------
// 1. HERO BACKGROUND COMPONENT (For Rotating Images)
// -----------------------------------------------------------------

const HeroBackground = ({ images }) => {
  const [currentBg, setCurrentBg] = useState(0);

  useEffect(() => {
    // Change image every 2 seconds
    const interval = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % images.length);
    }, 2000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="fixed inset-0 overflow-hidden">
      {images.map((imgSrc, index) => (
        <img
          key={index}
          src={imgSrc}
          alt={`Background ${index + 1}`}
          className={`fixed inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out 
            ${index === currentBg ? 'opacity-100' : 'opacity-0'}
            pointer-events-none select-none`}
          style={{ 
            zIndex: -2,
            objectPosition: 'center center',
          }}
        />
      ))}
    </div>
  );
};


// -----------------------------------------------------------------
// 2. MAIN HOMEPAGE COMPONENT
// -----------------------------------------------------------------

export default function WolfAthletixHomepage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false); 
  const [jerseys, setJersey] = useState([]);
  const [featuredJerseys, setFeaturedJerseys] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [players, setPlayers] = useState(placeholderPlayers);

  // Contexts and Hooks
  const contextMocks = {
    addToCart: () => console.log('Cart functionality placeholder'),
    addToWishlist: () => console.log('Wishlist functionality placeholder'),
  };
  const { addToCart } = useContext(CartContext) || contextMocks;
  const { addToWishlist } = useContext(WishlistContext) || contextMocks;
  const navigate = useNavigate();

  useEffect(() => {
    // Scroll detection logic 
    const handleScroll = () => {
        setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);

    const fetchProducts = async () => {
      try {
        // --- Mock Data with WORKING IMAGE LINKS ---
        const mockData = [
          { id: 101, name: "Chelsea Home Jersey", image: "https://images.unsplash.com/photo-1621251786571-08169991475c?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", price: 179.99, originalPrice: 219.99, player: "Mudryk", featured: true, newarrival: true, badge: "NEW" },
          { id: 102, name: "Real Madrid Away Kit", image: "https://images.unsplash.com/photo-1620953457588-e218764032d6?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", price: 160.00, originalPrice: 199.99, player: "Bellingham", featured: true, newarrival: true, badge: "SALE" },
          { id: 103, name: "Liverpool Home Jersey", image: "https://images.unsplash.com/photo-1549477002-3c246f406856?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", price: 189.99, originalPrice: 229.99, player: "Salah", featured: true, newarrival: false, badge: "TRENDING" },
          { id: 104, name: "Bayern Munich Home", image: "https://images.unsplash.com/photo-1568205421590-7d6860cc4e3a?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", price: 175.99, originalPrice: 210.00, player: "Musiala", featured: false, newarrival: true, badge: "NEW" },
        ];
        const data = mockData;
        // -----------------------------------------------------------------

        setJersey(data);
        const featured = data.filter((item) => item.featured === true); 
        setFeaturedJerseys(featured);
        const arrivals = data.filter((item) => item.newarrival === true);
        setNewArrivals(arrivals);
      } catch (error) {
        console.log("Error fetching products:", error);
      }
    };

    fetchProducts();
    
    return () => {
        window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Carousel auto slide
  useEffect(() => {
    if (newArrivals.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % newArrivals.length);
    }, 4000);

    return () => {
      clearInterval(timer);
    };
  }, [newArrivals.length]);

  const calculateDiscount = (price, originalPrice) => {
    if (!originalPrice || !price) return 0;
    return Math.round(((originalPrice - price) / originalPrice) * 100);
  };

  const goToSlide = (index) => setCurrentSlide(index);
  const goToNextSlide = () => setCurrentSlide((prev) => (prev + 1) % newArrivals.length);
  const goToPrevSlide = () => setCurrentSlide((prev) => (prev - 1 + newArrivals.length) % newArrivals.length);

  const teams = [
    { name: "Real Madrid", logo: "https://football-logos.cc/logos/spain/700x700/real-madrid.png" },
    { name: "Barcelona", logo: "https://football-logos.cc/logos/spain/700x700/barcelona.png" },
    { name: "Bayern Munich", logo: "https://football-logos.cc/logos/germany/700x700/bayern-munchen.png" },
    { name: "Liverpool", logo: "https://football-logos.cc/logos/england/700x700/liverpool.png" },
    { name: "Chelsea", logo: "https://football-logos.cc/logos/england/700x700/chelsea.png" },
    { name: "Man. City", logo: "https://football-logos.cc/logos/england/700x700/manchester-city.png" },
  ];

  const leagues = [
    { name: "Premier League", logo: "https://football-logos.cc/logos/england/700x700/english-premier-league-v2.png" },
    { name: "La Liga", logo: "https://football-logos.cc/logos/spain/700x700/la-liga-v2.png" },
    { name: "Bundesliga", logo: "https://upload.wikimedia.org/wikipedia/en/d/df/Bundesliga_logo_%282017%29.svg" },
    { name: "Serie A", logo: "https://upload.wikimedia.org/wikipedia/en/thumb/a/ab/Serie_A_ENILIVE_logo.svg/800px-Serie_A_ENILIVE_logo.svg.png" },
    { name: "Ligue 1", logo: "https://football-logos.cc/logos/france/700x700/ligue-1.png" }
  ];

  const features = [
    { icon: Award, title: "Premium Quality", desc: "Official licensed merchandise with authentic detailing" },
    { icon: Shield, title: "100% Authentic", desc: "Guaranteed official products from top brands" },
    { icon: Users, title: "Trusted by 50K+", desc: "Happy customers worldwide" },
    { icon: TrendingUp, title: "Latest Designs", desc: "2025 season collections" },
    { icon: Trophy, title: "Match Worn Spec", desc: "Same specifications as player editions" },
    { icon: Star, title: "Exclusive Items", desc: "Limited edition releases available only here" }
  ];

  return (
    <div className="min-h-screen text-white relative ">
      {/* Full Screen Background */}
      <HeroBackground images={backgroundImages} />
      
      {/* Dark overlay for better text readability */}
      <div className="fixed inset-0 bg-black/50 z-[-1]"></div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* 1. Hero Section */}
        <section className="min-h-screen relative pt-40 pb-20 md:pb-32 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Subtle Red Radial Gradient for depth */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-color-red-900)_0%,_transparent_50%)] opacity-10 blur-3xl"></div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 bg-red-600/20 border border-red-600/30 px-4 py-2 rounded-full mb-6">
                  <Star className="w-4 h-4 text-red-500" />
                  <span className="text-red-400 font-medium">OFFICIAL STORE</span>
                </div>
                <h1 className="text-5xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight">
                  <span className="bg-gradient-to-r from-white via-gray-300 to-white bg-clip-text text-transparent">
                    Wolf
                  </span>
                  <br />
                  <span className="bg-gradient-to-r from-red-500 via-red-600 to-red-700 bg-clip-text text-transparent">
                    Athletix
                  </span>
                </h1>
                <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto lg:mx-0">
                  Official licensed football jerseys from the world's top clubs and players.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <button onClick={() => navigate('/products')} className="group  hover:to-red-800 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-red-500/35">
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-6 h-6" onClick={()=>navigate('/products')}/>
                      Shop Collection 
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </button>
                  <button className="group border-2 border-gray-400 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:border-red-600 hover:text-red-500 bg-black/30 backdrop-blur-sm">
                    <a href="https://www.instagram.com/wolf.athletix/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-current">
                      <Play className="w-6 h-6" />
                      Watch Our Story
                    </a>
                  </button>
                </div>
              </div>

         
            </div>
          </div>
        </section>

        {/* Rest of the content with solid backgrounds */}
        <div className="bg-gradient-to-br from-gray-950 to-gray-900">
          {/* Trusted Partner Logos Section for Social Proof */}
          <section className="py-8 border-t border-b border-gray-800 bg-gray-900/80">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <p className="text-center text-sm font-semibold uppercase text-gray-400 mb-6 tracking-wider">
                Official Licensed Partner of Top Global Leagues
              </p>
              <div className="flex justify-around items-center flex-wrap gap-y-6 opacity-80">
                {leagues.slice(0, 5).map((league, index) => (
                 <div
  key={index}
  className="w-24 h-16 duration-500 cursor-pointer"
>
  <img
    src={league.logo}
    alt={league.name}
    className="w-full h-full object-contain icon-blue"
  />
</div>

                ))}
              </div>
            </div>
          </section>
          
          {/* Featured Products */}
          

          {/* Teams Section */}
          <section className="py-16 bg-gradient-to-br from-gray-950 to-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black mb-4">
                  <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Shop By 
                  </span>
                  <span className="text-red-500"> Club</span>
                </h2>
                <p className="text-gray-400 max-w-2xl mx-auto">
                  Find official jerseys from Europe's biggest leagues
                </p>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-4">
                {teams.map((team, index) => (
                  <button 
                    key={index} 
                    className="group bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-4 transition-all duration-300 hover:scale-105 hover:border-red-500"
                    onClick={() => console.log(`Navigating to ${team.name}`)}
                  >
                    <div className="flex flex-col items-center">
                      <div className="w-16 h-16 mb-2 bg-white rounded-full p-2 flex items-center justify-center border border-gray-600 shadow-lg">
                        <img src={team.logo} alt={team.name} className="w-12 h-12 object-contain" />
                      </div>
                      <span className="text-sm font-medium text-white group-hover:text-red-400 transition-colors mt-2">{team.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>
          
          {/* Features Section */}
          <section className="py-16 bg-gray-900/50 border-t border-b border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8">
                {features.map((feature, index) => (
                  <div key={index} className="group p-6 rounded-2xl bg-gray-900/80 border border-gray-800 hover:border-red-500 transition-all duration-300 hover:scale-105 shadow-xl">
                    <div className="flex justify-center mb-4">
                      <feature.icon className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <h3 className="text-lg font-bold mb-1 text-center text-white">{feature.title}</h3>
                    <p className="text-gray-400 text-sm text-center">{feature.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Leagues Section */}
          <section className="py-16 bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-black mb-4">
                  <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                    Shop By
                  </span>
                  <span className="text-red-500"> League</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {leagues.map((league, index) => (
                  <button key={index} className="group bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:border-red-500">
                    <div className="flex flex-col items-center">
                      <div className="w-20 h-20 mb-4 bg-white rounded-full p-3 flex items-center justify-center shadow-inner">
                        <img src={league.logo} alt={league.name} className="w-16 h-16 object-contain" />
                      </div>
                      <span className="font-medium text-white group-hover:text-red-400 transition-colors">{league.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* Players Section */}
          {players && players.length > 0 && (
            <section className="py-16 bg-gray-900">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-black mb-4">
                    <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                      Shop By
                    </span>
                    <span className="text-red-500"> Players</span>
                  </h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {players.map((player, index) => (
                    <button
                      key={index}
                      className="group bg-gray-800 hover:bg-gray-700 border border-gray-700 rounded-xl p-6 transition-all duration-300 hover:scale-105 hover:border-red-500"
                      onClick={() => navigate(`/players/${player.id}`)}
                    >
                      <div className="flex flex-col items-center">
                        <div className="w-24 h-24 mb-4 bg-gray-700 rounded-full p-1 flex items-center justify-center overflow-hidden border-2 border-red-500/50 shadow-lg">
                          <img
                            src={player.faceImage}
                            alt={player.name}
                            className="w-full h-full object-cover rounded-full"
                          />
                        </div>
                        <span className="font-medium group-hover:text-red-400 transition-colors text-center text-lg">
                          {player.name}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </section>
            
          )}
          <Footer/>
        </div>
      </div>
    </div>
  );
}