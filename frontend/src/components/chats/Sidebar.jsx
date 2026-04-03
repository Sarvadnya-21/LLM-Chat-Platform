import { useMemo } from 'react';

export default function Sidebar({
  chats,
  selectedChatId,
  onSelectChat,
  onNewChat,
}) {
  const items = useMemo(() => {
    return (chats || []).map((c) => ({
      id: c.id,
      title: c.title,
      createdAt: c.created_at,
    }));
  }, [chats]);

  return (
    <aside className="w-full border-r border-slate-200 bg-white/60 p-3 backdrop-blur md:w-80">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold text-slate-800">Chats</h2>
        <button
          className="rounded-xl bg-purple-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-purple-700"
          onClick={onNewChat}
        >
          New
        </button>
      </div>

      <div className="mt-3 flex flex-col gap-2 overflow-y-auto pr-1" style={{ maxHeight: 'calc(100svh - 120px)' }}>
        {items.length === 0 ? (
          <div className="rounded-xl bg-white p-3 text-xs text-slate-600 ring-1 ring-slate-200">
            No chats yet.
          </div>
        ) : null}

        {items.map((c) => {
          const isSelected = c.id === selectedChatId;
          const title = c.title || 'New chat';

          return (
            <button
              key={c.id}
              className={[
                'rounded-xl bg-white px-3 py-2 text-left text-xs ring-1 transition',
                isSelected
                  ? 'ring-purple-500/60'
                  : 'ring-slate-200 hover:ring-slate-300',
              ].join(' ')}
              onClick={() => onSelectChat(c.id)}
            >
              <div className="truncate font-medium text-slate-900">{title}</div>
              {c.createdAt ? (
                <div className="mt-1 text-[11px] text-slate-500">
                  {new Date(c.createdAt).toLocaleString()}
                </div>
              ) : null}
            </button>
          );
        })}
      </div>
    </aside>
  );
}

