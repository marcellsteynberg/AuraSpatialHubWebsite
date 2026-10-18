import { motion } from 'framer-motion';
import { Draggable } from './Draggable';
import { fadeUp, staggerContainer, viewportOnce, easeLux } from '../lib/animations';

type TeamMember = {
  name: string;
  role: string;
  image: string;
};

const members: TeamMember[] = [
  {
    name: 'Dwayne Lubbe',
    role: 'Co-Founder & Creative Director',
    image:
      'https://res.cloudinary.com/axx2kz5y/image/upload/v1792074856/Dwayne.jpg',
  },
  {
    name: 'Marcell Steynberg',
    role: 'Co-Founder & Head of Production',
    image:
      'https://res.cloudinary.com/axx2kz5y/image/upload/v1792074856/Marcell.jpg',
  },
];

export default function Team() {
  return (
    <section id="team" className="bg-offwhite py-24 md:py-40">
      <div className="container-lux">
        <motion.div
          variants={staggerContainer(0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={viewportOnce}
          className="mb-16 md:mb-24 text-center"
        >
          <Draggable id="team-eyebrow">
            <motion.span variants={fadeUp} className="eyebrow mb-6 block">
              The People
            </motion.span>
          </Draggable>
          <Draggable id="team-heading">
            <motion.h2
              variants={fadeUp}
              className="font-serif text-ink text-[clamp(2rem,5vw,4rem)] leading-[1.05] tracking-tight"
            >
              Meet the team
            </motion.h2>
          </Draggable>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 md:gap-12 max-w-3xl mx-auto">
          {members.map((member) => (
            <Draggable key={member.name} id={`team-${member.name}`}>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={viewportOnce}
                transition={{ duration: 1, ease: easeLux }}
                className="group"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-ink">
                  <img
                    src={member.image}
                    alt={member.name}
                    loading="lazy"
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.2s] ease-lux group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 transition-opacity duration-700 group-hover:opacity-90" />
                </div>
                <div className="mt-6 text-center">
                  <h3 className="font-serif text-2xl text-ink leading-tight">{member.name}</h3>
                  <p className="text-charcoal text-sm mt-2 font-light tracking-wide">{member.role}</p>
                </div>
              </motion.div>
            </Draggable>
          ))}
        </div>
      </div>
    </section>
  );
}
