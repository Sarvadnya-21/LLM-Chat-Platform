function MessageBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <div className={isUser ? 'flex justify-end' : 'flex justify-start'}>
      <div
        className={[
          'max-w-[80%] rounded-2xl px-4 py-2 text-sm leading-relaxed whitespace-pre-wrap',
          isUser
            ? 'bg-purple-600 text-white'
            : 'bg-white/80 text-slate-800 ring-1 ring-slate-200',
        ].join(' ')}
      >
        {message.content}
      </div>
    </div>
  );
}

export default function MessageList({ messages }) {
  return (
    <div className="flex-1 overflow-y-auto p-4">
      <div className="mx-auto flex max-w-3xl flex-col gap-3">
        {messages.length === 0 ? (
          <div className="rounded-xl bg-white/70 p-4 text-sm text-slate-600 ring-1 ring-slate-200">
            Ask something to start chatting.
          </div>
        ) : null}

        {messages.map((m) => (
          <MessageBubble key={m.id} message={m} />
        ))}
      </div>
    </div>
  );
}

