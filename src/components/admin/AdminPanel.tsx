import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Eye, EyeOff, RotateCcw, Move } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { supabase } from '../../lib/supabase';
import {
  sectionKeys,
  sectionLabels,
  defaultContent,
  type SectionKey,
} from '../../data/content';
import { easeLux } from '../../lib/animations';
import {
  HeroEditor,
  ServicesEditor,
  PortfolioEditor,
  AboutEditor,
  WhyEditor,
  TestimonialsEditor,
  ContactEditor,
} from './SectionEditors';
import LayoutEditor from './LayoutEditor';
import TypographyEditor from './TypographyEditor';

export default function AdminPanel({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { content, editMode, setEditMode } = useContent();
  const [active, setActive] = useState<SectionKey>('hero');
  const [preview, setPreview] = useState(true);
  const [resetting, setResetting] = useState(false);

  // Lock body scroll while open.
  useEffect(() => {
    if (open) document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  // Esc closes.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const resetSection = async () => {
    setResetting(true);
    await supabase
      .from('site_content')
      .upsert({ section: active, data: defaultContent[active] })
      .eq('section', active);
    // Force a reload to re-fetch clean state from the DB.
    window.location.reload();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: easeLux }}
            className="fixed inset-0 bg-black/30 z-[90]"
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.6, ease: easeLux }}
            className="fixed top-0 right-0 bottom-0 z-[95] w-full sm:w-[480px] bg-offwhite border-l border-hairline flex flex-col"
            role="dialog"
            aria-label="Content editor"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-hairline bg-white">
              <div>
                <h2 className="font-serif text-xl text-ink leading-none">Content Editor</h2>
                <p className="text-xs text-charcoal mt-1.5">Edits save automatically and live-preview.</p>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-charcoal hover:text-ink hover:bg-offwhite transition-colors"
                aria-label="Close editor"
              >
                <X size={20} strokeWidth={1.5} />
              </button>
            </div>

            {/* Toolbar */}
            <div className="flex items-center gap-2 px-6 py-3 border-b border-hairline bg-white">
              <button
                onClick={() => setPreview((p) => !p)}
                className="flex items-center gap-2 text-xs px-3 py-1.5 border border-hairline text-charcoal hover:bg-ink hover:text-white transition-colors"
                title={preview ? 'Hide site preview while editing' : 'Show site behind panel'}
              >
                {preview ? <Eye size={13} strokeWidth={1.5} /> : <EyeOff size={13} strokeWidth={1.5} />}
                {preview ? 'Preview On' : 'Preview Off'}
              </button>
              <button
                onClick={() => {
                  setEditMode(!editMode);
                  onClose();
                }}
                className={`flex items-center gap-2 text-xs px-3 py-1.5 border transition-colors ${
                  editMode
                    ? 'bg-ink text-white border-ink'
                    : 'border-hairline text-charcoal hover:bg-ink hover:text-white'
                }`}
                title="Toggle Move Mode to drag elements on the page"
              >
                <Move size={13} strokeWidth={1.5} />
                {editMode ? 'Move Mode On' : 'Move Mode'}
              </button>
              <button
                onClick={resetSection}
                disabled={resetting}
                className="flex items-center gap-2 text-xs px-3 py-1.5 border border-hairline text-charcoal hover:bg-ink hover:text-white disabled:opacity-40 transition-colors ml-auto"
                title="Reset this section to defaults"
              >
                <RotateCcw size={13} strokeWidth={1.5} />
                Reset Section
              </button>
            </div>

            {/* Section tabs */}
            <div className="flex gap-1 px-6 py-3 border-b border-hairline overflow-x-auto scrollbar-hide">
              {sectionKeys.map((key) => (
                <button
                  key={key}
                  onClick={() => setActive(key)}
                  className={`text-xs whitespace-nowrap px-3 py-1.5 transition-colors ${
                    active === key
                      ? 'bg-ink text-white'
                      : 'text-charcoal hover:bg-hairline'
                  }`}
                >
                  {sectionLabels[key]}
                </button>
              ))}
            </div>

            {/* Editor body */}
            <div className="flex-1 overflow-y-auto px-6 py-6 space-y-5">
              {active === 'hero' && <HeroEditor section="hero" data={content.hero} />}
              {active === 'services' && <ServicesEditor section="services" data={content.services} />}
              {active === 'portfolio' && <PortfolioEditor section="portfolio" data={content.portfolio} />}
              {active === 'about' && <AboutEditor section="about" data={content.about} />}
              {active === 'why' && <WhyEditor section="why" data={content.why} />}
              {active === 'testimonials' && (
                <TestimonialsEditor section="testimonials" data={content.testimonials} />
              )}
              {active === 'contact' && <ContactEditor section="contact" data={content.contact} />}
              {active === 'layout' && <LayoutEditor />}
              {active === 'typography' && <TypographyEditor />}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-hairline bg-white">
              <p className="text-[0.7rem] text-charcoal leading-relaxed">
                All changes are saved to your database automatically. Toggle preview off to see the
                full site while editing.
              </p>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
