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
  
  // Card Inputs
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', cardholder: '' });
  
  // UPI Inputs
  const [upiId, setUpiId] = useState('');
  const [showUpiModal, setShowUpiModal] = useState(false);
  const [upiCountdown, setUpiCountdown] = useState(5);

  // Dynamic Razorpay script loading
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  // UPI auto-redirect timer simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (showUpiModal && upiCountdown > 0) {
      timer = setTimeout(() => {
        setUpiCountdown(prev => prev - 1);
      }, 1000);
    } else if (showUpiModal && upiCountdown === 0) {
      handleCompleteUpiOrder();
    }
    return () => clearTimeout(timer);
  }, [showUpiModal, upiCountdown]);

  const getCurrencyCode = (symbol: string) => {
    switch (symbol) {
      case '$': return 'USD';
      case '€': return 'EUR';
      case '£': return 'GBP';
      case '¥': return 'JPY';
      case '₹': return 'INR';
      default: return 'USD';
    }
  };

  const triggerRazorpayCheckout = async (preferredMethod?: 'card' | 'upi' | 'netbanking') => {
    const currencyCode = getCurrencyCode(storeConfig.currency);
    setPlacing(true);
    try {
      // 1. Authoritative Server Order Creation (pricing recalculated on server)
      const res = await fetch('/api/create-order', {
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
          receipt: `receipt_order_${Date.now()}`
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({ error: 'Failed to create order' }));
        throw new Error(errData.error || 'Server rejected order creation');
      }

      const orderData = await res.json();
      
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
            // 2. Authoritative Cryptographic HMAC Signature Verification
            const verifyRes = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_payment_id,
                razorpay_order_id,
                razorpay_signature,
                orderData: {
                  id: razorpay_order_id,
                  items,
                  total: orderData.pricing?.total || total,
                  currency: currencyCode,
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
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        toast.error(response.error?.description || 'Payment failed.');
        setPlacing(false);
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
                    <CreditCard className="w-4 h-4" /> Card Billing Credentials
                  </div>
                  <input 
                    required 
                    type="text" 
                    placeholder="Cardholder Name" 
                    value={card.cardholder}
                    onChange={e => setCard({ ...card, cardholder: e.target.value })}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-oxblood" 
                  />
                  <input 
                    required 
                    type="text" 
                    placeholder="Card Number (16-digits)" 
                    maxLength={19}
                    value={card.number}
                    onChange={e => setCard({ ...card, number: e.target.value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim() })}
                    className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-oxblood font-mono" 
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      required 
                      type="text" 
                      placeholder="MM / YY" 
                      maxLength={5}
                      value={card.expiry}
                      onChange={e => setCard({ ...card, expiry: e.target.value })}
                      className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-oxblood font-mono" 
                    />
                    <input 
                      required 
                      type="password" 
                      placeholder="CVV" 
                      maxLength={3}
                      value={card.cvv}
                      onChange={e => setCard({ ...card, cvv: e.target.value })}
                      className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-oxblood font-mono" 
                    />
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

      {/* DYNAMIC UPI QR SCANNER SIMULATION MODAL */}
      {showUpiModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border shadow-luxe max-w-sm w-full rounded p-6 text-center space-y-6 relative noise-overlay">
            <button 
              onClick={() => {
                setShowUpiModal(false);
                setPlacing(false);
              }}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-brass font-bold flex items-center justify-center gap-1">
                <Smartphone className="w-4 h-4" /> UPI Gateway Simulator
              </span>
              <h3 className="font-display text-2xl text-oxblood-deep font-semibold">Scan QR Code</h3>
              <p className="text-xs text-muted-foreground">
                Scan the dynamic QR code below using your BHIM, GPay, PhonePe, or Paytm mobile app to complete the transaction.
              </p>
            </div>

            {/* Visual QR Code Box */}
            <div className="w-48 h-48 mx-auto border-2 border-oxblood p-3 bg-white rounded-md shadow-soft flex items-center justify-center relative group">
              <div className="grid grid-cols-5 grid-rows-5 gap-1.5 w-full h-full opacity-90">
                {[...Array(25)].map((_, i) => (
                  <div 
                    key={i} 
                    className={`rounded-sm ${(i * 7 + 13) % 3 === 0 || i === 0 || i === 4 || i === 20 || i === 24 ? 'bg-oxblood-deep' : 'bg-transparent'}`} 
                  />
                ))}
              </div>
              <div className="absolute inset-0 bg-oxblood/5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300">
                <span className="text-[10px] bg-oxblood text-ivory px-2 py-1 rounded shadow uppercase tracking-wider font-semibold">Simulating Code</span>
              </div>
            </div>

            <div className="space-y-3 bg-muted/40 p-4 rounded text-xs">
              <div className="flex justify-between text-muted-foreground">
                <span>Paying to</span><span className="font-semibold text-foreground">{storeConfig.storeName}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>VPA ID</span><span className="font-mono text-foreground font-semibold">{upiId}</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Amount</span><span className="font-mono text-oxblood-deep font-bold text-sm">{storeConfig.currency}{total.toFixed(2)}</span>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="text-xs text-muted-foreground flex items-center justify-center gap-1.5 animate-pulse text-brass font-bold">
                <Smartphone className="w-3.5 h-3.5" /> Waiting for mobile approval ({upiCountdown}s)...
              </div>
              
              <button
                onClick={handleCompleteUpiOrder}
                className="w-full bg-gradient-oxblood text-primary-foreground py-2.5 rounded-full hover:shadow-soft text-xs uppercase tracking-widest font-semibold"
              >
                Bypass Delay & Approve Now
              </button>
            </div>
          </div>
        </div>
      )}

      <SiteFooter />
    </div>
  );
}