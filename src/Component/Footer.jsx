  import { Facebook, Twitter, Instagram, Youtube, Shield } from "lucide-react";
    const  footer = ()=>{
      return(
  
  <footer className="bg-black border-t border-gray-800 pt-12 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-red-800 rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <span className="font-black text-lg">WOLF ATHLETIX</span>
              </div>
              <p className="text-gray-400 mb-4">
                Official licensed football jerseys and merchandise from the world's top clubs and players.
              </p>
              <div className="flex gap-4">
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                  <Twitter className="w-5 h-5" />
                </a>
                <a href="https://www.instagram.com/wolf.athletix/" target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-red-500 transition-colors">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                  <Youtube className="w-5 h-5" />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Shop</h3>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-red-500 transition-colors">Jerseys</button></li>
                <li><button className="text-gray-400 hover:text-red-500 transition-colors">Training Wear</button></li>
                <li><button className="text-gray-400 hover:text-red-500 transition-colors">Accessories</button></li>
                <li><button className="text-gray-400 hover:text-red-500 transition-colors">New Arrivals</button></li>
                <li><button className="text-gray-400 hover:text-red-500 transition-colors">Sale</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Support</h3>
              <ul className="space-y-2">
                <li><button className="text-gray-400 hover:text-red-500 transition-colors">Contact Us</button></li>
                <li><button className="text-gray-400 hover:text-red-500 transition-colors">FAQs</button></li>
                <li><button className="text-gray-400 hover:text-red-500 transition-colors">Shipping & Returns</button></li>
                <li><button className="text-gray-400 hover:text-red-500 transition-colors">Size Guide</button></li>
                <li><button className="text-gray-400 hover:text-red-500 transition-colors">Track Order</button></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Contact Info</h3>
              <address className="text-gray-400 not-italic">
                <p className="mb-2">123 Football Street</p>
                <p className="mb-2">Sports City, SC 12345</p>
                <p className="mb-2">Email: info@wolfathletix.com</p>
                <p>Phone: (123) 456-7890</p>
              </address>
            </div>
          </div>
          
          <div className="border-t border-gray-800 pt-8 text-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} Wolf Athletix. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      )
}
export default footer
