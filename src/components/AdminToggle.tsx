import { useState } from 'react';
import { Pencil, X, Lock, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminPanel from './admin/AdminPanel';
import { easeLux } from '../lib/animations';

const ADMIN_USERNAME = 'AuraSpatialHubAdmin';
const ADMIN_PASSWORD = 'AuraSpatialHubMD123!';

export default function AdminToggle() {
  const [open, setOpen] = useState(false);
  const [authed, setAuthed] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleEditClick = () => {
    if (authed) {
      setOpen(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAuthed(true);
      setShowLogin(false);
      setOpen(true);
      setUsername('');
      setPassword('');
      setError(null);
    } else {
      setError('Invalid username or password.');
    }
  };

  const closeLogin = () => {
    setShowLogin(false);
    setUsername('');
    setPassword('');
    setError(null);
  };

  const closePanel = () => {
    setOpen(false);
  };

  return (
    <>
      <div className="fixed bottom-6 left-6 z-[80]">
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1.8 }}
          onClick={handleEditClick}
          className="w-12 h-12 rounded-full bg-ink text-white shadow-lg flex items-center justify-center hover:scale-110 transition-transform duration-500 ease-lux"
          aria-label="Edit site content"
          title="Edit site content"
        >
          <Pencil size={16} strokeWidth={1.5} />
        </motion.button>
      </div>

      <AdminPanel open={open} onClose={closePanel} />

      <AnimatePresence>
        {showLogin && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3, ease: easeLux }}
              className="fixed inset-0 bg-black/40 z-[100]"
              onClick={closeLogin}
            />
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.96 }}
              transition={{ duration: 0.4, ease: easeLux }}
              className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[101] w-full max-w-sm bg-white shadow-2xl"
            >
              <div className="flex items-center justify-between px-6 py-5 border-b border-hairline">
                <h2 className="font-serif text-xl text-ink">Admin Login</h2>
                <button
                  onClick={closeLogin}
                  className="p-2 text-charcoal hover:text-ink hover:bg-offwhite transition-colors"
                  aria-label="Close"
                >
                  <X size={18} strokeWidth={1.5} />
                </button>
              </div>

              <form onSubmit={handleLogin} className="px-6 py-6 space-y-4">
                <div>
                  <label className="block text-xs text-charcoal mb-1.5">Username</label>
                  <div className="relative">
                    <User
                      size={15}
                      strokeWidth={1.5}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal/50"
                    />
                    <input
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-hairline bg-offwhite text-ink text-sm focus:outline-none focus:border-ink transition-colors"
                      placeholder="Username"
                      autoComplete="username"
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
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-9 pr-3 py-2.5 border border-hairline bg-offwhite text-ink text-sm focus:outline-none focus:border-ink transition-colors"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {error && (
                  <p className="text-xs text-red-600 leading-relaxed">{error}</p>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 bg-ink text-white text-sm hover:bg-charcoal transition-colors"
                >
                  Sign In
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
