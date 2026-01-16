import React, { useState, useEffect, useCallback } from "react";
import { orderService } from "../../Services/OrderService";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { 
  RotateCcw, Search, ExternalLink, AlertTriangle, 
  CheckCircle2, XCircle, Clock, Loader2, RefreshCw, 
  X, Package, ArrowRight, Layers, Boxes, Activity
} from "lucide-react";

const AdminReturns = () => {
  const [returns, setReturns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  
  // States for Return Intel display (Right Compartment)
  const [selectedReturn, setSelectedReturn] = useState(null);

  const fetchReturns = useCallback(async () => {
    try {
      setLoading(true);
      const response = await orderService.getAllReturns();
      const data = response.data || response;
      setReturns(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Failed to load return manifest");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReturns();
  }, [fetchReturns]);

  const handleReturnClick = (item) => {
    if (selectedReturn?.id === item.id) {
      setSelectedReturn(null);
      return;
    }
    setSelectedReturn(item);
  };

  const filteredReturns = returns.filter((item) =>
    item.orderId?.toString().includes(searchTerm) ||
    item.productName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status) => {
    const s = status ? status.toUpperCase() : "PENDING";
    switch (s) {
      case "PENDING": return "text-orange-600 bg-orange-50 border-orange-100";
      case "APPROVED": return "text-green-600 bg-green-50 border-green-100";
      case "REJECTED": return "text-red-600 bg-red-50 border-red-100";
      default: return "text-gray-600 bg-gray-50 border-gray-100";
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="animate-spin text-orange-600" size={48} />
      <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">Scanning Return Frequency...</p>
    </div>
  );

  return (
    <div className="space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* HEADER SECTION - Matched to Category Page */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 pb-6 border-b border-gray-200">
        <div>
          <div className="flex items-center space-x-2 text-orange-600 mb-2">
            <RotateCcw size={20} />
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Recovery Protocol</span>
          </div>
          <h2 className="text-4xl font-black italic uppercase tracking-tighter text-gray-900">
            Return <span className="text-orange-600">Product</span>
          </h2>
        </div>
        <button 
          onClick={fetchReturns} 
          className="p-3 bg-white border border-gray-200 rounded-2xl hover:text-orange-600 hover:border-orange-200 transition-all shadow-sm"
        >
          <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COMPARTMENT: Search & Manifest Table */}
        <div className={`${selectedReturn ? 'lg:col-span-7' : 'lg:col-span-12'} space-y-8 transition-all duration-500`}>
          
          <div className="bg-white rounded-[2.5rem] shadow-xl shadow-orange-900/5 border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex items-center relative">
              <Search className="absolute left-10 text-gray-400" size={18} />
              <input
                type="text" 
                placeholder="Search Incident ID or Product..."
                className="w-full pl-14 pr-6 py-3 bg-white border-none rounded-2xl focus:ring-2 focus:ring-orange-500 font-medium text-sm outline-none shadow-inner"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="overflow-x-auto max-h-[600px]">
              <table className="w-full text-left">
                <thead className="bg-white text-gray-400 text-[10px] font-black uppercase tracking-widest sticky top-0 border-b border-gray-50 z-10">
                  <tr>
                    <th className="px-8 py-4">INCIDENT ID</th>
                    <th className="px-8 py-4">PRODUCT DATA</th>
                    <th className="px-8 py-4 text-center">STATUS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {filteredReturns.map((item) => (
                    <tr 
                      key={item.id} 
                      className={`group transition-all cursor-pointer ${selectedReturn?.id === item.id ? 'bg-orange-50/50' : 'hover:bg-gray-50'}`}
                      onClick={() => handleReturnClick(item)}
                    >
                      <td className="px-8 py-6">
                        <span className={`font-bold tabular-nums ${selectedReturn?.id === item.id ? 'text-orange-700' : 'text-gray-800'}`}>
                          #{item.orderId}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-between">
                          <div className="flex flex-col">
                             <span className="font-bold uppercase italic tracking-tight text-gray-800 text-sm">
                                {item.productName || "Unknown Unit"}
                             </span>
                             <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">{item.reason}</span>
                          </div>
                          <ArrowRight size={16} className={`transition-all ${selectedReturn?.id === item.id ? 'translate-x-0 opacity-100 text-orange-500' : '-translate-x-4 opacity-0 text-gray-300 group-hover:translate-x-0 group-hover:opacity-100'}`} />
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getStatusStyle(item.status)}`}>
                            {item.status || "PENDING"}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {filteredReturns.length === 0 && (
                <div className="py-20 text-center text-gray-300">
                   <Package size={48} className="mx-auto mb-4 opacity-10" />
                   <p className="text-[10px] font-black uppercase tracking-widest">No Active Incidents Found</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT COMPARTMENT: Detailed Intel Preview */}
        {selectedReturn && (
          <div className="lg:col-span-5 space-y-4 animate-in slide-in-from-right duration-500">
            <div className="bg-white rounded-[2.5rem] shadow-2xl border border-orange-100 overflow-hidden flex flex-col h-full max-h-[750px]">
              <div className="p-8 bg-gray-900 text-white flex justify-between items-center relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                    <Activity size={80} />
                </div>
                <div className="relative z-10">
                  <h3 className="font-black italic uppercase text-2xl tracking-tighter">Return product</h3>
                  <p className="text-orange-400 text-[10px] font-black uppercase tracking-widest mt-1">Incident Report #{selectedReturn.orderId}</p>
                </div>
                <button onClick={() => setSelectedReturn(null)} className="p-2 hover:bg-gray-800 rounded-full transition-all relative z-10">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-gray-50/50">
                {/* Detail Section */}
                <div className="space-y-4">
                    <div>
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em]">Target Designation</label>
                        <h4 className="text-xl font-black text-gray-800 uppercase italic">{selectedReturn.productName}</h4>
                    </div>

                    <div className="p-5 bg-white border border-gray-100 rounded-3xl shadow-sm">
                        <label className="text-[9px] font-black text-orange-500 uppercase tracking-[0.2em] block mb-2">Field Analysis (Reason)</label>
                        <p className="text-sm font-bold text-gray-700 uppercase mb-4">{selectedReturn.reason}</p>
                        
                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">Detailed Description</label>
                        <p className="text-xs text-gray-500 italic leading-relaxed bg-gray-50 p-4 rounded-2xl border border-gray-100">
                            "{selectedReturn.description}"
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white p-4 rounded-2xl border border-gray-100">
                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Timestamp</label>
                            <span className="text-xs font-bold text-gray-700 tabular-nums">
                                {new Date(selectedReturn.requestedAt).toLocaleDateString()}
                            </span>
                        </div>
                        <div className="bg-white p-4 rounded-2xl border border-gray-100">
                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest block mb-1">Current Status</label>
                            <span className={`text-[9px] font-black uppercase ${getStatusStyle(selectedReturn.status).split(' ')[0]}`}>
                                {selectedReturn.status}
                            </span>
                        </div>
                    </div>
                </div>
              </div>

              <div className="p-6 bg-white border-t border-gray-100 grid grid-cols-2 gap-4">
                 <button className="py-4 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-red-50 hover:text-red-600 transition-all border border-transparent hover:border-red-100">
                    Reject Unit
                 </button>
                 <button className="py-4 bg-gray-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 transition-all shadow-lg">
                    Approve Return
                 </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminReturns;