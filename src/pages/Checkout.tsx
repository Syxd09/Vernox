import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { SiteHeader } from '@/components/shop/SiteHeader';
import { SiteFooter } from '@/components/shop/SiteFooter';
import { useCart } from '@/lib/cartContext';
import { useCatalog } from '@/lib/catalogContext';
import { toast } from 'sonner';
import { ShieldCheck, CreditCard, Landmark, QrCode, CheckCircle, Sparkles, Smartphone, X } from 'lucide-react';

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
      <section className="max-w-6xl mx-auto px-6 py-10 md:py-16 w-full grid lg:grid-cols-[1.1fr_380px] gap-10 flex-1">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <h1 className="font-display text-4xl text-oxblood-deep leading-none font-semibold">Checkout</h1>
            <p className="text-muted-foreground text-xs mt-2">Complete your contact, shipping, and billing configurations.</p>
          </div>
          
          <div className="space-y-4">
            <h2 className="font-display text-lg text-oxblood border-b border-border/50 pb-1 font-semibold">Contact Information</h2>
            <input required type="email" placeholder="Email Address for Receipts" value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
              className="w-full bg-card border border-border rounded px-4 py-2.5 text-sm outline-none focus:border-oxblood" />
          </div>

          <div className="space-y-4">
            <h2 className="font-display text-lg text-oxblood border-b border-border/50 pb-1 font-semibold">Shipping Destination</h2>
            <input required placeholder="Recipient Full Name" value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              className="w-full bg-card border border-border rounded px-4 py-2.5 text-sm outline-none focus:border-oxblood" />
            <input required placeholder="Street Address, Suite / Unit" value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="w-full bg-card border border-border rounded px-4 py-2.5 text-sm outline-none focus:border-oxblood" />
            <div className="grid grid-cols-2 gap-4">
              <input required placeholder="City / Locality" value={form.city}
                onChange={e => setForm({ ...form, city: e.target.value })}
                className="w-full bg-card border border-border rounded px-4 py-2.5 text-sm outline-none focus:border-oxblood" />
              <input required placeholder="ZIP / Postal Code" value={form.zip}
                onChange={e => setForm({ ...form, zip: e.target.value })}
                className="w-full bg-card border border-border rounded px-4 py-2.5 text-sm outline-none focus:border-oxblood" />
            </div>
            <input required placeholder="Country" value={form.country}
              onChange={e => setForm({ ...form, country: e.target.value })}
              className="w-full bg-card border border-border rounded px-4 py-2.5 text-sm outline-none focus:border-oxblood" />
          </div>

          {/* PAYMENT OPTIONS SELECTOR */}
          <div className="space-y-6">
            <h2 className="font-display text-lg text-oxblood border-b border-border/50 pb-1 font-semibold">Payment Method</h2>
            
            <div className="grid grid-cols-3 gap-2.5">
              {[
                { id: 'card', label: 'Credit Card', icon: CreditCard },
                { id: 'upi', label: 'UPI / Scan', icon: QrCode },
                { id: 'razorpay', label: 'Razorpay', icon: Smartphone }
              ].map(method => {
                const MethodIcon = method.icon;
                const isSelected = paymentMethod === method.id;
                return (
                  <button
                    key={method.id}
                    type="button"
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-3.5 border rounded flex flex-col items-center justify-center gap-2 text-xs transition-all font-semibold uppercase tracking-wider ${
                      isSelected 
                        ? 'border-oxblood bg-oxblood/5 text-oxblood ring-1 ring-oxblood/10' 
                        : 'border-border bg-card hover:border-oxblood/40 text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <MethodIcon className="w-5 h-5" />
                    <span>{method.label}</span>
                  </button>
                );
              })}
            </div>

            {/* PAYMENT FORMS PANEL */}
            <div className="bg-card border border-border/60 rounded p-5 space-y-4 noise-overlay">
              {paymentMethod === 'card' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="text-xs font-semibold text-oxblood uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <CreditCard className="w-4 h-4" /> Credit / Debit Card Gateway
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Pay securely with Visa, MasterCard, RuPay, Maestro & Amex. Upon clicking below, the encrypted Razorpay payment modal will handle 3D-Secure 2-factor OTP authorization.
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <span className="px-2.5 py-1 bg-muted/60 border border-border/80 rounded text-[10px] font-mono font-semibold">Visa</span>
                    <span className="px-2.5 py-1 bg-muted/60 border border-border/80 rounded text-[10px] font-mono font-semibold">MasterCard</span>
                    <span className="px-2.5 py-1 bg-muted/60 border border-border/80 rounded text-[10px] font-mono font-semibold">RuPay</span>
                    <span className="px-2.5 py-1 bg-muted/60 border border-border/80 rounded text-[10px] font-mono font-semibold">Amex</span>
                  </div>
                </div>
              )}

              {paymentMethod === 'upi' && (
                <div className="space-y-3 animate-fade-in">
                  <div className="text-xs font-semibold text-oxblood uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <QrCode className="w-4 h-4" /> UPI Virtual ID Billing
                  </div>
                  <p className="text-[11px] text-muted-foreground leading-relaxed">
                    Enter your UPI Address (VPA). Upon submitting, we will open a dynamic QR code scanner popup representing your transaction.
                  </p>
                  <input 
                    required 
                    type="text" 
                    placeholder="username@upi or mobile@ybl" 
                    value={upiId}
                    onChange={e => setUpiId(e.target.value)}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-oxblood font-mono" 
                  />
                </div>
              )}

              {paymentMethod === 'razorpay' && (
                <div className="space-y-2.5 animate-fade-in">
                  <div className="text-xs font-semibold text-oxblood uppercase tracking-wider flex items-center gap-1.5 mb-1">
                    <Smartphone className="w-4 h-4" /> Razorpay Standard Gateway
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    You will be redirected securely to **Razorpay checkout standard modal**. Supports all Indian Debit/Credit cards, Netbanking, GooglePay/UPI, and wallet options.
                  </p>
                  <div className="text-[10px] text-muted-foreground flex items-center gap-1 bg-muted/40 p-2 rounded">
                    <ShieldCheck className="w-4 h-4 text-brass" />
                    <span>SSL Secured Transaction · Powered by Razorpay Standard API</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <button disabled={placing}
            className="w-full bg-gradient-oxblood text-primary-foreground font-semibold py-4 rounded-full hover:shadow-luxe hover:scale-[1.01] transition disabled:opacity-60 text-xs uppercase tracking-widest">
            {placing ? 'Processing Securely…' : `Place Order · ${storeConfig.currency}${total.toFixed(2)}`}
          </button>
        </form>

        <aside className="bg-card border border-border/60 rounded p-5 h-fit sticky top-24 noise-overlay">
          <h2 className="font-display text-xl mb-4 text-oxblood-deep font-semibold">Order Summary</h2>
          <div className="space-y-4 mb-5 max-h-72 overflow-y-auto divide-y divide-border/30">
            {items.map((i, idx) => (
              <div key={i.id} className={`flex justify-between text-xs ${idx > 0 ? 'pt-3' : ''}`}>
                <div>
                  <div className="font-semibold text-oxblood-deep">{i.productName}</div>
                  <div className="text-muted-foreground text-[10px] mt-0.5 capitalize">{i.finish} · {i.sizeLabel} × {i.quantity}</div>
                </div>
                <div className="font-semibold font-mono text-oxblood-deep">{storeConfig.currency}{(i.unitPrice * i.quantity).toFixed(2)}</div>
              </div>
            ))}
          </div>
          
          <div className="space-y-2 text-xs border-t border-border/60 pt-4">
            <div className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="font-semibold text-foreground font-mono">{storeConfig.currency}{subtotal.toFixed(2)}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `${storeConfig.currency}${shipping.toFixed(2)}`}</span></div>
            <div className="flex justify-between text-muted-foreground"><span>Sales Tax</span><span className="font-mono">{storeConfig.currency}{tax.toFixed(2)}</span></div>
            
            <div className="flex justify-between text-sm font-semibold border-t border-border/60 pt-3 text-oxblood-deep">
              <span>Total Charge</span><span className="font-mono text-base font-bold">{storeConfig.currency}{total.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/cart" className="block text-center text-[10px] uppercase tracking-widest text-muted-foreground hover:text-oxblood font-bold mt-4">Return to cart</Link>
        </aside>
      </section>



      <SiteFooter />
    </div>
  );
}