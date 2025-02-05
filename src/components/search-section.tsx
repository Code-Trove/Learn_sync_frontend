"use client";

import { useEffect, useState, useRef } from "react";
import type { SearchResult } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

        <main className="flex-1 overflow-hidden">
          <div className="max-w-4xl mx-auto h-full flex flex-col">
            {conversation.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <form onSubmit={handleSubmit} className="w-full max-w-md">
                  <Input
                    type="text"
                    placeholder="Type your message here..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="w-full"
                  />
                </form>
              </div>
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
                          {entry.link && (
                            <a
                              href={entry.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline block mt-2"
                            >
                              Learn More
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <div className="p-4 border-t border-gray-200">
                  <form onSubmit={handleSubmit} className="flex space-x-2">
                    <Input
                      type="text"
                      placeholder="Type your message here..."
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      className="flex-1"
                    />
                    <Button type="submit" disabled={loading}>
                      Send
                    </Button>
                  </form>
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {sidebarVisible && imageLink && (
        <div className="w-1/3 bg-gray-800 text-white p-6 shadow-lg">
          <h2 className="text-lg font-bold mb-4">
            Content You might have saved
          </h2>
          <div className="flex justify-center">
            <Image
              src={imageLink}
              alt="Sidebar Content"
              className="w-full h-auto rounded-lg"
              width={200}
              height={200}
            />
          </div>
        </div>
      )}
    </div>
  );
}
