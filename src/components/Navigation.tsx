import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { easeLux } from '../lib/animations';

const links = [
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Why Aura', href: '#why' },
  { label: 'Contact', href: '#contact' },
];

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Lock body scroll when the mobile menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const go = (href: string) => {
    setOpen(false);
    const el = document.querySelector(href);
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <motion.header
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: easeLux, delay: 0.2 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${
          scrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-hairline/80 py-4'
            : 'bg-transparent py-6'
        }`}
      >
        <nav className="container-lux flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="group flex items-center gap-3"
            aria-label="Aura Spatial Hub — home"
          >
            <span
              className={`block w-2 h-2 rounded-full transition-colors duration-500 ${
                scrolled ? 'bg-ink' : 'bg-white'
              }`}
            />
            <span
              className={`font-serif text-xl tracking-tight transition-colors duration-500 ${
                scrolled ? 'text-ink' : 'text-white'
              }`}
            >
              Aura<span className="font-light"> Spatial Hub</span>
            </span>
          </button>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-10">
            {links.map((l) => (
              <li key={l.href}>
                <button
                  onClick={() => go(l.href)}
                  className={`group relative text-xs tracking-[0.18em] uppercase font-medium transition-colors duration-500 ${
                    scrolled ? 'text-charcoal hover:text-ink' : 'text-white/80 hover:text-white'
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute left-0 -bottom-1.5 h-px w-0 transition-all duration-500 ease-lux group-hover:w-full ${
                      scrolled ? 'bg-ink' : 'bg-white'
                    }`}
                  />
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden md:block">
            <button
              onClick={() => go('#contact')}
              className={`btn-lux btn-lux-solid !py-3 !px-6 !text-[0.7rem] transition-colors duration-500 ${
                scrolled ? '' : '!border-white !bg-white !text-ink'
              }`}
            >
              Book Consultation
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 -mr-2"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
          >
            {open ? (
              <X className={scrolled || open ? 'text-ink' : 'text-white'} size={22} />
            ) : (
              <Menu className={scrolled ? 'text-ink' : 'text-white'} size={22} />
            )}
          </button>
        </nav>
      </motion.header>

      {/* Mobile overlay menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: easeLux }}
            className="fixed inset-0 z-40 bg-white md:hidden flex flex-col"
          >
            <div className="flex-1 flex flex-col justify-center px-8">
              {links.map((l, i) => (
                <motion.button
                  key={l.href}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: easeLux, delay: 0.1 + i * 0.08 }}
                  onClick={() => go(l.href)}
                  className="text-left py-5 border-b border-hairline font-serif text-4xl text-ink"
                >
                  {l.label}
                </motion.button>
              ))}
              <motion.button
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: easeLux, delay: 0.5 }}
                onClick={() => go('#contact')}
                className="btn-lux btn-lux-solid mt-12 self-start"
              >
                Book Consultation
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
