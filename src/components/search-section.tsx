"use client";

import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { FiPaperclip, FiSend } from "react-icons/fi";
import { motion } from "framer-motion";
import type { SearchResult } from "@/types";
import Image from "next/image";

interface ChatBotProps {
  onSearch: (query: string, reset?: boolean) => Promise<void>;
  results: SearchResult | null;
  loading: boolean;
}

export function ChatBot({ onSearch, results, loading }: ChatBotProps) {
  const [query, setQuery] = useState<string>("");
  const [conversation, setConversation] = useState<
    { query: string; response: string; link?: string }[]
  >([]);
  const [imageLink, setImageLink] = useState<string>("");
  const [resetFlag, setResetFlag] = useState<boolean>(false);
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (results) {
      setConversation((prev) => {
        const updated = [...prev];
        const lastEntry = updated[updated.length - 1];

        if (lastEntry?.response === "Loading...") {
          updated[updated.length - 1] = {
            ...lastEntry,
            response: results.response || "No response available.",
            link: results.link || imageLink,
          };
        }
        if (results.link) {
          setImageLink(results.link);
        }

        return updated;
      });

      if (results.link && !sidebarVisible) {
        setSidebarVisible(true);
      }
    }
  }, [results, imageLink, sidebarVisible]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [conversation]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      const trimmedQuery = query.trim();
      setQuery("");

      setConversation((prev) => [
        ...prev,
        { query: trimmedQuery, response: "Loading..." },
      ]);

      try {
        await onSearch(trimmedQuery, resetFlag);
        if (resetFlag) {
          setResetFlag(false);
        }
      } catch (error: unknown) {
        console.error("Search error:", error);
        setConversation((prev) =>
          prev.map((entry, idx) =>
            idx === prev.length - 1
              ? {
                  ...entry,
                  response: "An error occurred. Please try again.",
                }
              : entry
          )
        );
      }
    }
  };

  const handleResetConversation = async () => {
    setConversation([]);
    setQuery("");
    setResetFlag(true);
    setSidebarVisible(false);
    try {
      await onSearch("", true);
    } catch (error) {
      console.error("Error resetting conversation:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const closeSidebar = () => {
    setSidebarVisible(false);
  };

  const handleViewMore = () => {
    console.log('View more clicked');
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="flex-1">
        <header className="bg-white border-b border-gray-200 p-4">
          <div className="max-w-4xl mx-auto flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">ChatBot</h1>
            <Button
              onClick={handleResetConversation}
              variant="destructive"
              disabled={loading}
            >
              New Chat
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-hidden bg-gray-100">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {conversation.length === 0 ? (
              <motion.div
                className="flex-1 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <form onSubmit={handleSubmit} className="w-full max-w-md p-4">
                  <textarea
                    placeholder="Type your message here..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="w-full p-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-32"
                  ></textarea>
                  <div className="flex items-center mt-4 space-x-2">
                    <label
                      htmlFor="file-upload"
                      className="flex items-center cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg shadow"
                    >
                      <FiPaperclip className="w-5 h-5 text-gray-600" />
                      <input type="file" id="file-upload" className="hidden" />
                    </label>
                    <Button
                      type="submit"
                      className="flex items-center space-x-2"
                    >
                      <FiSend className="w-5 h-5" />
                      <span>Send</span>
                    </Button>
                  </div>
                </form>
              </motion.div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {conversation.map((entry, idx) => (
                    <div key={idx} className="space-y-2">
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-gray-300 mr-2 flex-shrink-0" />
                        <div className="bg-white p-3 rounded-lg shadow max-w-[80%]">
                          {entry.query}
                        </div>
                      </div>
                      <div className="flex items-start">
                        <div className="w-8 h-8 rounded-full bg-green-500 mr-2 flex-shrink-0" />
                        <div className="bg-white p-3 rounded-lg shadow max-w-[80%]">
                          {entry.response}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSubmit} className="flex space-x-2">
                    <textarea
                      placeholder="Type your message here..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="flex-1 p-3 border border-gray-300 rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-12"
                    ></textarea>
                    <label
                      htmlFor="file-upload"
                      className="flex items-center cursor-pointer bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded-lg shadow"
                    >
                      <FiPaperclip className="w-5 h-5 text-gray-600" />
                      <input type="file" id="file-upload" className="hidden" />
                    </label>
                    <Button
                      type="submit"
                      className="flex items-center space-x-2"
                    >
                      <FiSend className="w-5 h-5" />
                      <span>Send</span>
                    </Button>
                  </form>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {sidebarVisible && imageLink && (
  <div 
    className="w-full md:w-1/3 bg-gradient-to-br from-gray-800 to-gray-700 text-white p-6 shadow-xl rounded-2xl border border-gray-600 transform transition-transform duration-300"
  >
    <button 
      onClick={closeSidebar} 
      className="absolute top-4 right-4 text-white hover:text-gray-400 text-xl"
      aria-label="Close Sidebar"
    >
      ✕
    </button>
    <h2 className="text-xl font-extrabold mb-4 underline decoration-dashed">
      Content You Might Have Saved
    </h2>
    <div className="flex justify-center gap-4">
      {imageLink ? (
        <Image
          src={imageLink}
          alt="Sidebar Content"
          className="w-full h-auto rounded-lg hover:shadow-xl"
          width={200}
          height={200}
        />
      ) : (
        <div className="w-40 h-40 bg-gray-600 animate-pulse rounded-lg"></div>
      )}
    </div>
    <button 
      className="mt-4 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
      onClick={handleViewMore}
    >
      View Details
    </button>
  </div>
)}

    </div>
  );
}
