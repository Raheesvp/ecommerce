import React from 'react';
import {
  Trophy,
  Shield,
  Users,
  Target,
  Star,
  Award,
  Heart,
  CheckCircle,
  Zap,
  Globe,
  ShoppingBag
} from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: Target,
      title: "Precision Engineering",
      description: "Every product is designed with athlete performance as the top priority"
    },
    {
      icon: Shield,
      title: "Premium Quality",
      description: "Only the finest materials and construction techniques"
    },
    {
      icon: Zap,
      title: "Innovation Driven",
      description: "Constantly pushing boundaries with cutting-edge technology"
    },
    {
      icon: Users,
      title: "Community First",
      description: "Built by athletes, for athletes around the world"
    }
  ];

  const stats = [
    { number: "50K+", label: "Athletes Empowered" },
    { number: "100+", label: "Professional Teams" },
    { number: "15", label: "Countries Served" },
    { number: "24/7", label: "Customer Support" }
  ];

  const values = [
    {
      icon: Trophy,
      title: "Excellence",
      description: "We never settle for anything less than the best"
    },
    {
      icon: Heart,
      title: "Passion",
      description: "Driven by our love for the sport and its community"
    },
    {
      icon: Globe,
      title: "Innovation",
      description: "Constantly evolving to meet athletes' changing needs"
    },
    {
      icon: Users,
      title: "Community",
      description: "Building a global family of dedicated athletes"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 pt-20 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-green-500/20 text-green-400 px-4 py-2 rounded-full border border-green-500/30 mb-6">
            <Award size={20} />
            <span className="text-sm font-semibold">Premium Lacrosse Equipment</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight" style={{ fontFamily: "'Oswald', sans-serif" }}>
            WOLF <span className="bg-gradient-to-r from-green-400 to-green-600 bg-clip-text text-transparent">ATHLETIX</span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed">
            Empowering athletes with <span className="text-green-400 font-semibold">elite performance gear</span>
            and unparalleled innovation on the lacrosse field
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto mt-12">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 bg-gray-800/50 rounded-2xl border border-gray-700/50 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2" style={{ fontFamily: "'Oswald', sans-serif" }}>
                  {stat.number}
                </div>
                <div className="text-gray-400 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[length:40px_40px]"></div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-700/50 shadow-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Target className="text-green-400" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Our Mission
              </h2>
            </div>
            <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
              At <span className="text-green-400 font-semibold">Wolf Athleticx</span>, we believe that the right equipment
              can make all the difference between good and great. Our mission is to empower lacrosse players of all levels
              with the <span className="text-white font-semibold">highest quality, most innovative gear</span> on the market.
              We're not just selling equipment - we're providing tools for athletes to unleash their full potential.
            </p>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
              Why Choose Wolf Athleticx
            </h2>
            <p className="text-gray-400 text-lg">Experience the difference that premium engineering makes</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="group bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50 hover:border-green-500/30 transition-all duration-300 hover:transform hover:-translate-y-2 backdrop-blur-sm">
                <div className="bg-green-500/20 p-3 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="text-green-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Platform Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 md:p-12 border border-gray-700/50">
            <div className="flex items-center gap-3 mb-8">
              <ShoppingBag className="text-green-400" size={32} />
              <h2 className="text-3xl md:text-4xl font-bold text-white" style={{ fontFamily: "'Oswald', sans-serif" }}>
                Premium Shopping Experience
              </h2>
            </div>

            <p className="text-lg text-gray-300 mb-8">
              Our platform is designed to provide a seamless and engaging shopping experience for our community.
              We've built more than just a store - we've created a resource for dedicated athletes.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                {
                  title: "Intuitive Navigation",
                  description: "Easily browse our catalog of shafts, heads, apparel, and accessories with smart filtering",
                  icon: CheckCircle
                },
                {
                  title: "Detailed Product Information",
                  description: "Comprehensive specs, high-quality images, and expert recommendations for every product",
                  icon: CheckCircle
                },
                {
                  title: "Secure & Simple Checkout",
                  description: "Streamlined, safe, and secure checkout process designed for modern athletes",
                  icon: CheckCircle
                },
                {
                  title: "Customer-Focused Experience",
                  description: "24/7 support and personalized service from our team of lacrosse experts",
                  icon: CheckCircle
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-700/30 rounded-xl border border-gray-600/50">
                  <CheckCircle className="text-green-400 mt-1 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="text-white font-semibold mb-2">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4" style={{ fontFamily: "'Oswald', sans-serif" }}>
              Our Core Values
            </h2>
            <p className="text-gray-400 text-lg">The principles that drive everything we do</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="text-center group">
                <div className="bg-gradient-to-br from-green-500 to-green-600 p-1 rounded-2xl mb-6 mx-auto w-fit transform group-hover:scale-110 transition-all duration-300">
                  <div className="bg-gray-900 p-4 rounded-xl">
                    <value.icon className="text-green-400" size={32} />
                  </div>
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{value.title}</h3>
                <p className="text-gray-400 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}


      {/* Footer */}
      <footer className="text-center px-4">
        <div className="max-w-4xl mx-auto border-t border-gray-700/50 pt-8">
          <p className="text-gray-400 text-lg italic">
            Thank you for being a part of the <span className="text-green-400 font-semibold">Wolf Athleticx</span> family.
            Together, let's redefine the game.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;