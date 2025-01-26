// app/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Navigation } from "@/components/navigation";
import { ChatBot } from "@/components/search-section";
import { KanbanBoard } from "@/components/kanban-board";
import { SearchResult, KanbanColumn } from "@/types";
import { Button } from "@/components/ui/button";

export default function HomePage() {
  const [results, setResults] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [cookies] = useCookies(["jwt"]);
  const [conversationId, setConversationId] = useState<string | null>(null);

  const columns: KanbanColumn[] = [
    {
      id: "1",
      title: "Unassigned",
      count: 2,
      items: [
        {
          id: "1",
          title: "This is a place to plan your content",
          description:
            "Save your Ideas before converting them into posts. Brainstorm, plan ahead, and refine!",
        },
      ],
    },
    {
      id: "2",
      title: "To Do",
      count: 0,
      items: [],
    },
    {
      id: "3",
      title: "In Progress",
      count: 1,
      items: [
        {
          id: "2",
          title: "Buffer",
          description: "Making you baby",
        },
      ],
    },
    {
      id: "4",
      title: "Done",
      count: 0,
      items: [],
    },
  ];
  const fetchResults = async (query: string, reset = false) => {
    // Allow reset to proceed even if query is empty
    if (!query.trim() && !reset) return;

    setLoading(true);

    try {
      const token = cookies.jwt;
      const response = await fetch(
        "http://localhost:3125/api/v1/chat-with-us",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query,
            conversationId: reset ? null : conversationId, // Clear ID if reset flag is true
            resetConversation: reset, // Include reset flag
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setResults(data);
        if (reset) {
          setConversationId(null); // Clear conversation ID on reset
        } else if (data.conversationId) {
          setConversationId(data.conversationId); // Update conversation ID
        }
      } else {
        throw new Error(data.message || "Search failed");
      }
    } catch (error) {
      console.error("Error fetching results:", error);
      setResults(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navigation />
      <main className="container mx-auto py-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Create</h1>
          <div className="flex items-center space-x-4">
            <Button variant="outline">Share Feedback</Button>
            <Button variant="outline">Tags</Button>
            <Button variant="outline">Board</Button>
            <Button variant="outline">Gallery</Button>
            <Button>New Idea</Button>
          </div>
        </div>
        <ChatBot onSearch={fetchResults} results={results} loading={loading} />
        <KanbanBoard initialColumns={columns} />
      </main>
    </div>
  );
}
