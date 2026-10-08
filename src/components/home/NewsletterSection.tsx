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
    <section className="bg-white py-20 lg:py-24 border-b border-[#EBE4D6]">
      <div className="max-w-4xl mx-auto px-6 text-center">
        {/* Subtle decorative gold line */}
        <div className="w-12 h-[1px] bg-gold mx-auto mb-6" />

        <div className="mb-2">
          <span className="text-[10px] uppercase tracking-[0.28em] font-sans text-burgundy font-semibold">
            Curator's Dispatch
          </span>
        </div>

        <h2 className="font-editorial text-3xl sm:text-4xl lg:text-5xl text-dark-brown font-normal tracking-tight">
          STAY INSPIRED
        </h2>

        <p className="text-xs sm:text-sm text-dark-brown/70 font-sans mt-3 max-w-md mx-auto leading-relaxed">
          Discover new collections, interior inspiration and exclusive releases.
        </p>

        {/* Subscription Form */}
        <div className="mt-8 max-w-md mx-auto">
          {subscribed ? (
            <div className="p-4 rounded-[2px] bg-cream border border-dusty-pink/40 flex items-center justify-center gap-3 text-xs text-dark-brown font-sans">
              <CheckCircle2 className="w-4 h-4 text-burgundy" />
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
                className="flex-1 px-4 py-3.5 bg-cream border border-[#EBE4D6] rounded-[2px] text-xs font-sans text-dark-brown placeholder:text-dark-brown/40 focus:outline-hidden focus:border-burgundy transition-colors"
              />
              <button
                type="submit"
                className="px-8 py-3.5 bg-burgundy hover:bg-burgundy-hover text-cream text-xs uppercase tracking-[0.22em] font-sans font-semibold rounded-[2px] transition-all duration-300 shadow-sm border border-transparent hover:border-dusty-pink cursor-pointer shrink-0"
              >
                SUBSCRIBE
              </button>
            </form>
          )}

          <p className="text-[10px] text-dark-brown/50 font-sans mt-3">
            We respect your privacy. Unsubscribe at any time with one click.
          </p>
        </div>
      </div>
    </section>
  );
}
