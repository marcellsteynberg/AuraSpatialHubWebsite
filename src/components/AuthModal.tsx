import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Lock, Mail } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { easeLux } from '../lib/animations';

export default function AuthModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    const fn = mode === 'signin' ? signIn : signUp;
    const { error } = await fn(email.trim(), password);
    setBusy(false);
    if (error) {
      setError(error);
      return;
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: easeLux }}
            className="fixed inset-0 bg-black/40 z-[100]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.4, ease: easeLux }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-sm bg-white shadow-2xl"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-hairline">
              <h2 className="font-serif text-xl text-ink">
                {mode === 'signin' ? 'Owner Login' : 'Create Account'}
              </h2>
              <button
                onClick={onClose}
                className="p-2 text-charcoal hover:text-ink hover:bg-offwhite transition-colors"
                aria-label="Close"
              >
                <X size={18} strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="px-6 py-6 space-y-4">
              <div>
                <label className="block text-xs text-charcoal mb-1.5">Email</label>
                <div className="relative">
                  <Mail
                    size={15}
                    strokeWidth={1.5}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/50"
                  />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-hairline bg-offwhite text-ink text-sm focus:outline-none focus:border-ink transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-charcoal mb-1.5">Password</label>
                <div className="relative">
                  <Lock
                    size={15}
                    strokeWidth={1.5}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/50"
                  />
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-hairline bg-offwhite text-ink text-sm focus:outline-none focus:border-ink transition-colors"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {error && (
                <p className="text-xs text-red-600 leading-relaxed">{error}</p>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 bg-ink text-white text-sm hover:bg-charcoal disabled:opacity-40 transition-colors"
              >
                {busy
                  ? 'Please wait…'
                  : mode === 'signin'
                    ? 'Sign In'
                    : 'Create Account'}
              </button>

              <p className="text-center text-xs text-charcoal">
                {mode === 'signin' ? "Need an account? " : 'Already have an account? '}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'signin' ? 'signup' : 'signin');
                    setError(null);
                  }}
                  className="text-ink underline underline-offset-2 hover:text-charcoal"
                >
                  {mode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </p>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
