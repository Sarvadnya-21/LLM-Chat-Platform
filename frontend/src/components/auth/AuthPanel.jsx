import { useEffect, useState } from 'react';
import { useAuthStore } from '../../store/authStore';

export default function AuthPanel() {
  const user = useAuthStore((s) => s.user);
  const loading = useAuthStore((s) => s.loading);
  const error = useAuthStore((s) => s.error);

  const signup = useAuthStore((s) => s.signup);
  const login = useAuthStore((s) => s.login);
  const logout = useAuthStore((s) => s.logout);
  const fetchMe = useAuthStore((s) => s.fetchMe);

  const [mode, setMode] = useState('login'); // login | signup
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    fetchMe();
  }, [fetchMe]);

  async function submit(e) {
    e.preventDefault();
    if (mode === 'signup') {
      await signup({ username, password });
    } else {
      await login({ username, password });
    }
  }

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <div className="text-xs text-slate-600">
          Signed in as <span className="font-medium">{user.username}</span>
        </div>
        <button
          className="rounded-xl bg-white/80 px-3 py-2 text-xs font-medium text-slate-800 ring-1 ring-slate-200 hover:bg-white disabled:opacity-60"
          onClick={logout}
          disabled={loading}
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl bg-white/70 p-3 ring-1 ring-slate-200">
      <form onSubmit={submit} className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className={[
              'flex-1 rounded-xl px-3 py-2 text-xs font-medium ring-1',
              mode === 'login'
                ? 'bg-purple-600 text-white ring-purple-600'
                : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50',
            ].join(' ')}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={[
              'flex-1 rounded-xl px-3 py-2 text-xs font-medium ring-1',
              mode === 'signup'
                ? 'bg-purple-600 text-white ring-purple-600'
                : 'bg-white text-slate-700 ring-slate-200 hover:bg-slate-50',
            ].join(' ')}
            onClick={() => setMode('signup')}
          >
            Sign up
          </button>
        </div>

        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-purple-500/40"
          autoComplete="username"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs outline-none focus:ring-2 focus:ring-purple-500/40"
          autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
        />

        {error ? <div className="text-xs text-red-600">{error}</div> : null}

        <button
          className="mt-1 rounded-xl bg-purple-600 px-4 py-2 text-xs font-medium text-white hover:bg-purple-700 disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {mode === 'signup' ? 'Create account' : 'Login'}
        </button>
      </form>
    </div>
  );
}

