import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { ShapeThumb } from '@/components/shop/ShapeThumb';
import { useCart } from '@/lib/cartContext';
import { useCatalog } from '@/lib/catalogContext';
import { toast } from 'sonner';
import { ShieldCheck, CreditCard, Landmark, QrCode, CheckCircle, Sparkles, Smartphone, X, Lock, Truck, Award, Phone, Shield, Clock } from 'lucide-react';

export default function Checkout() {
  const { items, subtotal, clear } = useCart();
  const { addOrder, storeConfig, currentCustomer } = useCatalog();
  const [placing, setPlacing] = useState(false);
  const navigate = useNavigate();

  const shipping = subtotal > storeConfig.freeShippingThreshold ? 0 : storeConfig.shippingFee;
  const tax = subtotal * (storeConfig.taxRate / 100);
  const total = subtotal + shipping + tax;

  const [form, setForm] = useState({
    email: currentCustomer?.email || '',
    name: currentCustomer?.name || '',
    address: currentCustomer?.address || '',
    city: currentCustomer?.city || '',
    zip: currentCustomer?.zip || '',
    country: currentCustomer?.country || 'United States',
  });

  // Prefill details if current customer loads asynchronously
  useEffect(() => {
    if (currentCustomer) {
      setForm({
        email: currentCustomer.email,
        name: currentCustomer.name,
        address: currentCustomer.address || '',
        city: currentCustomer.city || '',
        zip: currentCustomer.zip || '',
        country: currentCustomer.country || 'United States',
      });
    }
  }, [currentCustomer]);

  // Multiple Payment Methods state
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'razorpay'>('card');
  
  // UPI Inputs
  const [upiId, setUpiId] = useState('');

  // Razorpay script verification / dynamic loading
  useEffect(() => {
    if (typeof (window as any).Razorpay !== 'undefined') return;
    if (document.querySelector('script[src*="checkout.razorpay.com"]')) return;
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  }, []);

  const getCurrencyCode = (symbol: string) => {
    switch (symbol) {
      case '₹': return 'INR';
      case '€': return 'EUR';
      case '£': return 'GBP';
      case '¥': return 'JPY';
      case '$': return 'INR';
      default: return 'INR';
    }
  };

  const [idempotencyKey, setIdempotencyKey] = useState<string>(() => crypto.randomUUID());

  const triggerRazorpayCheckout = async (preferredMethod?: 'card' | 'upi' | 'netbanking') => {
    if (placing) return;
    const currencyCode = getCurrencyCode(storeConfig.currency);
    setPlacing(true);
    try {
      // 1. Authoritative Server Order Intent Creation with Inventory Reservation & Idempotency Key
      const res = await fetch('/api/checkout-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map(item => ({
            productId: item.productId,
            productSlug: item.productSlug,
            widthMm: item.widthMm,
            heightMm: item.heightMm,
            finish: item.finish,
            quantity: item.quantity,
            shapeId: item.shapeId,
            customDesignRef: item.customDesignRef
          })),
          currency: currencyCode,
          idempotencyKey,
          customer: {
            email: form.email.trim().toLowerCase(),
            name: form.name.trim(),
            address: form.address,
            city: form.city,
            zip: form.zip,
            country: form.country,
          }
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Failed to create checkout intent' }));
        throw new Error(errData.error || 'Server rejected checkout intent');
      }

      const orderData = await res.json();
      
      // Development mode mock checkout simulation when gateway credentials reject in dev
      if (orderData.isDevFallback) {
        toast.info('Development Gateway: Simulating instant order confirmation…');
        const mockPaymentId = `pay_dev_${Date.now()}`;
        const mockSignature = `sig_dev_${Date.now()}`;
        const verifyRes = await fetch('/api/verify-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            razorpay_payment_id: mockPaymentId,
            razorpay_order_id: orderData.order_id,
            razorpay_signature: mockSignature,
            orderData: {
              email: form.email,
              shippingName: form.name,
              shippingAddress: form.address,
              shippingCity: form.city,
              shippingZip: form.zip,
              shippingCountry: form.country,
            }
          })
        });

        const verifyData = await verifyRes.json().catch(() => ({}));
        if (verifyRes.ok && verifyData.success) {
          const verifiedId = verifyData.orderId || orderData.order_id;
          addOrder({
            id: verifiedId,
            items,
            total: orderData.pricing?.total || total,
            placedAt: Date.now(),
            email: form.email,
            shippingName: form.name,
            shippingAddress: form.address,
            shippingCity: form.city,
            shippingZip: form.zip,
            shippingCountry: form.country,
            adminNotes: `Dev Mode Mock Order: ${mockPaymentId}`
          });
          clear();
          toast.success("Order confirmed successfully (Development Mode)");
          navigate(`/order-confirmation/${verifiedId}`);
          return;
        }
      }

      // Ensure Razorpay SDK is loaded
      if (typeof (window as any).Razorpay === 'undefined') {
        throw new Error('Payment gateway SDK is loading. Please try again in a moment.');
      }

      const razorpayKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
      if (!razorpayKey) {
        throw new Error('Razorpay Key ID is not configured. Please check VITE_RAZORPAY_KEY_ID in .env');
      }

      const options: any = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: storeConfig.storeName,
        description: "Bespoke Architectural Metal Sign",
        order_id: orderData.order_id,
        handler: async function (response: any) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = response;
          try {
            // 2. Authoritative Cryptographic HMAC Signature Verification against server order intent
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
                orderData: {
                  email: form.email,
                  shippingName: form.name,
                  shippingAddress: form.address,
                  shippingCity: form.city,
                  shippingZip: form.zip,
                  shippingCountry: form.country,
                }
              })
            });

            const verifyData = await verifyRes.json().catch(() => ({}));
            if (verifyRes.ok && verifyData.success) {
              const verifiedId = verifyData.orderId || razorpay_order_id;
              addOrder({
                id: verifiedId,
                items,
                total: orderData.pricing?.total || total,
                placedAt: Date.now(),
                email: form.email,
                shippingName: form.name,
                shippingAddress: form.address,
                shippingCity: form.city,
                shippingZip: form.zip,
                shippingCountry: form.country,
                adminNotes: `Verified Razorpay Payment: ${razorpay_payment_id}`
              });
              localStorage.setItem('vernox-customer-email', form.email.trim().toLowerCase());
              clear();
              toast.success('Payment verified & order confirmed!');
              navigate(`/order-confirmation/${verifiedId}`);
            } else {
              toast.error(verifyData.error || 'Payment signature verification failed.');
              setPlacing(false);
            }
          } catch (err: any) {
            toast.error(err.message || 'Signature verification network failure.');
            setPlacing(false);
          }
        },
        prefill: { 
          name: form.name, 
          email: form.email,
          ...(preferredMethod === 'upi' && upiId ? { vpa: upiId } : {})
        },
        theme: { color: "#6b1e28" },
        modal: {
          ondismiss: function () {
            toast.error('Payment window closed.');
            setPlacing(false);
            // Cycle idempotency key so that next intent attempt is fresh
            setIdempotencyKey(crypto.randomUUID());
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error(response.error?.description || 'Payment failed.');
        setPlacing(false);
        setIdempotencyKey(crypto.randomUUID());
      });
      rzp.open();
    } catch (err: any) {
      toast.error(err.message || 'Checkout initiation error.');
      setPlacing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) { toast.error('Cart is empty'); return; }
    
    // Route all payment options through secure server gateway
    triggerRazorpayCheckout(paymentMethod as any);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SiteHeader />

      {/* TOP BANK-GRADE SECURITY BAR */}
      <div className="bg-[#0f131a] text-[#ded3c3] text-[10px] tracking-[0.2em] uppercase py-2 px-6 border-b border-white/10">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="flex items-center gap-1.5 text-brass">
            <Lock className="w-3.5 h-3.5" />
            <span>256-Bit SSL Encrypted Checkout</span>
          </span>
          <div className="hidden sm:flex items-center gap-4 text-muted-foreground/80">
            <span>PCI-DSS Level 1 Compliant</span>
            <span>·</span>
            <span>100% Insured Crate Transit</span>
            <span>·</span>
            <span>Zero-Risk Guarantee</span>
          </div>
          <span className="font-mono text-muted-foreground">ID: {idempotencyKey.slice(0, 8)}</span>
        </div>
      </div>

      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10 md:py-14 w-full grid lg:grid-cols-[1.1fr_400px] gap-10 flex-1">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Header & Stepper */}
          <div>
            <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-muted-foreground mb-2">
              <Link to="/cart" className="hover:text-oxblood transition">Cart</Link>
              <span>/</span>
              <span className="text-oxblood font-semibold">Secure Checkout</span>
            </div>
            <h1 className="font-display text-3xl sm:text-4xl text-oxblood-deep leading-tight font-semibold">
              Atelier Commission Checkout
            </h1>
            <p className="text-muted-foreground text-xs mt-1 font-serif-italic">
              Provide recipient specifications for custom packaging, hallmarking, and insured door-to-door delivery.
            </p>
          </div>

          {/* Step Badges */}
          <div className="grid grid-cols-3 gap-2 text-[10px] uppercase tracking-wider font-semibold border-y border-border/70 py-3">
            <div className="flex items-center gap-2 text-oxblood">
              <span className="w-5 h-5 rounded-full bg-oxblood text-ivory flex items-center justify-center font-mono">1</span>
              <span>Destination</span>
            </div>
            <div className="flex items-center gap-2 text-oxblood font-bold">
              <span className="w-5 h-5 rounded-full bg-brass text-black flex items-center justify-center font-mono">2</span>
              <span>Payment</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground/60">
              <span className="w-5 h-5 rounded-full bg-muted text-muted-foreground flex items-center justify-center font-mono">3</span>
              <span>Hallmark</span>
            </div>
          </div>
          
          {/* Contact Information */}
          <div className="bg-card border border-border/70 rounded-lg p-5 noise-overlay shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <h2 className="font-display text-lg text-oxblood-deep font-semibold">1. Recipient & Contact Information</h2>
              <span className="text-[10px] text-muted-foreground font-mono">Instant Confirmation</span>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
                Email Address (Receipt & DHL Tracking)
              </label>
              <input required type="email" placeholder="client@architecturalstudio.com" value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                className="w-full bg-background border border-border rounded px-4 py-2.5 text-sm outline-none focus:border-oxblood font-sans transition" />
            </div>
          </div>

          {/* Shipping Destination */}
          <div className="bg-card border border-border/70 rounded-lg p-5 noise-overlay shadow-soft space-y-4">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <h2 className="font-display text-lg text-oxblood-deep font-semibold">2. Insured Freight Delivery Destination</h2>
              <span className="text-[10px] text-brass uppercase font-semibold flex items-center gap-1">
                <Truck className="w-3.5 h-3.5" /> Archival Crate
              </span>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
                Recipient Full Name / Studio Attention
              </label>
              <input required placeholder="e.g. Jean Dupont" value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
                className="w-full bg-background border border-border rounded px-4 py-2.5 text-sm outline-none focus:border-oxblood transition" />
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
                Street Address, Suite or Gallery Floor
              </label>
              <input required placeholder="Kloosterstraat 44, Suite 3B" value={form.address}
                onChange={e => setForm({ ...form, address: e.target.value })}
                className="w-full bg-background border border-border rounded px-4 py-2.5 text-sm outline-none focus:border-oxblood transition" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
                  City / Locality
                </label>
                <input required placeholder="Antwerp / London / New York" value={form.city}
                  onChange={e => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-background border border-border rounded px-4 py-2.5 text-sm outline-none focus:border-oxblood transition" />
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
                  ZIP / Postal Code
                </label>
                <input required placeholder="2000" value={form.zip}
                  onChange={e => setForm({ ...form, zip: e.target.value })}
                  className="w-full bg-background border border-border rounded px-4 py-2.5 text-sm outline-none focus:border-oxblood transition" />
              </div>
            </div>

            <div>
              <label className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block mb-1">
                Destination Country
              </label>
              <input required placeholder="United States, Belgium, United Kingdom, India..." value={form.country}
                onChange={e => setForm({ ...form, country: e.target.value })}
                className="w-full bg-background border border-border rounded px-4 py-2.5 text-sm outline-none focus:border-oxblood transition" />
            </div>
          </div>

          {/* PAYMENT OPTIONS SELECTOR */}
          <div className="bg-card border border-border/70 rounded-lg p-5 noise-overlay shadow-soft space-y-5">
            <div className="flex items-center justify-between border-b border-border/60 pb-2">
              <h2 className="font-display text-lg text-oxblood-deep font-semibold">3. Payment Authorization Rail</h2>
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> 3D-Secure 2.0
              </span>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'card', label: 'Credit Card', icon: CreditCard, sub: 'Visa, Amex, MC' },
                { id: 'upi', label: 'UPI / QR', icon: QrCode, sub: 'GPay, PhonePe' },
                { id: 'razorpay', label: 'Razorpay Gateway', icon: Smartphone, sub: 'NetBanking / Wallets' }
              ].map(method => {
                const MethodIcon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-3.5 border rounded-lg flex flex-col items-center justify-center gap-1.5 text-xs transition-all font-semibold uppercase tracking-wider ${
                      isSelected 
                        ? 'border-oxblood bg-oxblood/5 text-oxblood ring-2 ring-oxblood/15 shadow-sm' 
                        : 'border-border bg-background hover:border-oxblood/40 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <MethodIcon className="w-5 h-5" />
                    <span>{method.label}</span>
                    <span className="text-[9px] font-mono normal-case tracking-normal text-muted-foreground/70">{method.sub}</span>
                  </button>
                );
              })}
            </div>

            {/* PAYMENT FORMS PANEL */}
            <div className="bg-background border border-border/70 rounded p-4 space-y-3">
              {paymentMethod === 'card' && (
                <div className="space-y-2.5 animate-fade-in">
                  <div className="text-xs font-semibold text-oxblood uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" /> Bank-Grade 256-Bit Encrypted Card Authorization
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Pay with Visa, MasterCard, RuPay, Maestro & American Express. 3D-Secure 2-Factor OTP authorization is handled directly inside the encrypted Razorpay gateway modal.
                  </p>
                  <div className="flex items-center gap-2 pt-1 text-[9px] font-mono font-semibold text-muted-foreground">
                    <span className="px-2 py-0.5 bg-muted rounded border border-border">VISA</span>
                    <span className="px-2 py-0.5 bg-muted rounded border border-border">MASTERCARD</span>
                    <span className="px-2 py-0.5 bg-muted rounded border border-border">AMEX</span>
                    <span className="px-2 py-0.5 bg-muted rounded border border-border">RUPAY</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="text-xs font-semibold text-oxblood uppercase tracking-wider flex items-center gap-1.5">
                    <QrCode className="w-4 h-4" /> UPI Virtual Private Address (VPA) / Instant QR
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Enter your Virtual Payment Address (e.g. mobile@upi or name@okhdfcbank) or click Place Order to scan the dynamic secure transaction QR with Google Pay, PhonePe, or Paytm.
                  </p>
                  <input 
                    type="text" 
                    placeholder="username@upi or mobile@okhdfcbank (Optional)" 
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="w-full bg-card border border-border rounded px-3 py-2 text-sm outline-none focus:border-oxblood font-mono" 
                  />
                </div>
              )}

              {paymentMethod === 'razorpay' && (
                <div className="space-y-2 animate-fade-in">
                  <div className="text-xs font-semibold text-oxblood uppercase tracking-wider flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4" /> Unified Razorpay Multi-Rail Gateway
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Direct access to all 58 Indian banks, Corporate NetBanking, EMI, CRED, Apple Pay / International Cards, and digital wallets.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Place Order CTA */}
          <button 
            type="submit"
            disabled={placing}
            className="w-full bg-gradient-oxblood hover:bg-oxblood-deep text-primary-foreground font-semibold py-4 rounded-full hover:shadow-luxe hover:scale-[1.005] active:scale-[0.99] transition text-xs uppercase tracking-[0.2em] disabled:opacity-60 shadow-soft flex items-center justify-center gap-2"
          >
            {placing ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-ivory border-t-transparent rounded-full animate-spin" />
                Connecting to Secure Gateway…
              </span>
            ) : (
              `Authorize & Place Commission · ${storeConfig.currency}${total.toFixed(2)}`
            )}
          </button>
        </form>

        {/* RIGHT COLUMN: ORDER SUMMARY SIDEBAR WITH THUMBNAILS & GUARANTEES */}
        <aside className="space-y-6 sticky top-24">
          <div className="bg-card border border-border/80 rounded-lg p-5 noise-overlay shadow-luxe space-y-5">
            <div className="flex items-center justify-between border-b border-border/70 pb-3">
              <div>
                <h2 className="font-display text-xl text-oxblood-deep font-semibold">Commission Manifest</h2>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest mt-0.5">Antwerp Reserved Items</p>
              </div>
              <span className="bg-oxblood/10 text-oxblood text-xs px-2.5 py-0.5 rounded-full font-mono font-bold">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>

            {/* Item List with high-res thumbnails */}
            <div className="space-y-3.5 max-h-80 overflow-y-auto divide-y divide-border/40 pr-1">
              {items.map((i, idx) => (
                <div key={i.id} className={`flex gap-3 text-xs ${idx > 0 ? 'pt-3.5' : ''}`}>
                  <div className="w-14 h-14 bg-background border border-border/80 rounded p-1.5 flex items-center justify-center shrink-0 shadow-xs relative">
                    {i.customDesignThumb ? (
                      <img src={i.customDesignThumb} alt="" className="w-full h-full object-contain" />
                    ) : (
                      <ShapeThumb shapeId={i.shapeId} finish={i.finish} className="w-full h-full" />
                    )}
                    <span className="absolute -top-1.5 -right-1.5 bg-oxblood text-ivory text-[9px] font-mono px-1 rounded-full font-bold">
                      ×{i.quantity}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-oxblood-deep truncate">{i.productName}</div>
                    <div className="text-muted-foreground text-[10px] mt-0.5 capitalize">
                      {i.finish} · {i.sizeLabel}
                    </div>
                    <div className="text-[9px] text-brass font-mono font-semibold mt-0.5">Solid 3.0mm Plate</div>
                  </div>

                  <div className="font-semibold font-mono text-oxblood-deep shrink-0 text-right">
                    {storeConfig.currency}{(i.unitPrice * i.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            {/* Estimated Arrival Banner */}
            <div className="bg-muted/40 border border-border/70 rounded p-3 text-xs space-y-1">
              <div className="flex items-center gap-1.5 font-semibold text-oxblood-deep">
                <Truck className="w-3.5 h-3.5 text-brass" />
                <span>Estimated Insured Arrival</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                White-glove crated transit via <strong>DHL Express Priority</strong>. Tracking provided immediately upon laser inspection.
              </p>
            </div>
            
            {/* Totals */}
            <div className="space-y-2 text-xs border-t border-border/70 pt-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Merchandise Subtotal</span>
                <span className="font-semibold text-foreground font-mono">{storeConfig.currency}{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Insured Freight & Timber Crate</span>
                <span className="font-mono">
                  {shipping === 0 ? (
                    <span className="text-emerald-700 dark:text-emerald-400 font-semibold uppercase text-[10px]">Complimentary</span>
                  ) : (
                    `${storeConfig.currency}${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Sales Tax / VAT ({storeConfig.taxRate}%)</span>
                <span className="font-mono">{storeConfig.currency}{tax.toFixed(2)}</span>
              </div>
              
              <div className="flex justify-between text-sm font-semibold border-t border-border/70 pt-3 text-oxblood-deep">
                <div>
                  <span>Total Investment</span>
                  <span className="block text-[9px] text-muted-foreground font-normal">All duties & crating included</span>
                </div>
                <span className="font-mono text-xl font-bold text-oxblood">{storeConfig.currency}{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Guarantees Box */}
            <div className="pt-3 border-t border-border/60 space-y-2 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-brass shrink-0" />
                <span>10-Year Weathering & Corrosion Warranty</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-3.5 h-3.5 text-brass shrink-0" />
                <span>Numbered Hallmark & Signed Certificate</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-brass shrink-0" />
                <span>Zero-Risk Crated Replacement Guarantee</span>
              </div>
            </div>

            <Link 
              to="/cart" 
              className="block text-center text-[10px] uppercase tracking-widest text-muted-foreground hover:text-oxblood font-bold pt-2 transition"
            >
              ← Edit quantities in cart
            </Link>
          </div>

          {/* Concierge Hotline */}
          <div className="bg-card border border-border/70 rounded-lg p-4 flex items-center gap-3 shadow-soft">
            <div className="p-2 rounded-full bg-oxblood/10 text-oxblood shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="text-xs">
              <div className="font-semibold text-oxblood-deep">Need Checkout Assistance?</div>
              <div className="text-muted-foreground text-[11px] mt-0.5">
                Our Antwerp desk is ready: <a href="tel:+3232314490" className="text-oxblood font-semibold underline">+32 3 231 44 90</a>
              </div>
            </div>
          </div>
        </aside>
      </section>

      <SiteFooter />
    </div>
  );
}