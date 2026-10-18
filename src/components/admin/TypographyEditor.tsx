import { Type } from 'lucide-react';
import { useContent } from '../../context/ContentContext';
import { typographyPresets } from '../../data/content';

/**
 * Admin editor for the Typography section. Lets the user pick a site-wide
 * text style preset; selection applies instantly via [data-typography] and
 * persists to Supabase.
 */
export default function TypographyEditor() {
  const { typographyPreset, setTypographyPreset } = useContent();

  return (
    <div className="space-y-5">
      <div className="border border-hairline bg-offwhite/60 p-5">
        <div className="flex items-center gap-3 mb-5">
          <span className="w-10 h-10 rounded-full bg-white border border-hairline flex items-center justify-center text-charcoal">
            <Type size={17} strokeWidth={1.5} />
          </span>
          <div>
            <h3 className="font-serif text-lg text-ink leading-tight">Text Style</h3>
            <p className="text-sm text-charcoal font-light leading-relaxed">
              Choose a typography preset for the whole site. Changes apply instantly.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          {typographyPresets.map((p) => {
            const active = p.id === typographyPreset;
            return (
              <button
                key={p.id}
                onClick={() => setTypographyPreset(p.id)}
                className={`text-left p-4 border transition-all duration-300 ${
                  active
                    ? 'border-ink bg-white shadow-[0_8px_24px_-12px_rgba(17,17,17,0.3)]'
                    : 'border-hairline bg-white/50 hover:border-charcoal hover:bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-3">
                  <span
                    className="text-lg leading-tight"
                    style={{
                      fontFamily:
                        p.id === 'modern'
                          ? '"Inter", sans-serif'
                          : p.id === 'classic'
                          ? '"Cormorant Garamond", serif'
                          : p.id === 'mono'
                          ? '"JetBrains Mono", monospace'
                          : '"Playfair Display", serif',
                      fontWeight: p.id === 'display' ? 900 : p.id === 'mono' ? 500 : 600,
                      letterSpacing: p.id === 'mono' ? '-0.04em' : '-0.02em',
                      textTransform: p.id === 'mono' ? 'uppercase' : 'none',
                    }}
                  >
                    {p.label}
                  </span>
                  {active && (
                    <span className="text-[0.6rem] tracking-[0.2em] uppercase text-ink font-semibold shrink-0">
                      Active
                    </span>
                  )}
                </div>
                <p className="text-xs text-charcoal font-light mt-1.5 leading-relaxed">
                  {p.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-[0.7rem] text-charcoal leading-relaxed">
        Presets override font family, weight, and letter-spacing for headings and body text across
        the entire site. Your content and layout are unaffected.
      </p>
    </div>
  );
}
