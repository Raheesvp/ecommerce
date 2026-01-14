// import React, { useState } from "react";
// import { MessageSquare, Send, X, Bot } from "lucide-react";

// const ChatBot = () => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [messages, setMessages] = useState([{ text: "Hi! I'm your AI assistant. How can I help?", isBot: true }]);
//   const [input, setInput] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChat = async () => {
//     if (!input.trim()) return;

//     const userMessage = { text: input, isBot: false };
//     setMessages((prev) => [...prev, userMessage]);
//     setInput("");
//     setLoading(true);

//     try {
//       const response = await fetch("https://localhost:57401/api/AI/chat", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ prompt: input }),
//       });
//       const data = await response.json();
//       setMessages((prev) => [...prev, { text: data.reply, isBot: true }]);
//     } catch (error) {
//       console.error("AI Error:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="fixed bottom-6 right-6 z-[100]">
//       {/* Toggle Button */}
//       <button onClick={() => setIsOpen(!isOpen)} className="bg-blue-600 p-4 rounded-full text-white shadow-xl hover:bg-blue-500 transition-all">
//         {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
//       </button>

//       {/* Chat Window */}
//       {isOpen && (
//         <div className="absolute bottom-20 right-0 w-80 h-[450px] bg-gray-900 border border-gray-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
//           <div className="bg-blue-600 p-4 flex items-center gap-2">
//             <Bot className="text-white" size={20} />
//             <span className="text-white font-bold text-sm">Store AI</span>
//           </div>

//           <div className="flex-1 p-4 overflow-y-auto space-y-4">
//             {messages.map((m, i) => (
//               <div key={i} className={`flex ${m.isBot ? "justify-start" : "justify-end"}`}>
//                 <div className={`p-3 rounded-2xl text-xs max-w-[80%] shadow-md ${m.isBot ? "bg-gray-800 text-gray-200" : "bg-blue-600 text-white"}`}>
//                   {m.text}
//                 </div>
//               </div>
//             ))}
//             {loading && <div className="text-gray-500 text-[10px] animate-pulse">AI is thinking...</div>}
//           </div>

//           <div className="p-3 bg-gray-800/50 flex gap-2">
//             <input
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               onKeyPress={(e) => e.key === "Enter" && handleChat()}
//               placeholder="Ask me anything..."
//               className="flex-1 bg-gray-900 text-white text-xs p-3 rounded-xl outline-none border border-gray-700 focus:border-blue-500 transition-all"
//             />
//             <button onClick={handleChat} className="bg-blue-600 p-3 rounded-xl text-white hover:bg-blue-500">
//               <Send size={16} />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatBot;