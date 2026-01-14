import React, { useState } from "react";
import { 
  Mail, 
  Phone, 
  MapPin, 
  MessageSquare, 
  Clock, 
  ShieldCheck, 
  Globe, 
  ChevronDown, 
  Send,
  Zap,
  ArrowRight
} from "lucide-react";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
    orderNumber: ''
  });

  const [selectedCategory, setSelectedCategory] = useState('general');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSubmitStatus('success');
      setFormData({
        name: '', email: '', phone: '', subject: '', message: '', orderNumber: ''
      });
      setSelectedCategory('general');
      setTimeout(() => setSubmitStatus(null), 5000);
    } catch (error) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus(null), 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <Mail className="w-6 h-6" />,
      title: "Email Support",
      primary: "support@wolfathletix.com",
      secondary: "orders@wolfathletix.com",
      description: "Response within 2-4 hours",
      color: "bg-blue-600/10 text-blue-500 border-blue-500/20"
    },
    {
      icon: <Phone className="w-6 h-6" />,
      title: "Phone Support",
      primary: "+91 98765 43210",
      secondary: "Toll Free: 1800-WOLF-ATH",
      description: "Mon-Sat 9AM-8PM IST",
      color: "bg-green-600/10 text-green-500 border-green-500/20"
    },
    {
      icon: <MapPin className="w-6 h-6" />,
      title: "Visit Our Store",
      primary: "Wolf Athletix Flagship",
      secondary: "Kozhikode, Kerala 673001",
      description: "Sports Complex Mall",
      color: "bg-purple-600/10 text-purple-500 border-purple-500/20"
    },
    {
      icon: <MessageSquare className="w-6 h-6" />,
      title: "Live Chat",
      primary: "Chat with Expert",
      secondary: "Available 24/7",
      description: "Instant Assistance",
      color: "bg-red-600/10 text-red-500 border-red-500/20"
    }
  ];

  const faqItems = [
    {
      category: "Orders & Shipping",
      questions: [
        { q: "How can I track my order?", a: "Use your order number on our tracking page or check the email/SMS we sent you." },
        { q: "What are the shipping charges?", a: "Free shipping on orders above ₹999. Below that, shipping charges are ₹99." }
      ]
    },
    {
      category: "Returns & Exchanges",
      questions: [
        { q: "What's your return policy?", a: "30-day return policy for unused items in original packaging with tags." },
        { q: "How do I exchange a product?", a: "Contact our support team or use the return portal in your account." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-red-500/30">
      
      {/* Header / Hero Section */}
      <div className="relative pt-32 pb-20 px-4 border-b border-white/5 bg-gradient-to-b from-red-900/10 via-transparent to-transparent overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/5 rounded-full blur-[120px] -mr-48 -mt-48"></div>
        
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6 animate-fade-in">
            <Zap size={14} className="text-red-500 fill-current" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Elite Support Systems</span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black italic uppercase tracking-tighter leading-none mb-6">
            Get In <span className="text-red-600">Touch</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Need tactical assistance with your gear or an update on your deployment? 
            Our team of experts is on standby 24/7.
          </p>
        </div>
      </div>

      {/* Contact Methods Grid */}
      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactMethods.map((method, index) => (
            <div key={index} className="group bg-[#111] border border-white/5 p-6 rounded-[2rem] hover:border-red-500/30 transition-all duration-500 backdrop-blur-xl shadow-2xl">
              <div className={`w-14 h-14 rounded-2xl border ${method.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                {method.icon}
              </div>
              <h3 className="text-lg font-black uppercase tracking-tight mb-2 italic">{method.title}</h3>
              <p className="text-white font-bold text-sm mb-1">{method.primary}</p>
              <p className="text-gray-500 text-xs mb-4">{method.secondary}</p>
              <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-red-500">{method.description}</span>
                <ArrowRight size={14} className="text-gray-700 group-hover:text-red-500 transition-colors" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Form Side */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-white/5 border border-white/10 p-8 md:p-12 rounded-[3rem] backdrop-blur-xl">
              <div className="mb-10">
                <h2 className="text-3xl font-black italic uppercase tracking-tighter mb-2">Deploy a <span className="text-red-600">Message</span></h2>
                <p className="text-gray-500 font-medium uppercase tracking-widest text-[10px]">Average Response Time: 120 Minutes</p>
              </div>

              {submitStatus === 'success' && (
                <div className="mb-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl flex items-center gap-4 animate-in zoom-in-95">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                    <ShieldCheck className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold uppercase tracking-tight">Transmission Received</h3>
                    <p className="text-green-500 text-xs font-bold uppercase tracking-widest mt-1">Check your inbox for a ticket confirmation.</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Category Chips */}
                <div className="space-y-4">
                  <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Inquiry Specification</label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { id: 'general', label: 'General' },
                      { id: 'order', label: 'Orders' },
                      { id: 'product', label: 'Technical' },
                      { id: 'business', label: 'Partnership' }
                    ].map((cat) => (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => setSelectedCategory(cat.id)}
                        className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                          selectedCategory === cat.id 
                          ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-900/20' 
                          : 'bg-white/5 border-white/5 text-gray-500 hover:border-white/20'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-red-500/50 transition-all font-medium placeholder:text-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-red-500/50 transition-all font-medium placeholder:text-gray-700"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <input
                    type="tel"
                    placeholder="Phone (Optional)"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-red-500/50 transition-all font-medium placeholder:text-gray-700"
                  />
                  <input
                    type="text"
                    placeholder="Order ID (WA-XXXX)"
                    value={formData.orderNumber}
                    onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-red-500/50 transition-all font-medium placeholder:text-gray-700"
                  />
                </div>

                <input
                  type="text"
                  placeholder="Subject"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-red-500/50 transition-all font-medium placeholder:text-gray-700"
                />

                <textarea
                  rows="5"
                  placeholder="Your detailed inquiry..."
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-white outline-none focus:border-red-500/50 transition-all font-medium placeholder:text-gray-700 resize-none"
                ></textarea>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-red-600 hover:bg-red-700 text-white py-5 rounded-2xl font-black italic uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-900/20 active:scale-[0.98] disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>Deploy Message <Send size={18} /></>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Info Side */}
          <div className="lg:col-span-5 space-y-8 lg:sticky lg:top-28">
            {/* Quick Stats Card */}
            <div className="bg-[#111] border border-white/5 p-8 rounded-[2.5rem] space-y-6">
              <h3 className="text-xl font-black italic uppercase tracking-tighter text-white border-b border-white/5 pb-4">Operational Intel</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 h-fit">
                    <Clock size={20} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-tight text-white">Rapid Response</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">Our support division operates across 3 time zones to ensure minimal latency.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="p-3 bg-white/5 rounded-xl border border-white/10 h-fit">
                    <Globe size={20} className="text-red-500" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-tight text-white">Global Reach</h4>
                    <p className="text-xs text-gray-500 font-medium leading-relaxed mt-1">Support available in English, Hindi, and Malayalam for regional logistics.</p>
                  </div>
                </div>
              </div>

              {/* Hours Grid */}
              <div className="pt-6 border-t border-white/5 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-500">Mon - Fri</span>
                  <span className="text-white italic">0900 - 2000 HRS</span>
                </div>
                <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
                  <span className="text-gray-500">Sat - Sun</span>
                  <span className="text-red-600 italic">Limited Deployment</span>
                </div>
              </div>
            </div>

            {/* FAQ Mini Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-black uppercase tracking-[0.3em] text-gray-500 ml-4">Common Briefings</h3>
              <div className="space-y-2">
                {faqItems[0].questions.map((faq, i) => (
                  <details key={i} className="group bg-white/5 border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
                    <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                      <span className="text-xs font-bold uppercase tracking-tight text-gray-300 group-open:text-red-500">{faq.q}</span>
                      <ChevronDown size={14} className="text-gray-600 group-open:rotate-180 transition-transform" />
                    </summary>
                    <div className="px-5 pb-5 text-[11px] text-gray-500 font-medium leading-relaxed">
                      {faq.a}
                    </div>
                  </details>
                ))}
              </div>
              <button className="w-full text-[10px] font-black uppercase tracking-[0.4em] text-gray-600 hover:text-white transition-colors text-center pt-4">
                View Full FAQ Database
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ContactPage;