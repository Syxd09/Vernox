import { useState } from 'react';
import { toast } from 'sonner';
import { CheckCircle2 } from 'lucide-react';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address');
      return;
    }

    setSubscribed(true);
    toast.success('Welcome to Vernox Privé', {
      description: 'You will receive our private previews and design journals.',
    });
  };

  return (
    <section className="bg-[#FFFFFF] py-20 lg:py-24 border-b border-[#EBE4D6]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Subtle decorative gold line */}
        <div className="w-12 h-[1px] bg-[#C6A15B] mx-auto mb-6" />

        <div className="text-[10px] uppercase tracking-[0.3em] font-sans text-[#6B2732] font-semibold mb-2">
          Curator's Dispatch
        </div>

        <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-[#332522] font-normal tracking-tight">
          STAY INSPIRED
        </h2>

        <p className="text-xs sm:text-sm text-[#332522]/70 font-sans mt-3 max-w-md mx-auto leading-relaxed">
          Discover new collections, interior inspiration and exclusive releases.
        </p>

        {/* Subscription Form */}
        <div className="mt-8 max-w-md mx-auto">
          {subscribed ? (
            <div className="p-4 rounded-[2px] bg-[#F8F3EA] border border-[#C6A15B]/40 flex items-center justify-center gap-3 text-xs text-[#332522] font-sans">
              <CheckCircle2 className="w-4 h-4 text-maroon-deep" />
              <span>Thank you for subscribing. Welcome to the Vernox circle.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                className="flex-1 px-4 py-3.5 bg-[#F8F3EA] border border-[#EBE4D6] rounded-[2px] text-xs font-sans text-[#332522] placeholder:text-[#332522]/40 focus:outline-hidden focus:border-maroon-deep transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-maroon-deep hover:opacity-90 text-cream text-xs uppercase tracking-[0.22em] font-sans font-semibold rounded-[2px] transition-all duration-300 shadow-sm hover:border-b-2 hover:border-[#C6A15B] cursor-pointer shrink-0"
              >
                SUBSCRIBE
              </button>
            </form>
          )}

          <p className="text-[10px] text-[#332522]/50 font-sans mt-3">
            We respect your privacy. Unsubscribe at any time with one click.
          </p>
        </div>
      </div>
    </section>
  );
}
