"use client";

import { useState } from "react";
import { KanbanColumn, KanbanItem } from "@/types";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";
import { CreateIdeaDialog } from "./create-idea-dialog";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { motion, AnimatePresence } from "framer-motion";

interface KanbanBoardProps {
  initialColumns: KanbanColumn[];
}

export function KanbanBoard({ initialColumns }: KanbanBoardProps) {
  const [columns, setColumns] = useState(initialColumns);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns.find((col) => col.id === source.droppableId);
      const destColumn = columns.find(
        (col) => col.id === destination.droppableId
      );
      const sourceItems = [...sourceColumn!.items];
      const destItems = [...destColumn!.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns(
        columns.map((col) => {
          if (col.id === source.droppableId) {
            return { ...col, items: sourceItems };
          }
          if (col.id === destination.droppableId) {
            return { ...col, items: destItems };
          }
          return col;
        })
      );
    } else {
      const column = columns.find((col) => col.id === source.droppableId);
      const copiedItems = [...column!.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns(
        columns.map((col) => {
          if (col.id === source.droppableId) {
            return { ...col, items: copiedItems };
          }
          return col;
        })
      );
    }
  };

  return (
    <>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 p-4 h-[calc(100vh-12rem)] overflow-x-auto">
          {columns.map((column) => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="flex-1 min-w-[300px] max-w-[300px] bg-gray-50 rounded-lg"
                >
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{column.title}</h3>
                        <span className="text-sm text-gray-500">
                          {column.items.length}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500"
                          onClick={() => setIsDialogOpen(true)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-gray-500"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <AnimatePresence>
                        {column.items.map((item, index) => (
                          <Draggable
                            key={item.id}
                            draggableId={item.id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className={`bg-white p-4 rounded-md shadow-sm ${
                                    snapshot.isDragging ? "shadow-lg" : ""
                                  }`}
                                >
                                  <h4 className="font-medium text-sm">
                                    {item.title}
                                  </h4>
                                  {item.description && (
                                    <p className="text-sm text-gray-500 mt-1">
                                      {item.description}
                                    </p>
                                  )}
                                </div>
                              </motion.div>
                            )}
                          </Draggable>
                        ))}
                      </AnimatePresence>
                      <Button
                        variant="ghost"
                        className="w-full justify-start text-gray-500 hover:text-gray-900"
                        onClick={() => setIsDialogOpen(true)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        New Idea
                      </Button>
                    </div>
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
          <div className="flex-1 min-w-[300px] max-w-[300px]">
            <Button
              variant="ghost"
              className="w-full h-full rounded-lg border-2 border-dashed border-gray-200 text-gray-500 hover:text-gray-900"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Group
            </Button>
          </div>
        </div>
      </DragDropContext>
      <CreateIdeaDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}
