import MessageList from '../components/chat/MessageList.jsx';
import ChatInput from '../components/chat/ChatInput.jsx';
import { useChatStore } from '../store/chatStore.js';
import AuthPanel from '../components/auth/AuthPanel.jsx';
import Sidebar from '../components/chats/Sidebar.jsx';
import { useAuthStore } from '../store/authStore';
import { useEffect } from 'react';

export default function ChatPage() {
  const user = useAuthStore((s) => s.user);
  const messages = useChatStore((s) => s.messages);
  const loading = useChatStore((s) => s.loading);
  const error = useChatStore((s) => s.error);
  const sendMessage = useChatStore((s) => s.sendMessage);
  const chats = useChatStore((s) => s.chats);
  const selectedChatId = useChatStore((s) => s.selectedChatId);
  const loadChats = useChatStore((s) => s.loadChats);
  const loadMessages = useChatStore((s) => s.loadMessages);
  const clearChat = useChatStore((s) => s.clearChat);

  useEffect(() => {
    if (!user) {
      clearChat();
      return;
    }
    loadChats();
  }, [user, loadChats, clearChat]);

  useEffect(() => {
    if (!user) return;
    if (!selectedChatId) return;
    // If we have no messages loaded yet, pull the history.
    if (messages.length === 0) {
      loadMessages(selectedChatId);
    }
  }, [user, selectedChatId, messages.length, loadMessages]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-indigo-50">
      <div className="mx-auto flex max-w-6xl flex-col md:flex-row md:gap-4">
        {user ? (
          <div className="md:block">
            <Sidebar
              chats={chats}
              selectedChatId={selectedChatId}
              onNewChat={() => {
                clearChat();
                // Also clear remote messages state.
                loadMessages(null);
              }}
              onSelectChat={(id) => {
                loadMessages(id);
              }}
            />
          </div>
        ) : null}

        <div className="flex flex-1 flex-col">
          <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/70 px-4 py-4 backdrop-blur">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-lg font-semibold text-slate-900">
                  AI Chat
                </h1>
                <p className="mt-1 text-xs text-slate-500">
                  Ollama-backed responses (Step 1 via `USE_MOCK_RESPONSE`)
                </p>
              </div>
              <div className="sm:pt-1">
                <AuthPanel />
              </div>
            </div>
          </header>

          <div className="flex flex-col">
            {error ? (
              <div className="px-4 pb-2 pt-3 text-sm text-red-600">
                {error}
              </div>
            ) : null}

            <MessageList messages={messages} />
          </div>

          <ChatInput disabled={loading} onSend={sendMessage} />
        </div>
      </div>
    </div>
  );
}

