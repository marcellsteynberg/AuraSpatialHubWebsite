import { Mail, Phone } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const columns = [
  {
    title: 'Services',
    links: ['Floorplans', '360 Walkthroughs', 'Virtual Staging', 'Fixer Upper Vision', 'Cinematic Videos'],
  },
  {
    title: 'Studio',
    links: ['About', 'Why Aura', 'Testimonials', 'Contact'],
  },
];

export default function Footer() {
  const { content } = useContent();
  const c = content.contact;

  const go = (href: string) => {
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-bg border-t border-hairline">
      <div className="container-lux pt-20 md:pt-28 pb-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-16">
          {/* Brand */}
          <div className="md:col-span-5">
            <div className="flex items-center gap-3 mb-6">
              <span className="block w-2 h-2 rounded-full bg-ink" />
              <span className="font-serif text-2xl text-ink">
                Aura<span className="font-light"> Spatial Hub</span>
              </span>
            </div>
            <p className="text-charcoal text-base leading-relaxed font-light max-w-sm">
              Firm-level architectural precision for luxury real estate. Floorplans, walkthroughs,
              staging, and cinema — crafted to the standard of the address.
            </p>

            <div className="flex items-center gap-4 mt-8">
              {[
                { Icon: Mail, href: `mailto:${c.email}`, label: 'Email' },
                { Icon: Phone, href: `https://wa.me/27${c.phone.replace(/^0/, '')}`, label: 'Phone' },
              ].map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-10 h-10 border border-hairline flex items-center justify-center text-charcoal hover:bg-ink hover:text-white hover:border-ink transition-all duration-500 ease-lux"
                >
                  <Icon size={16} strokeWidth={1.5} />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h4 className="eyebrow mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => {
                  const anchor = link === 'About' ? '#about'
                    : link === 'Why Aura' ? '#why'
                    : link === 'Contact' ? '#contact'
                    : '#services';
                  return (
                    <li key={link}>
                      <button
                        onClick={() => go(anchor)}
                        className="text-charcoal text-sm font-light hover:text-ink transition-colors duration-300"
                      >
                        {link}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* Contact */}
          <div className="md:col-span-3">
            <h4 className="eyebrow mb-5">Contact</h4>
            <ul className="space-y-3 text-sm font-light text-charcoal">
              <li>
                <a href={`mailto:${c.email}`} className="hover:text-ink transition-colors">
                  {c.email}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/27${c.phone.replace(/^0/, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
                  {c.phone}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/27${c.phone2.replace(/^0/, '')}`} target="_blank" rel="noopener noreferrer" className="hover:text-ink transition-colors">
                  {c.phone2}
                </a>
              </li>

            </ul>
          </div>
        </div>

        <hr className="hairline" />

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-charcoal text-xs tracking-wide">
            © {new Date().getFullYear()} Aura Spatial Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <button className="text-charcoal text-xs hover:text-ink transition-colors">Privacy</button>
            <button className="text-charcoal text-xs hover:text-ink transition-colors">Terms</button>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-charcoal text-xs hover:text-ink transition-colors"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
