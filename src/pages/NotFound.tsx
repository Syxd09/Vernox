import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { SiteHeader } from "@/components/shop/SiteHeader";
import { SiteFooter } from "@/components/shop/SiteFooter";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-background paper-grain">
      <SiteHeader />
      <section className="flex-1 flex items-center justify-center px-6 py-24">
        <div className="max-w-xl text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-brass mb-6">Error 404</p>
          <h1 className="font-display text-7xl md:text-8xl mb-4 text-gradient-oxblood">
            Off the <span className="font-serif-italic">bench.</span>
          </h1>
          <div className="divider-serif my-8">
            <span className="text-brass text-sm tracking-widest">✦</span>
          </div>
          <p className="text-muted-foreground leading-relaxed mb-10 font-serif-italic text-lg">
            The page you're looking for has wandered out of the workshop. Let's guide you back to something we've actually finished.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link
              to="/"
              className="bg-gradient-oxblood text-primary-foreground font-semibold px-8 py-3 rounded-full hover:shadow-luxe transition-shadow"
            >
              Return home
            </Link>
            <Link
              to="/shop"
              className="border border-border hover:border-oxblood px-8 py-3 rounded-full transition-colors"
            >
              Browse the shop
            </Link>
          </div>
          <p className="mt-10 text-xs text-muted-foreground/70 font-mono">
            {location.pathname}
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
};

export default NotFound;
