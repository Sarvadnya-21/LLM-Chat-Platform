import { useState } from 'react';

export default function ChatInput({ disabled, onSend }) {
  const [value, setValue] = useState('');

  function submit() {
    const content = value.trim();
    if (!content) return;
    onSend(content);
    setValue('');
  }

  return (
    <div className="border-t border-slate-200 bg-white/70 p-3 backdrop-blur">
      <div className="mx-auto flex max-w-3xl items-end gap-2">
        <textarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type your message..."
          className="min-h-[44px] w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500/40"
          rows={1}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              submit();
            }
          }}
          disabled={disabled}
        />
        <button
          className="rounded-xl bg-purple-600 px-4 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
          onClick={submit}
          disabled={disabled}
        >
          Send
        </button>
      </div>
    </div>
  );
}

