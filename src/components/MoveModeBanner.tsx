import { motion, AnimatePresence } from 'framer-motion';
import { Move, X, RotateCcw } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { easeLux } from '../lib/animations';

/**
 * Floating banner shown only while Move Mode is active. Lets the user exit
 * Move Mode or reset all positions without opening the admin panel.
 */
export default function MoveModeBanner() {
  const { editMode, setEditMode, resetPositions } = useContent();

  return (
    <AnimatePresence>
      {editMode && (
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          transition={{ duration: 0.5, ease: easeLux }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[85] flex items-center gap-4 bg-ink text-white px-5 py-3 shadow-2xl"
        >
          <span className="flex items-center gap-2.5 text-xs tracking-wide font-medium">
            <Move size={15} strokeWidth={1.5} className="animate-pulse" />
            Move Mode — drag any outlined element to reposition
          </span>
          <span className="w-px h-5 bg-white/20" />
          <button
            onClick={() => resetPositions()}
            className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
            title="Reset all positions"
          >
            <RotateCcw size={13} strokeWidth={1.5} />
            Reset
          </button>
          <button
            onClick={() => setEditMode(false)}
            className="flex items-center gap-1.5 text-xs text-white/70 hover:text-white transition-colors"
          >
            <X size={14} strokeWidth={1.5} />
            Exit
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
