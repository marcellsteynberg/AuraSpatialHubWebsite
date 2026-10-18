import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';
import {
  defaultContent,
  sectionKeys,
  type SiteContent,
  type SectionKey,
  type TypographyPresetId,
} from '../data/content';

type Position = { x: number; y: number };

type ContentContextValue = {
  content: SiteContent;
  loading: boolean;
  /** Update one section's content in React state AND persist to Supabase. */
  updateSection: <K extends SectionKey>(key: K, data: SiteContent[K]) => Promise<void>;
  /** Move Mode — when true, draggable elements can be repositioned. */
  editMode: boolean;
  setEditMode: (v: boolean) => void;
  /** Saved positions keyed by element id (pixels relative to natural position). */
  positions: Record<string, Position>;
  /** Live-drag a position (local state only, no DB write). */
  dragPosition: (id: string, pos: Position) => void;
  /** Persist a single element's final position to Supabase. */
  savePosition: (id: string, pos: Position) => Promise<void>;
  /** Clear all saved positions and persist empty layout. */
  resetPositions: () => Promise<void>;
  /** Remove one element's saved position and persist. */
  removePosition: (id: string) => void;
  /** Active typography preset id. */
  typographyPreset: TypographyPresetId;
  /** Change the typography preset and persist. */
  setTypographyPreset: (preset: TypographyPresetId) => void;
};

const ContentContext = createContext<ContentContextValue | null>(null);

/** Deep-merge defaults with loaded DB rows so new fields always have a value. */
function mergeContent(dbRows: Record<string, unknown>): SiteContent {
  const merged = structuredClone(defaultContent) as SiteContent;
  for (const key of sectionKeys) {
    const row = dbRows[key];
    if (row && typeof row === 'object') {
      merged[key] = { ...merged[key], ...(row as object) } as never;
    }
  }
  return merged;
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [positions, setPositions] = useState<Record<string, Position>>({});

  useEffect(() => {
    let active = true;
    (async () => {
      const { data, error } = await supabase.from('site_content').select('section, data');
      if (error || !active) {
        setLoading(false);
        return;
      }
      const rows: Record<string, unknown> = {};
      for (const row of data ?? []) {
        rows[row.section] = row.data;
      }
      if (active) {
        const merged = mergeContent(rows);
        setContent(merged);
        setPositions(merged.layout.positions ?? {});
        setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const updateSection = useCallback(
    async <K extends SectionKey>(key: K, data: SiteContent[K]) => {
      setContent((prev) => ({ ...prev, [key]: data }));
      const { error } = await supabase.from('site_content').upsert({ section: key, data }).eq('section', key);
      if (error) console.error('Write failed — are you signed in?', error);
    },
    [],
  );

  const dragPosition = useCallback((id: string, pos: Position) => {
    setPositions((prev) => ({ ...prev, [id]: pos }));
  }, []);

  const savePosition = useCallback(async (id: string, pos: Position) => {
    setPositions((prev) => {
      const next = { ...prev, [id]: pos };
      const layout = { positions: next };
      supabase.from('site_content').upsert({ section: 'layout', data: layout }).eq('section', 'layout');
      return next;
    });
  }, []);

  const resetPositions = useCallback(async () => {
    setPositions({});
    await supabase
      .from('site_content')
      .upsert({ section: 'layout', data: { positions: {} } })
      .eq('section', 'layout');
  }, []);

  const removePosition = useCallback((id: string) => {
    setPositions((prev) => {
      const next = { ...prev };
      delete next[id];
      supabase
        .from('site_content')
        .upsert({ section: 'layout', data: { positions: next } })
        .eq('section', 'layout');
      return next;
    });
  }, []);

  const setTypographyPreset = useCallback((preset: TypographyPresetId) => {
    setContent((prev) => ({ ...prev, typography: { preset } }));
    supabase
      .from('site_content')
      .upsert({ section: 'typography', data: { preset } })
      .eq('section', 'typography');
  }, []);

  return (
    <ContentContext.Provider
      value={{
        content,
        loading,
        updateSection,
        editMode,
        setEditMode,
        positions,
        dragPosition,
        savePosition,
        resetPositions,
        removePosition,
        typographyPreset: content.typography.preset,
        setTypographyPreset,
      }}
    >
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error('useContent must be used within ContentProvider');
  return ctx;
}
