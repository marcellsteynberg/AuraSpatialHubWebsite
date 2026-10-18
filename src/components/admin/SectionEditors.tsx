import { useContent } from '../../context/ContentContext';
import { AdminField, AdminGroup, AdminSelect, AdminListControls, AdminVideoSettings } from './AdminFields';
import { MediaPositionEditor } from './MediaPositionEditor';
import type {
  HeroContent,
  ServicesContent,
  ServiceItem,
  PortfolioContent,
  ProjectItem,
  AboutContent,
  WhyContent,
  WhyCard,
  TestimonialsContent,
  Testimonial,
  ContactContent,
} from '../../data/content';

const spanOptions = ['normal', 'tall', 'wide'] as const;
const iconOptions = ['Aperture', 'Zap', 'Box', 'Crown', 'Plane', 'Compass'] as const;

type EditorProps<T> = { section: keyof ReturnType<typeof useContent>['content']; data: T };

export function HeroEditor({ data }: EditorProps<HeroContent>) {
  const { updateSection } = useContent();
  const set = (patch: Partial<HeroContent>) => updateSection('hero', { ...data, ...patch });
  return (
    <div className="space-y-4">
      <AdminField label="Eyebrow" value={data.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      <AdminField label="Title" value={data.title} onChange={(v) => set({ title: v })} />
      <AdminField label="Subtitle" value={data.subtitle} onChange={(v) => set({ subtitle: v })} textarea />
      <div className="grid grid-cols-2 gap-3">
        <AdminField label="Primary CTA" value={data.primaryCta} onChange={(v) => set({ primaryCta: v })} />
        <AdminField label="Secondary CTA" value={data.secondaryCta} onChange={(v) => set({ secondaryCta: v })} />
      </div>
      <AdminField label="Video URL" value={data.video} onChange={(v) => set({ video: v })} />
      <AdminField label="Poster Image URL" value={data.poster} onChange={(v) => set({ poster: v })} />
      <MediaPositionEditor
        label="Background Video"
        value={data.mediaTransform}
        onChange={(t) => set({ mediaTransform: t })}
      />
      <AdminVideoSettings
        volume={data.audioVolume ?? 0.8}
        onVolumeChange={(audioVolume) => set({ audioVolume })}
      />
    </div>
  );
}

export function ServicesEditor({ data }: EditorProps<ServicesContent>) {
  const { updateSection } = useContent();
  const set = (patch: Partial<ServicesContent>) => updateSection('services', { ...data, ...patch });

  const updateItem = (i: number, patch: Partial<ServiceItem>) => {
    const items = data.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it));
    set({ items });
  };
  const moveItem = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= data.items.length) return;
    const items = [...data.items];
    [items[i], items[j]] = [items[j], items[i]];
    set({ items });
  };
  const removeItem = (i: number) => set({ items: data.items.filter((_, idx) => idx !== i) });
  const addItem = () =>
    set({
      items: [
        ...data.items,
        { id: `service-${Date.now()}`, title: 'New Service', description: '', stats: '', price: '', video: '', poster: '' },
      ],
    });

  return (
    <div className="space-y-4">
      <AdminField label="Eyebrow" value={data.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      <AdminField label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} textarea />
      <AdminField label="Intro" value={data.intro} onChange={(v) => set({ intro: v })} textarea />

      {data.items.map((item, i) => (
        <AdminGroup key={item.id} title={`Service ${i + 1}`}>
          <AdminField label="Title" value={item.title} onChange={(v) => updateItem(i, { title: v })} />
          <AdminField label="Description" value={item.description} onChange={(v) => updateItem(i, { description: v })} textarea />
          <AdminField label="Stats" value={item.stats} onChange={(v) => updateItem(i, { stats: v })} textarea />
          <AdminField label="Price" value={item.price} onChange={(v) => updateItem(i, { price: v })} />
          <AdminField label="Video URL" value={item.video} onChange={(v) => updateItem(i, { video: v })} />
          <AdminField label="Poster Image URL" value={item.poster} onChange={(v) => updateItem(i, { poster: v })} />
          <MediaPositionEditor
            label={`Service ${i + 1} Media`}
            value={item.mediaTransform}
            onChange={(t) => updateItem(i, { mediaTransform: t })}
          />
          <AdminVideoSettings
            volume={item.audioVolume ?? 0.8}
            onVolumeChange={(audioVolume) => updateItem(i, { audioVolume })}
          />
          <AdminListControls
            onAdd={addItem}
            onRemove={() => removeItem(i)}
            onMoveUp={() => moveItem(i, -1)}
            onMoveDown={() => moveItem(i, 1)}
            canUp={i > 0}
            canDown={i < data.items.length - 1}
          />
        </AdminGroup>
      ))}
    </div>
  );
}

export function PortfolioEditor({ data }: EditorProps<PortfolioContent>) {
  const { updateSection } = useContent();
  const set = (patch: Partial<PortfolioContent>) => updateSection('portfolio', { ...data, ...patch });

  const updateItem = (i: number, patch: Partial<ProjectItem>) => {
    const items = data.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it));
    set({ items });
  };
  const moveItem = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= data.items.length) return;
    const items = [...data.items];
    [items[i], items[j]] = [items[j], items[i]];
    set({ items });
  };
  const removeItem = (i: number) => set({ items: data.items.filter((_, idx) => idx !== i) });
  const addItem = () =>
    set({
      items: [
        ...data.items,
        { id: `p-${Date.now()}`, name: 'New Project', location: '', service: '', image: '', video: '', span: 'normal' },
      ],
    });

  return (
    <div className="space-y-4">
      <AdminField label="Eyebrow" value={data.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      <AdminField label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} textarea />

      {data.items.map((item, i) => (
        <AdminGroup key={item.id} title={`Project ${i + 1}`}>
          <AdminField label="Name" value={item.name} onChange={(v) => updateItem(i, { name: v })} />
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="Location" value={item.location} onChange={(v) => updateItem(i, { location: v })} />
            <AdminField label="Service" value={item.service} onChange={(v) => updateItem(i, { service: v })} />
          </div>
          <AdminField label="Image URL" value={item.image} onChange={(v) => updateItem(i, { image: v })} />
          <AdminField label="Video URL" value={item.video} onChange={(v) => updateItem(i, { video: v })} />
          <AdminSelect label="Grid Span" value={item.span} options={spanOptions} onChange={(v) => updateItem(i, { span: v as ProjectItem['span'] })} />
          <MediaPositionEditor
            label={`Project ${i + 1} Media`}
            value={item.mediaTransform}
            onChange={(t) => updateItem(i, { mediaTransform: t })}
          />
          <AdminVideoSettings
            volume={item.audioVolume ?? 0.8}
            onVolumeChange={(audioVolume) => updateItem(i, { audioVolume })}
          />
          <AdminListControls
            onAdd={addItem}
            onRemove={() => removeItem(i)}
            onMoveUp={() => moveItem(i, -1)}
            onMoveDown={() => moveItem(i, 1)}
            canUp={i > 0}
            canDown={i < data.items.length - 1}
          />
        </AdminGroup>
      ))}
    </div>
  );
}

export function AboutEditor({ data }: EditorProps<AboutContent>) {
  const { updateSection } = useContent();
  const set = (patch: Partial<AboutContent>) => updateSection('about', { ...data, ...patch });

  const updatePara = (i: number, v: string) => {
    const paragraphs = data.paragraphs.map((p, idx) => (idx === i ? v : p));
    set({ paragraphs });
  };
  const addPara = () => set({ paragraphs: [...data.paragraphs, ''] });
  const removePara = (i: number) => set({ paragraphs: data.paragraphs.filter((_, idx) => idx !== i) });

  const updateStat = (i: number, patch: Partial<AboutContent['stats'][number]>) => {
    const stats = data.stats.map((s, idx) => (idx === i ? { ...s, ...patch } : s));
    set({ stats });
  };
  const addStat = () => set({ stats: [...data.stats, { figure: '', label: '' }] });
  const removeStat = (i: number) => set({ stats: data.stats.filter((_, idx) => idx !== i) });

  return (
    <div className="space-y-4">
      <AdminField label="Eyebrow" value={data.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      <AdminField label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} textarea />
      <AdminField label="Image URL (poster)" value={data.image} onChange={(v) => set({ image: v })} />
      <AdminField label="Video URL" value={data.video} onChange={(v) => set({ video: v })} />
      <MediaPositionEditor
        label="About Media"
        value={data.mediaTransform}
        onChange={(t) => set({ mediaTransform: t })}
      />

      <AdminGroup title="Floating Stat Card">
        <AdminField label="Stat Figure" value={data.statFigure} onChange={(v) => set({ statFigure: v })} />
        <AdminField label="Stat Label" value={data.statLabel} onChange={(v) => set({ statLabel: v })} textarea />
      </AdminGroup>

      <AdminGroup title="Paragraphs">
        {data.paragraphs.map((p, i) => (
          <div key={i} className="space-y-2">
            <AdminField label={`Paragraph ${i + 1}`} value={p} onChange={(v) => updatePara(i, v)} textarea />
            <button
              type="button"
              onClick={() => removePara(i)}
              className="text-xs px-2 py-1 border border-hairline text-charcoal hover:bg-ink hover:text-white transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addPara}
          className="text-xs px-2 py-1 border border-hairline text-charcoal hover:bg-ink hover:text-white transition-colors"
        >
          + Add Paragraph
        </button>
      </AdminGroup>

      <AdminGroup title="Stats Row">
        {data.stats.map((s, i) => (
          <div key={i} className="grid grid-cols-2 gap-3">
            <AdminField label="Figure" value={s.figure} onChange={(v) => updateStat(i, { figure: v })} />
            <AdminField label="Label" value={s.label} onChange={(v) => updateStat(i, { label: v })} />
            <button
              type="button"
              onClick={() => removeStat(i)}
              className="col-span-2 text-xs px-2 py-1 border border-hairline text-charcoal hover:bg-ink hover:text-white transition-colors"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={addStat}
          className="text-xs px-2 py-1 border border-hairline text-charcoal hover:bg-ink hover:text-white transition-colors"
        >
          + Add Stat
        </button>
      </AdminGroup>
    </div>
  );
}

export function WhyEditor({ data }: EditorProps<WhyContent>) {
  const { updateSection } = useContent();
  const set = (patch: Partial<WhyContent>) => updateSection('why', { ...data, ...patch });

  const updateItem = (i: number, patch: Partial<WhyCard>) => {
    const items = data.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it));
    set({ items });
  };
  const moveItem = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= data.items.length) return;
    const items = [...data.items];
    [items[i], items[j]] = [items[j], items[i]];
    set({ items });
  };
  const removeItem = (i: number) => set({ items: data.items.filter((_, idx) => idx !== i) });
  const addItem = () =>
    set({ items: [...data.items, { title: 'New Card', description: '', icon: 'Aperture' }] });

  return (
    <div className="space-y-4">
      <AdminField label="Eyebrow" value={data.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      <AdminField label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} textarea />

      {data.items.map((item, i) => (
        <AdminGroup key={i} title={`Card ${i + 1}`}>
          <AdminField label="Title" value={item.title} onChange={(v) => updateItem(i, { title: v })} />
          <AdminField label="Description" value={item.description} onChange={(v) => updateItem(i, { description: v })} textarea />
          <AdminSelect label="Icon" value={item.icon} options={iconOptions} onChange={(v) => updateItem(i, { icon: v })} />
          <AdminListControls
            onAdd={addItem}
            onRemove={() => removeItem(i)}
            onMoveUp={() => moveItem(i, -1)}
            onMoveDown={() => moveItem(i, 1)}
            canUp={i > 0}
            canDown={i < data.items.length - 1}
          />
        </AdminGroup>
      ))}
    </div>
  );
}

export function TestimonialsEditor({ data }: EditorProps<TestimonialsContent>) {
  const { updateSection } = useContent();
  const set = (patch: Partial<TestimonialsContent>) => updateSection('testimonials', { ...data, ...patch });

  const updateItem = (i: number, patch: Partial<Testimonial>) => {
    const items = data.items.map((it, idx) => (idx === i ? { ...it, ...patch } : it));
    set({ items });
  };
  const moveItem = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= data.items.length) return;
    const items = [...data.items];
    [items[i], items[j]] = [items[j], items[i]];
    set({ items });
  };
  const removeItem = (i: number) => set({ items: data.items.filter((_, idx) => idx !== i) });
  const addItem = () =>
    set({ items: [...data.items, { quote: '', name: '', title: '', location: '' }] });

  return (
    <div className="space-y-4">
      <AdminField label="Eyebrow" value={data.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      <AdminField label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} textarea />

      {data.items.map((item, i) => (
        <AdminGroup key={i} title={`Testimonial ${i + 1}`}>
          <AdminField label="Quote" value={item.quote} onChange={(v) => updateItem(i, { quote: v })} textarea />
          <AdminField label="Name" value={item.name} onChange={(v) => updateItem(i, { name: v })} />
          <div className="grid grid-cols-2 gap-3">
            <AdminField label="Title" value={item.title} onChange={(v) => updateItem(i, { title: v })} />
            <AdminField label="Location" value={item.location} onChange={(v) => updateItem(i, { location: v })} />
          </div>
          <AdminListControls
            onAdd={addItem}
            onRemove={() => removeItem(i)}
            onMoveUp={() => moveItem(i, -1)}
            onMoveDown={() => moveItem(i, 1)}
            canUp={i > 0}
            canDown={i < data.items.length - 1}
          />
        </AdminGroup>
      ))}
    </div>
  );
}

export function ContactEditor({ data }: EditorProps<ContactContent>) {
  const { updateSection } = useContent();
  const set = (patch: Partial<ContactContent>) => updateSection('contact', { ...data, ...patch });
  return (
    <div className="space-y-4">
      <AdminField label="Eyebrow" value={data.eyebrow} onChange={(v) => set({ eyebrow: v })} />
      <AdminField label="Heading" value={data.heading} onChange={(v) => set({ heading: v })} textarea />
      <AdminField label="Description" value={data.description} onChange={(v) => set({ description: v })} textarea />
      <AdminField label="Email" value={data.email} onChange={(v) => set({ email: v })} />
      <AdminField label="Phone (primary)" value={data.phone} onChange={(v) => set({ phone: v })} />
      <AdminField label="Phone (secondary)" value={data.phone2} onChange={(v) => set({ phone2: v })} />
      <AdminField label="Instagram URL" value={data.instagram} onChange={(v) => set({ instagram: v })} />
      <AdminField label="TikTok URL" value={data.tiktok} onChange={(v) => set({ tiktok: v })} />
    </div>
  );
}
