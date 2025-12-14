import React, { useState } from "react";

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
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
        orderNumber: ''
      });
      setSelectedCategory('general');
      
      // Reset status after 5 seconds
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
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: "Email Support",
      primary: "support@wolfathletix.com",
      secondary: "orders@wolfathletix.com",
      description: "We respond within 2-4 hours",
      color: "bg-blue-100 text-blue-600"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: "Phone Support",
      primary: "+91 98765 43210",
      secondary: "Toll Free: 1800-WOLF-ATH",
      description: "Mon-Sat 9AM-8PM IST",
      color: "bg-green-100 text-green-600"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: "Visit Our Store",
      primary: "Wolf Athletix Flagship",
      secondary: "Sports Complex Mall, Kozhikode, Kerala 673001",
      description: "Experience products in person",
      color: "bg-purple-100 text-purple-600"
    },
    {
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      title: "Live Chat",
      primary: "Chat with Expert",
      secondary: "Available 24/7",
      description: "Instant product assistance",
      color: "bg-red-100 text-red-600"
    }
  ];

  const faqItems = [
    {
      category: "Orders & Shipping",
      questions: [
        { q: "How can I track my order?", a: "Use your order number on our tracking page or check the email/SMS we sent you." },
        { q: "What are the shipping charges?", a: "Free shipping on orders above ₹999. Below that, shipping charges are ₹99." },
        { q: "How long does delivery take?", a: "2-4 business days in major cities, 4-7 days in other areas." }
      ]
    },
    {
      category: "Returns & Exchanges",
      questions: [
        { q: "What's your return policy?", a: "30-day return policy for unused items in original packaging with tags." },
        { q: "How do I exchange a product?", a: "Contact our support team or use the return portal in your account." },
        { q: "Are return shipping costs free?", a: "Yes, we provide free return pickup for defective or wrong items." }
      ]
    },
    {
      category: "Products & Sizing",
      questions: [
        { q: "How do I find my size?", a: "Use our size guide available on each product page or chat with our experts." },
        { q: "Are your products authentic?", a: "Yes, we only sell 100% authentic products from authorized brands." },
        { q: "Do you offer product warranty?", a: "Yes, all products come with manufacturer warranty as applicable." }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 ">
      {/* Header */}
    <div className=" bg-gradient-to-br from-gray-900 to-gray-800 pt-20 pb-10 px-4 ">

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 ">
          <div className="text-center">
            <div className="flex items-center justify-center mb-6">
             
              <h1 className="text-4xl md:text-6xl font-bold text-white mt-12">
                Wolf <span className="text-red-400">Athletix</span>
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Get in touch with our team for product support, order assistance, or partnership opportunities. 
              We're here to fuel your athletic journey.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span className="text-sm text-white">Live Support Available</span>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 flex items-center">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <span className="text-sm text-white">Response within 2 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Methods */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-15">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
          {contactMethods.map((method, index) => (
            <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 border border-gray-100">
              <div className={`w-12 h-12 ${method.color} rounded-full flex items-center justify-center mb-4`}>
                {method.icon}
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">{method.title}</h3>
              <p className="text-gray-900 font-semibold text-sm">{method.primary}</p>
              <p className="text-gray-600 text-sm">{method.secondary}</p>
              <p className="text-gray-500 text-xs mt-2">{method.description}</p>
              <button className="mt-3 text-red-600 hover:text-red-700 font-medium text-sm flex items-center">
                Get Help
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Contact Form */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 mt-9">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Send us a Message</h2>
              <p className="text-gray-600">We'd love to hear from you. Choose your inquiry type and we'll get back to you quickly.</p>
            </div>
            
            {/* Success/Error Messages */}
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-400 rounded-r-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-green-800 font-medium">Message sent successfully!</h3>
                    <p className="text-green-700 text-sm">We'll get back to you within 2-4 hours.</p>
                  </div>
                </div>
              </div>
            )}

            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-400 rounded-r-lg">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div>
                    <h3 className="text-red-800 font-medium">Failed to send message</h3>
                    <p className="text-red-700 text-sm">Please try again or contact us directly.</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Inquiry Type Selection */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  How can we help you? *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { id: 'general', label: '💬 General', desc: 'General inquiry' },
                    { id: 'order', label: '📦 Order Help', desc: 'Order support' },
                    { id: 'product', label: '🏃‍♂️ Products', desc: 'Product questions' },
                    { id: 'returns', label: '↩️ Returns', desc: 'Returns & exchanges' },
                    { id: 'technical', label: '🔧 Technical', desc: 'Website issues' },
                    { id: 'business', label: '🤝 Business', desc: 'Partnership' }
                  ].map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => setSelectedCategory(category.id)}
                      className={`p-3 text-sm rounded-lg border-2 transition-all duration-200 text-left ${
                        selectedCategory === category.id
                          ? 'border-red-500 bg-red-50 text-red-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="font-medium">{category.label}</div>
                      <div className="text-xs text-gray-500">{category.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Personal Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    placeholder="+91 98765 43210"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Number <span className="text-gray-400">(if applicable)</span>
                  </label>
                  <input
                    type="text"
                    value={formData.orderNumber}
                    onChange={(e) => handleInputChange('orderNumber', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                    placeholder="WA2024xxxxxxx"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject *
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) => handleInputChange('subject', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors"
                  placeholder="Brief description of your inquiry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message *
                </label>
                <textarea
                  rows="5"
                  value={formData.message}
                  onChange={(e) => handleInputChange('message', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors resize-none"
                  placeholder="Please provide detailed information about your inquiry..."
                ></textarea>
              </div>

              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg font-semibold text-lg hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending Message...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                    Send Message
                  </>
                )}
              </button>

              <p className="text-center text-sm text-gray-500">
                By sending this message, you agree to our terms of service and privacy policy.
              </p>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="space-y-8">
            
            {/* Quick Info */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 mt-9">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Quick Information</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-blue-100 text-blue-600 p-2 rounded-lg mr-3 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Response Time</h4>
                    <p className="text-sm text-gray-600">We typically respond within 2-4 hours during business hours</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-green-100 text-green-600 p-2 rounded-lg mr-3 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Resolution Rate</h4>
                    <p className="text-sm text-gray-600">98% of queries resolved on first contact</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="bg-purple-100 text-purple-600 p-2 rounded-lg mr-3 mt-0.5">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a2 2 0 01-2-2v-6a2 2 0 012-2h2m6 0V6a2 2 0 00-2-2H9a2 2 0 00-2 2v2h10z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">Multi-Language</h4>
                    <p className="text-sm text-gray-600">Support available in English, Hindi, and Malayalam</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Business Hours */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Business Hours</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600">Monday - Friday</span>
                  <span className="font-semibold text-gray-800">9:00 AM - 8:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600">Saturday</span>
                  <span className="font-semibold text-gray-800">10:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between items-center py-1">
                  <span className="text-gray-600">Sunday</span>
                  <span className="text-red-600 font-semibold">Closed</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  <strong>Note:</strong> Live chat and email support available 24/7. Phone support follows business hours.
                </p>
              </div>
            </div>

            {/* FAQ Section */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4">
                {faqItems.map((category, categoryIndex) => (
                  <div key={categoryIndex}>
                    <h4 className="font-semibold text-red-600 text-sm mb-2">{category.category}</h4>
                    {category.questions.slice(0, 2).map((faq, index) => (
                      <details key={index} className="group mb-2">
                        <summary className="flex items-center justify-between cursor-pointer list-none text-sm">
                          <span className="font-medium text-gray-700 pr-2">{faq.q}</span>
                          <svg className="w-4 h-4 text-gray-500 group-open:rotate-180 transition-transform duration-200 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </summary>
                        <p className="mt-2 text-sm text-gray-600 leading-relaxed pr-4">{faq.a}</p>
                      </details>
                    ))}
                  </div>
                ))}
                <button className="w-full mt-4 text-red-600 hover:text-red-700 font-medium text-sm flex items-center justify-center">
                  View All FAQs
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Social Media */}
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Connect With Us</h3>
              <div className="grid grid-cols-2 gap-3">
                <a href="#" className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                  <span className="text-sm font-medium text-blue-600">Twitter</span>
                </a>
                 <a href="#" className="flex items-center p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <svg className="w-5 h-5 text-blue-800 mr-2" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/>
                  </svg>
                  <span className="text-sm font-medium text-blue-800">Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactPage;