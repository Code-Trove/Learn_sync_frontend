"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Wand2 } from "lucide-react";

interface CreateIdeaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateIdeaDialog({
  open,
  onOpenChange,
}: CreateIdeaDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Create Idea</DialogTitle>
            <div className="flex gap-2">
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="To Do" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              <Select>
                <SelectTrigger className="w-[100px]">
                  <SelectValue placeholder="Add Tags" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="important">Important</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                  <SelectItem value="later">Later</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input placeholder="Give your idea a title" className="text-lg" />
          <div className="relative">
            <Textarea
              placeholder="Oh! I just thought of something..."
              className="min-h-[200px] resize-none"
            />
            <Button
              variant="outline"
              size="sm"
              className="absolute top-2 right-2 gap-2"
            >
              <Wand2 className="h-4 w-4" />
              Use the AI Assistant
            </Button>
          </div>
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
              <svg
                className="h-10 w-10 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">
                Drag & drop or{" "}
                <span className="text-blue-500">select a file</span>
              </p>
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon">
              <Wand2 className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <span className="h-4 w-4">⏱️</span>
            </Button>
            <Button variant="outline" size="icon">
              <span className="h-4 w-4">AI</span>
            </Button>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">Create Post</Button>
            <Button>Save Idea</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
