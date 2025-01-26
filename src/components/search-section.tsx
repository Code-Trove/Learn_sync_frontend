import { useEffect, useState } from "react";
import { SearchResult } from "@/types";

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
  const [resetFlag, setResetFlag] = useState<boolean>(false); // Track reset state
  const [sidebarVisible, setSidebarVisible] = useState<boolean>(false); // Control sidebar visibility

  // Update conversation when new results arrive
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
          setImageLink(results.link || "");
        }

        return updated;
      });

      // Show sidebar content if results contain a link
      if (results.link && !sidebarVisible) {
        setSidebarVisible(true);
      }
    }
  }, [results]);

  const handleKeyDown = async (
    event: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (event.key === "Enter" && query.trim()) {
      const trimmedQuery = query.trim();
      setQuery("");

      // Add user query and placeholder response
      setConversation((prev) => [
        ...prev,
        { query: trimmedQuery, response: "Loading..." },
      ]);

      try {
        // Pass resetFlag to onSearch and toggle it back to false after first query
        await onSearch(trimmedQuery, resetFlag);
        if (resetFlag) {
          setResetFlag(false); // Reset after the first query in the new conversation
        }
      } catch (error) {
        // Handle errors and update the response in the conversation
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
    setConversation([]); // Clear the current conversation
    setQuery(""); // Reset the query input
    setResetFlag(true); // Set reset flag to true for the next query
    setSidebarVisible(false); // Hide sidebar content
    try {
      await onSearch("", true); // Pass reset flag as true
    } catch (error) {
      console.error("Error resetting conversation:", error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Chat Section */}
      <div className="flex-1 flex flex-col items-center justify-between p-6 bg-white shadow-lg relative">
        <div className="w-full max-w-3xl">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-2xl font-bold text-gray-800">ChatBot</h1>
            <button
              onClick={handleResetConversation}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              disabled={loading}
            >
              End Conversation
            </button>
          </div>
          <div className="bg-gray-200 p-4 rounded-md h-96 overflow-y-auto shadow-inner">
            {conversation.map((entry, idx) => (
              <div key={idx} className="mb-6 animate-fadeIn">
                <div className="font-semibold text-blue-600">You:</div>
                <div className="bg-blue-100 text-blue-900 p-3 rounded-lg mt-1">
                  {entry.query}
                </div>
                <div className="font-semibold text-gray-800 mt-3">Bot:</div>
                <div className="bg-gray-100 text-gray-900 p-3 rounded-lg mt-1">
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
            ))}
            {loading && (
              <div className="text-gray-500 text-center mt-4 animate-pulse">
                Fetching response...
              </div>
            )}
          </div>
          <div className="mt-6 flex gap-2">
            <input
              type="text"
              placeholder="Type your question here and press Enter..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              aria-label="Type your question"
            />
          </div>
        </div>
      </div>

      {/* Sidebar Section */}
      {sidebarVisible && imageLink && (
        <div className="w-1/3 bg-gray-800 text-white p-6 shadow-lg animate-slideIn">
          <h2 className="text-lg font-bold mb-4">
            Content You might have saved
          </h2>
          <div className="flex justify-center">
            {/* Dynamically display the image from results.link */}
            <img
              src={imageLink}
              alt="Sidebar Content"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-in-out;
        }

        .animate-slideIn {
          animation: slideIn 0.5s ease-in-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
      `}</style>
    </div>
  );
}
