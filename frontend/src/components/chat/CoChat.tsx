import React, { useState, useRef, useEffect } from 'react';
import { useCopilotChat, useCopilotContext } from "@copilotkit/react-core";
import { useCopilotChatSuggestions } from "@copilotkit/react-ui";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { useAuth } from '@/hooks/use-auth';

function CustomChatInterface({ user }: { user: any }) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const { setChatInstructions } = useCopilotContext();


  useEffect(() => {
    setChatInstructions("You are assisting the user as best as you can. Answer in the best way possible given the data you have.");
  }, [setChatInstructions]);

  const {
    visibleMessages,
    appendMessage,
    deleteMessage,
    reloadMessages,
    stopGeneration,
    isLoading,
  } = useCopilotChat({
    id: user.email

  });

  const lastMessage = visibleMessages[visibleMessages.length - 1];
  const suggestions = useCopilotChatSuggestions(
    {
      instructions: "Suggest the most relevant next actions or responses based on the conversation context.",
      minSuggestions: 1,
      maxSuggestions: 2,
    },
    [lastMessage]
  );

  const sendMessage = async (content) => {

    const trimmedContent = content.trim();
    if (!trimmedContent || isLoading) return;

    try {
      await appendMessage(new TextMessage({ content: trimmedContent, role: Role.User }));
      setInputValue('');
      inputRef.current?.focus();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage(inputValue);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [visibleMessages]);

  const handleDeleteMessage = async (messageId) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error('Error deleting message:', error);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-3xl mx-auto p-4 bg-emerald-50">
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 scrollbar-thin scrollbar-thumb-emerald-200">
        {visibleMessages.map((message, index) => (
          <div
            key={`${message.id || index}-${message.content}`}
            className={`p-4 rounded-lg shadow-sm ${message.role === Role.User
              ? 'bg-emerald-100 ml-auto max-w-[80%] border border-emerald-200'
              : 'bg-white mr-auto max-w-[80%] border border-emerald-100'
              }`}
          >
            <p className="text-sm font-semibold mb-1 text-emerald-800">
              {message.role === Role.User ? 'You' : 'Assistant'}
            </p>
            <p className="text-gray-800 whitespace-pre-wrap break-words">
              {message.content}
            </p>
            <button
              onClick={() => handleDeleteMessage(message.id)}
              className="text-xs text-emerald-600 hover:text-red-500 mt-2 transition-colors duration-200"
              aria-label="Delete message"
            >
              Delete
            </button>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {suggestions !== null && suggestions !== undefined ? (
        <div className="mb-4 space-y-2">
          <p className="text-sm text-emerald-600">Suggested responses:</p>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => sendMessage(suggestion)}
                className="px-3 py-2 bg-white border border-emerald-200 hover:bg-emerald-50 rounded-full text-sm text-emerald-700 transition-colors duration-200"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      ) : null}

      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type a message..."
          className="flex-1 p-2 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white disabled:bg-emerald-50 disabled:cursor-not-allowed"
          disabled={isLoading}
          aria-label="Message input"
        />
        <button
          onClick={() => sendMessage(inputValue)}
          disabled={isLoading || !inputValue.trim()}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed transition-colors duration-200"
          aria-label="Send message"
        >
          Send
        </button>
        {isLoading && (
          <button
            onClick={stopGeneration}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
            aria-label="Stop generation"
          >
            Stop
          </button>
        )}
        <button
          onClick={reloadMessages}
          className="px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors duration-200"
          aria-label="Reload messages"
        >
          Reload
        </button>
      </div>
    </div>
  );
};

export default CustomChatInterface;