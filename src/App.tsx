import { useSmoothScroll } from './hooks/useSmoothScroll';
import { ContentProvider, useContent } from './context/ContentContext';
import ScrollProgress from './components/ScrollProgress';
import Navigation from './components/Navigation';
import Hero from './components/Hero';
import Services from './components/Services';
import About from './components/About';
import Team from './components/Team';

import WhyChooseAura from './components/WhyChooseAura';
import Contact from './components/Contact';
import Footer from './components/Footer';
import AdminToggle from './components/AdminToggle';
import MoveModeBanner from './components/MoveModeBanner';

function Site() {
  const { typographyPreset } = useContent();
  return (
    <div data-typography={typographyPreset} className="bg-bg text-ink antialiased">
      <ScrollProgress />
      <Navigation />
      <main>
        <Hero />
        <Services />
        <About />
        <Team />
        <WhyChooseAura />
        <Contact />
      </main>
      <Footer />
      <AdminToggle />
      <MoveModeBanner />
    </div>
  );
}

export default function App() {
  useSmoothScroll();

  return (
    <ContentProvider>
      <Site />
    </ContentProvider>
  );
}
