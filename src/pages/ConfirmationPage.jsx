import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CheckCircle, ShoppingBag, Truck, Home, ArrowRight, Package, Calendar, MapPin, ReceiptText, X, Download } from "lucide-react";
import React, { useEffect, useState } from "react";
import api from "../Api/AxiosInstance";
import { toast } from "react-toastify";

function ConfirmationPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const [order, setOrder] = useState(state?.order || null);
  const [loading, setLoading] = useState(!state?.order && !!id);
  
  // NEW STATES FOR PDF PREVIEW
  const [pdfUrl, setPdfUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleDownloadInvoice = async () => {
    setIsGenerating(true);
    try {
      const orderId = order.orderId || order.id;
      
      const response = await api.get(`/orders/invoice/${orderId}`, {
        responseType: 'blob',
      });

      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      
      setPdfUrl(url);
      setShowModal(true);
      toast.success("Invoice Generated!");
    } catch (err) {
      console.error("Download Error:", err);
      toast.error("Failed to generate PDF. Check if the backend is running.");
    } finally {
      setIsGenerating(false);
    }
  };

  const triggerDownload = () => {
    if (!pdfUrl) return;
    const orderId = order.orderId || order.id;
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.setAttribute('download', `WolfAthletix_Invoice_${orderId}.pdf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    if (!order && id) {
      const fetchOrderDetails = async () => {
        try {
          const response = await api.get(`/orders/${id}`);
          setOrder(response.data.data || response.data);
        } catch (err) {
          console.error("Error fetching order:", err);
          toast.error("Could not retrieve order details.");
        } finally {
          setLoading(false);
        }
      };
      fetchOrderDetails();
    }
  }, [id, order]);

  const subtotal = order?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-black uppercase tracking-widest animate-pulse">Retrieving Armory Data...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
        <div className="text-center max-w-md bg-white/5 border border-white/10 p-12 rounded-[2.5rem] backdrop-blur-xl">
          <div className="w-20 h-20 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
            <Package size={40} className="text-gray-700" />
          </div>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white mb-4">No Order Found</h2>
          <p className="text-gray-500 mb-8 font-medium">It looks like this mission was aborted. Head back to the shop to gear up.</p>
          <button 
            onClick={() => navigate('/products')}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-xl font-black italic uppercase tracking-widest transition shadow-xl shadow-red-900/20 active:scale-95"
          >
            Return to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pt-28 pb-20 px-4 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Step Indicator - All Complete Style */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center gap-3 md:gap-6">
            {["Cart", "Shipping", "Payment", "Confirm"].map((label, index) => (
              <React.Fragment key={label}>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black bg-red-600 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)] rotate-3">
                    <CheckCircle size={18} />
                  </div>
                  <span className="text-[10px] mt-3 font-black uppercase tracking-widest text-red-500">
                    {label}
                  </span>
                </div>
                {index < 3 && <div className="h-[2px] w-6 md:w-12 bg-red-600/50 mt-[-18px]" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Success Hero Card */}
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 md:p-12 text-center backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-600 to-transparent"></div>
              <div className="w-24 h-24 bg-green-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-green-500/20 rotate-6 shadow-[0_0_40px_rgba(34,197,94,0.1)]">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              <h1 className="text-4xl md:text-6xl font-black italic uppercase tracking-tighter mb-4">
                Order <span className="text-red-600">Success</span>
              </h1>
              <p className="text-gray-400 font-medium max-w-md mx-auto mb-10 leading-relaxed">
                Mission accomplished. Your professional gear is being prepped for dispatch. A confirmation has been sent to your email.
              </p>
              
              <button 
                onClick={handleDownloadInvoice}
                disabled={isGenerating}
                className="w-full bg-transparent hover:bg-white/5 text-gray-400 hover:text-white font-black italic uppercase tracking-[0.2em] py-4 rounded-2xl transition-all border border-dashed border-white/10 flex items-center justify-center gap-3 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isGenerating ? (
                  <div className="w-5 h-5 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <ReceiptText size={18} className="text-red-600" />
                )}
                {isGenerating ? "Processing Armory..." : "View & Download Invoice"}
              </button>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-8">
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 flex items-center justify-center gap-2">
                    <ReceiptText size={12} /> Order ID
                  </p>
                  <p className="font-black italic text-lg text-white">#{order.orderId || order.id}</p>
                </div>
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 flex items-center justify-center gap-2">
                    <Calendar size={12} /> Status
                  </p>
                  <p className="font-black italic text-lg text-green-500 uppercase">Confirmed</p>
                </div>
                <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1 flex items-center justify-center gap-2">
                    <Truck size={12} /> Delivery
                  </p>
                  <p className="font-black italic text-lg text-white">3-5 Days</p>
                </div>
              </div>
            </div>

            {/* Item Manifest */}
            <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8">
              <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-8 flex items-center gap-3">
                <ShoppingBag className="text-red-600" />
                Order <span className="text-red-600">Manifest</span>
              </h2>
              <div className="space-y-4">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex items-center gap-6 p-4 bg-black/40 rounded-2xl border border-white/5 group hover:border-red-500/30 transition-all duration-300">
                    <div className="w-20 h-20 bg-gray-900 rounded-xl overflow-hidden flex-shrink-0 border border-white/5">
                      <img 
                        src={item.image || "https://via.placeholder.com/100"} 
                        alt={item.name} 
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-black uppercase tracking-tight text-white">{item.name}</p>
                      <p className="text-xs text-gray-500 font-bold uppercase mt-1 tracking-widest">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-black italic text-white">₹{(item.price * item.quantity).toFixed(0)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Logistics & Summary Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 backdrop-blur-xl sticky top-28">
              <h2 className="text-xl font-black italic uppercase tracking-tighter mb-6 border-b border-white/5 pb-4 text-red-600">Final Summary</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-gray-400 font-bold uppercase tracking-tighter text-[10px]">
                  <span>Subtotal</span>
                  <span className="text-white italic font-medium">₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-bold uppercase tracking-tighter text-[10px]">
                  <span>GST (8%)</span>
                  <span className="text-white italic font-medium">₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400 font-bold uppercase tracking-tighter text-[10px]">
                  <span>Logistics</span>
                  <span className="text-green-500 italic font-medium">FREE</span>
                </div>
                <div className="flex justify-between items-end pt-4 border-t border-white/5">
                  <span className="text-[10px] font-black uppercase tracking-widest text-red-600">Total Charged</span>
                  <span className="text-4xl font-black italic text-white tracking-tighter">₹{total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <button 
                  onClick={() => navigate('/products')}
                  className="w-full bg-red-600 hover:bg-red-700 text-white font-black italic uppercase tracking-[0.2em] py-5 rounded-2xl transition-all shadow-xl shadow-red-900/20 active:scale-95 flex items-center justify-center gap-3"
                >
                  Continue Shopping <ArrowRight size={18} />
                </button>
                <button 
                  onClick={() => navigate('/orders')}
                  className="w-full bg-white/5 hover:bg-white/10 text-white font-black italic uppercase tracking-[0.2em] py-5 rounded-2xl transition-all border border-white/10 flex items-center justify-center gap-3"
                >
                  View My Orders
                </button>
              </div>

              {order.shippingAddress && (
                <div className="mt-8 pt-6 border-t border-white/5">
                  <div className="flex items-center gap-2 mb-3 text-gray-500">
                    <MapPin size={14} className="text-red-500" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Shipping Destination</span>
                  </div>
                  <p className="text-[11px] text-gray-400 font-medium leading-relaxed uppercase tracking-tighter">
                    {order.shippingAddress.ReceiverName}<br />
                    {order.shippingAddress.ShippingAddress}<br />
                    {order.shippingAddress.City}, {order.shippingAddress.PinNumber}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* PDF PREVIEW MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          
          <div className="relative w-full max-w-5xl h-[90vh] bg-[#111] border border-white/10 rounded-[2rem] overflow-hidden flex flex-col shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-3">
                <ReceiptText className="text-red-600" />
                <h3 className="font-black italic uppercase tracking-tighter text-xl">
                  Invoice <span className="text-red-600">Manifest</span>
                </h3>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={triggerDownload}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-xl font-black italic uppercase tracking-widest text-xs transition-all flex items-center gap-2"
                >
                  <Download size={16} /> Save PDF
                </button>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-gray-500 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            {/* PDF Content */}
            <div className="flex-1 bg-white/5 p-4">
              <iframe 
                src={pdfUrl} 
                className="w-full h-full rounded-xl border-none shadow-inner bg-white"
                title="Invoice Preview"
              ></iframe>
            </div>
          </div>
        </div>
      )}

      <style jsx="true">{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}

export default ConfirmationPage;