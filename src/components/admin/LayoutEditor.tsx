import { Move, RotateCcw, Trash2 } from 'lucide-react';
import { useContent } from '../../context/ContentContext';

/**
 * Admin editor for the Layout / Move section. Lets the user toggle Move Mode
 * (drag outlined elements on the page), view saved positions, reset them, or
 * delete individual element offsets.
 */
export default function LayoutEditor() {
  const { editMode, setEditMode, positions, resetPositions, removePosition } = useContent();
  const ids = Object.keys(positions);

  return (
    <div className="space-y-5">
      {/* Move Mode toggle card */}
      <div className={`border p-5 transition-colors ${editMode ? 'border-ink bg-ink/[0.03]' : 'border-hairline bg-offwhite/60'}`}>
        <div className="flex items-start gap-4">
          <span className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 transition-colors ${editMode ? 'bg-ink text-white' : 'bg-white border border-hairline text-charcoal'}`}>
            <Move size={17} strokeWidth={1.5} />
          </span>
          <div className="flex-1">
            <h3 className="font-serif text-lg text-ink leading-tight">Move Mode</h3>
            <p className="text-sm text-charcoal mt-1 leading-relaxed font-light">
              When enabled, every text, button, and media element on the site gets a dashed outline.
              Drag any outlined element to reposition it — positions save automatically.
            </p>
            <button
              onClick={() => setEditMode(!editMode)}
              className={`mt-4 text-xs px-4 py-2 transition-colors ${
                editMode
                  ? 'bg-ink text-white'
                  : 'border border-ink text-ink hover:bg-ink hover:text-white'
              }`}
            >
              {editMode ? 'Move Mode is On — click to exit' : 'Enable Move Mode'}
            </button>
          </div>
        </div>
      </div>

      {/* Saved positions */}
      <div className="border border-hairline bg-offwhite/60 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-[0.65rem] font-semibold tracking-[0.18em] uppercase text-charcoal">
            Saved Positions
          </h3>
          {ids.length > 0 && (
            <button
              onClick={resetPositions}
              className="flex items-center gap-1.5 text-xs text-charcoal hover:text-ink transition-colors"
            >
              <RotateCcw size={12} strokeWidth={1.5} />
              Reset All
            </button>
          )}
        </div>

        {ids.length === 0 ? (
          <p className="text-sm text-charcoal/70 font-light py-2">
            No elements have been moved yet. Enable Move Mode and drag something to begin.
          </p>
        ) : (
          <ul className="space-y-2">
            {ids.map((id) => (
              <li key={id} className="flex items-center justify-between bg-white border border-hairline px-3 py-2">
                <span className="text-xs text-ink font-mono truncate max-w-[60%]">{id}</span>
                <span className="flex items-center gap-3">
                  <span className="text-xs text-charcoal tabular-nums">
                    {Math.round(positions[id].x)}, {Math.round(positions[id].y)}
                  </span>
                  <button
                    onClick={() => removePosition(id)}
                    className="text-charcoal hover:text-ink transition-colors"
                    aria-label={`Remove position for ${id}`}
                  >
                    <Trash2 size={13} strokeWidth={1.5} />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-[0.7rem] text-charcoal leading-relaxed">
        Tip: positions are relative offsets from each element's natural place in the layout. Reset
        returns everything to its original spot.
      </p>
    </div>
  );
}
