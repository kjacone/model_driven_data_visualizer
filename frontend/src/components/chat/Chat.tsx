import { MessageSquare, Bot, User, Send } from 'lucide-react';
import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
 
function ChatPanel() {



  const {
    visibleMessages,
    appendMessage,
    setMessages,
    deleteMessage,
    reloadMessages,
    stopGeneration,
    isLoading,
  } = useCopilotChat();
 
  const sendMessage = (content: string) => {
    appendMessage(new TextMessage({ content, role: Role.User }));
  };










  const [chatMessages, setChatMessages] = useState([
    {
      type: "bot",
      content: "Hi! I'm your AI project helper! Tell me what you want to build, and I'll help break it down into simple steps. Try saying 'I want to build an online store' or click one of the suggestions below! 💡",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);


  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatMessages]);



  const suggestions = [
    "I want to build an online store",
    "I need a website for my business",
    "I want to create a blog",
    "I need a booking system",
    "Build me a community website",
    "Create a portfolio website",
  ];

  const generateRequirements = useCallback((message) => {
    let newRequirements = {
      purpose: [],
      features: [],
      technical: {
        frontend: [],
        backend: [],
      },
    };

    if (message.toLowerCase().includes("store")) {
      newRequirements = {
        purpose: ["Online Store"],
        features: ["User Accounts", "Search Function"],
        technical: {
          frontend: ["Interactive Website"],
          backend: ["Advanced Features"],
        },
      };
    } else if (message.toLowerCase().includes("blog")) {
      newRequirements = {
        purpose: ["Blog"],
        features: ["Comments", "Newsletter", "Social Sharing"],
        technical: {
          frontend: ["Simple Website"],
          backend: ["Basic Storage"],
        },
      };
    } else if (message.toLowerCase().includes("booking")) {
      newRequirements = {
        purpose: ["Service Booking"],
        features: ["User Accounts", "Contact Forms"],
        technical: {
          frontend: ["Interactive Website"],
          backend: ["User Management"],
        },
      };
    }

    return newRequirements;
  }, []);

  const handleSendMessage = useCallback(() => {
    if (newMessage.trim()) {
      setChatMessages(prev => [...prev, { type: "user", content: newMessage }]);

      const requirements = generateRequirements(newMessage);

      setTimeout(() => {
        const botResponse = "I'll help you plan this! I've suggested some options below that would work well for your project. Feel free to adjust them! 👇";
        setChatMessages(prev => [...prev, { type: "bot", content: botResponse }]);
      }, 1000);

      setNewMessage("");
    }
  }, [newMessage, generateRequirements]);

  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-gray-800">
    <div className="p-4 border-b border-gray-700">
      <div className="flex items-center gap-2">
        <MessageSquare size={20} className="text-emerald-400" />
        <h2 className="text-xl font-semibold text-gray-100">AI Project Helper</h2>
      </div>
    </div>
  
    <div className="flex-1 ">
      <div className="h-[60vh] overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg, i) => (
          <div key={i} className={`flex gap-3 ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
            {msg.type === "bot" && <Bot size={24} className="text-emerald-400" />}
            <div className={`rounded-xl px-4 py-3 max-w-[80%] shadow-lg ${
              msg.type === "user"
                ? "bg-emerald-500/30 text-emerald-50"
                : "bg-gray-700/50 text-gray-50 backdrop-blur-sm"
            }`}>
              {msg.content}
            </div>
            {msg.type === "user" && <User size={24} className="text-emerald-400" />}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  
    <div className="p-4 border-t border-gray-700 bg-gray-900/50">
      <div className="mb-4 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <Badge
            key={suggestion}
            className="bg-emerald-500/20 text-emerald-200 border-emerald-500/30 cursor-pointer hover:bg-emerald-500/30 transition-colors duration-200"
            onClick={() => setNewMessage(suggestion)}
          >
            {suggestion}
          </Badge>
        ))}
      </div>
  
      <div className="flex gap-2">
        <Input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Tell me what you want to build..."
          className="bg-gray-700/50 border-gray-600/50 text-gray-100 focus:ring-emerald-500/50 focus:border-emerald-500/50"
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
        />
        <Button
          onClick={handleSendMessage}
          className="bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-emerald-500/20 transition-all duration-200"
        >
          <Send size={16} />
        </Button>
      </div>
    </div>
  </div>
  );
};

export default ChatPanel;