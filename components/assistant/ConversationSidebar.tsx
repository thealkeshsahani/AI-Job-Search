"use client";

import { useState } from "react";
import { Plus, MessageSquare, Trash2, Edit2, Check, X, Sparkles } from "lucide-react";

export interface ConversationItem {
  id: string;
  title: string;
  updatedAt: string;
  _count?: { messages: number };
}

interface ConversationSidebarProps {
  conversations: ConversationItem[];
  activeId: string | null;
  onSelectConversation: (id: string) => void;
  onNewChat: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelectConversation,
  onNewChat,
  onDeleteConversation,
  onRenameConversation,
}: ConversationSidebarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const handleStartRename = (conv: ConversationItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(conv.id);
    setEditTitle(conv.title);
  };

  const handleSaveRename = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between p-4 shrink-0 hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-4">
        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-2xl shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>New Chat</span>
        </button>

        {/* Conversations History List */}
        <div className="space-y-1">
          <div className="px-2 mb-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Recent Conversations
          </div>

          <div className="space-y-1 max-h-[65vh] overflow-y-auto pr-1">
            {conversations.length === 0 ? (
              <div className="text-xs text-slate-500 p-3 text-center italic">
                No saved conversations yet.
              </div>
            ) : (
              conversations.map((conv) => {
                const isActive = conv.id === activeId;
                const isEditing = conv.id === editingId;

                return (
                  <div
                    key={conv.id}
                    onClick={() => onSelectConversation(conv.id)}
                    className={`group flex items-center justify-between p-2.5 rounded-xl cursor-pointer text-xs font-medium transition-all ${
                      isActive
                        ? "bg-slate-800 text-white border border-slate-700 shadow-sm"
                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                    }`}
                  >
                    <div className="flex items-center space-x-2.5 min-w-0 flex-1">
                      <MessageSquare className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-blue-400" : "text-slate-500"}`} />

                      {isEditing ? (
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          className="bg-slate-950 text-white text-xs px-2 py-0.5 rounded border border-blue-500 w-full focus:outline-none"
                          autoFocus
                        />
                      ) : (
                        <span className="truncate">{conv.title}</span>
                      )}
                    </div>

                    {/* Rename & Delete Action Buttons */}
                    <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {isEditing ? (
                        <button
                          onClick={(e) => handleSaveRename(conv.id, e)}
                          className="p-1 text-emerald-400 hover:bg-slate-700 rounded"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      ) : (
                        <button
                          onClick={(e) => handleStartRename(conv, e)}
                          className="p-1 text-slate-400 hover:text-white rounded"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteConversation(conv.id);
                        }}
                        className="p-1 text-slate-400 hover:text-rose-400 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}
