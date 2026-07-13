import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { Link } from 'react-router-dom';

export default function About() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />
      <section className="max-w-3xl mx-auto px-6 py-24 flex-1">
        <p className="text-xs uppercase tracking-[0.3em] text-brass mb-3">Our craft</p>
        <h1 className="font-display text-5xl mb-8">Metal, patiently made.</h1>
        <div className="space-y-6 text-muted-foreground leading-relaxed">
          <p>Vernox is a small metal studio outside Portland. Every piece is cut on our fiber laser, deburred by hand, and finished with brushed, blackened, or plated surfaces before it leaves the shop.</p>
          <p>We started with custom family monograms for friends. Today we ship pieces to homes, hotels, and offices across three continents — but every order still passes across the same bench.</p>
          <p>If you have a sketch, a photo, or just a vibe, our <Link to="/customize" className="text-brass underline underline-offset-4">Design Studio</Link> is the fastest way to bring it to life.</p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}