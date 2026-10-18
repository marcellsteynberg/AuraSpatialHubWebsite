import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, ArrowRight, Check } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { Draggable } from './Draggable';
import { fadeUp, staggerContainer, viewportOnce } from '../lib/animations';

const inquiryTypes = [
  'Floorplans',
  '360 Walkthroughs',
  'Virtual Staging',
  'Fixer Upper Vision',
  'Cinematic Videos',
  'Full Service Enquiry',
];

export default function Contact() {
  const { content } = useContent();
  const c = content.contact;
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get('name') || ''),
      email: String(formData.get('email') || ''),
      phone: String(formData.get('phone') || ''),
      company: String(formData.get('company') || ''),
      inquiryType: String(formData.get('inquiryType') || ''),
      message: String(formData.get('message') || ''),
    };

    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-enquiry`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.error || 'Something went wrong. Please try again.');
      }

      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Something went wrong. Please try again.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const socials = [
    { label: 'Email', href: `mailto:${c.email}`, Icon: Mail },
    { label: 'Phone', href: `https://wa.me/27${c.phone.replace(/^0/, '')}`, Icon: Phone, value: c.phone },
    { label: 'Phone', href: `https://wa.me/27${c.phone2.replace(/^0/, '')}`, Icon: Phone, value: c.phone2 },
  ] as { label: string; href: string; Icon: typeof Mail; value?: string }[];

  return (
    <section id="contact" className="bg-bg py-24 md:py-40">
      <div className="container-lux grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24">
        {/* Left — heading + contact details */}
        <motion.div
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="lg:col-span-5"
        >
          <Draggable id="contact-eyebrow">
            <motion.span variants={fadeUp} className="eyebrow mb-6 block">
              {c.eyebrow}
            </motion.span>
          </Draggable>
          <Draggable id="contact-heading">
            <motion.h2
              variants={fadeUp}
              className="font-serif text-ink text-[clamp(2rem,4.5vw,3.5rem)] leading-[1.05] tracking-tight mb-8"
            >
              {c.heading}
            </motion.h2>
          </Draggable>
          <Draggable id="contact-description">
            <motion.p variants={fadeUp} className="text-charcoal text-lg leading-relaxed font-light mb-12 max-w-md">
              {c.description}
            </motion.p>
          </Draggable>

          <Draggable id="contact-socials">
            <motion.div variants={fadeUp} className="space-y-px bg-hairline border border-hairline">
              {socials.map(({ label, href, Icon, value }, idx) => (
                <a
                  key={idx}
                  href={href}
                  target={href.startsWith('http') ? '_blank' : undefined}
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between bg-bg px-6 py-5 transition-colors duration-500 hover:bg-offwhite"
                >
                  <span className="flex items-center gap-4">
                    <Icon size={18} strokeWidth={1.5} className="text-charcoal group-hover:text-ink transition-colors" />
                    <span className="text-sm tracking-wide text-ink">{label}</span>
                  </span>
                  <span className="text-xs text-charcoal group-hover:text-ink transition-colors max-w-[60%] truncate text-right">
                    {label === 'Email'
                      ? c.email
                      : label === 'Phone'
                      ? value
                      : 'Visit →'}
                  </span>
                </a>
              ))}
            </motion.div>
          </Draggable>
        </motion.div>

        {/* Right — form */}
        <Draggable id="contact-form" className="lg:col-span-7">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
          >
            {submitted ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="border border-hairline bg-offwhite p-12 md:p-16 flex flex-col items-center text-center min-h-[420px] justify-center"
              >
                <span className="w-14 h-14 rounded-full bg-ink text-white flex items-center justify-center mb-6">
                  <Check size={22} strokeWidth={1.5} />
                </span>
                <h3 className="font-serif text-3xl text-ink mb-3">Request received.</h3>
                <p className="text-charcoal font-light max-w-md">
                  Thank you. Our studio will be in touch within one business day to discuss your project.
                </p>
              </motion.div>
            ) : (
              <form
                onSubmit={onSubmit}
                className="border border-hairline bg-offwhite p-8 md:p-12 grid grid-cols-1 sm:grid-cols-2 gap-6"
              >
                <Field label="Name" name="name" placeholder="Your full name" required />
                <Field label="Email" name="email" type="email" placeholder="you@company.com" required />
                <Field label="Phone" name="phone" type="tel" placeholder="+27 (00) 000 0000" />
                <Field label="Company" name="company" placeholder="Agency / firm" />

                <div className="sm:col-span-2">
                  <label className="eyebrow block mb-3">Inquiry Type</label>
                  <select
                    name="inquiryType"
                    required
                    defaultValue=""
                    className="w-full bg-transparent border-b border-ink/20 py-3 text-ink focus:outline-none focus:border-ink transition-colors duration-300"
                  >
                    <option value="" disabled>
                      Select a service…
                    </option>
                    {inquiryTypes.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="eyebrow block mb-3">Message</label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    placeholder="Tell us about the property, timeline, and scope…"
                    className="w-full bg-transparent border-b border-ink/20 py-3 text-ink placeholder:text-charcoal/50 focus:outline-none focus:border-ink transition-colors duration-300 resize-none"
                  />
                </div>

                {submitError && (
                  <div className="sm:col-span-2">
                    <p className="text-xs text-red-600 leading-relaxed">{submitError}</p>
                  </div>
                )}

                <div className="sm:col-span-2 mt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="btn-lux btn-lux-solid w-full sm:w-auto disabled:opacity-40"
                  >
                    {submitting ? 'Sending…' : 'Request a Quote'}
                    {!submitting && <ArrowRight size={15} strokeWidth={1.5} />}
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </Draggable>
      </div>
    </section>
  );
}

function Field({
  label,
  name,
  type = 'text',
  placeholder,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="eyebrow block mb-3" htmlFor={name}>
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="w-full bg-transparent border-b border-ink/20 py-3 text-ink placeholder:text-charcoal/50 focus:outline-none focus:border-ink transition-colors duration-300"
      />
    </div>
  );
}
