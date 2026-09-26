/**
 * Vernox Atelier Management Shell
 * Authenticated Administrative Portal with Modular Subviews:
 * - AdminOverview (Analytics, Revenue, Pipeline)
 * - AdminOrders (1-Click CAM Downloads: DXF, SVG, PDF, and Shipping Fulfillment)
 * - AdminProducts (Product catalog, pricing, category definitions)
 * - AdminSettings (Financial configurations, database backup/export, factory reset)
 */

import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCatalog } from '@/lib/catalogContext';
import { AdminOverview } from './admin/AdminOverview';
import { AdminOrders } from './admin/AdminOrders';
import { AdminProducts } from './admin/AdminProducts';
import { AdminSettings } from './admin/AdminSettings';
import { 
  LayoutDashboard, ShoppingCart, Package, Settings, 
  ArrowLeft, Lock, Scissors, RefreshCw 
} from 'lucide-react';
import { toast } from 'sonner';

type AdminTab = 'overview' | 'orders' | 'products' | 'settings';

export default function Admin() {
  const { isAdmin, loginAdmin } = useCatalog();

  // Authentication State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword) {
      toast.error('Please enter both administrative email and password');
      return;
    }

    setIsAuthenticating(true);
    try {
      const success = await loginAdmin(adminEmail.trim(), adminPassword);
      if (success) {
        toast.success('Admin identity verified');
      } else {
        toast.error('Invalid administrative credentials or insufficient permissions');
      }
    } catch {
      toast.error('Administrative authentication failed');
    } finally {
      setIsAuthenticating(false);
    }
  };

  // 1. Unauthenticated Login Gate
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
        <div className="w-full max-w-md bg-card border border-border/80 rounded-xl p-8 shadow-luxe space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-oxblood/10 border border-oxblood/20 flex items-center justify-center mx-auto text-oxblood mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl text-oxblood-deep">Vernox Atelier Portal</h1>
            <p className="text-xs text-muted-foreground">Sign in with authorized administrator credentials to manage CAM production routing.</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Administrator Email</label>
              <input 
                type="email"
                required
                value={adminEmail}
                onChange={e => setAdminEmail(e.target.value)}
                placeholder="admin@vernox.com"
                className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm outline-none focus:border-oxblood transition"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Passphrase</label>
              <input 
                type="password"
                required
                value={adminPassword}
                onChange={e => setAdminPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm outline-none focus:border-oxblood transition"
              />
            </div>

            <div className="bg-muted/40 border border-border/60 rounded-lg p-3 text-xs space-y-1.5">
              <div className="flex justify-between items-center text-muted-foreground font-medium">
                <span>Atelier Credentials:</span>
                <button
                  type="button"
                  onClick={() => {
                    setAdminEmail('admin@vernox.com');
                    setAdminPassword('admin123');
                  }}
                  className="text-oxblood hover:underline font-semibold text-[11px]"
                >
                  Quick Fill
                </button>
              </div>
              <div className="font-mono text-[11px] text-foreground/80 flex justify-between">
                <span>Email:</span>
                <span className="font-semibold text-oxblood">admin@vernox.com</span>
              </div>
              <div className="font-mono text-[11px] text-foreground/80 flex justify-between">
                <span>Passphrase:</span>
                <span className="font-semibold text-oxblood">admin123 <span className="font-normal text-muted-foreground">or</span> vernox2026</span>
              </div>
            </div>

            <button 
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-oxblood text-ivory hover:bg-oxblood-deep font-semibold py-2.5 rounded-lg text-sm transition shadow-soft disabled:opacity-50"
            >
              {isAuthenticating ? "Verifying Credentials..." : "Authenticate Administrator"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-border/60">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
              <ArrowLeft className="w-3 h-3" /> Back to Vernox Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Authenticated Admin Dashboard Workspace
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top Header Bar */}
      <header className="h-14 bg-card border-b border-border/70 flex items-center justify-between px-6 z-20">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-oxblood flex items-center justify-center overflow-hidden text-ivory font-bold text-xs">
            V
          </div>
          <div>
            <h1 className="font-display text-lg text-oxblood-deep leading-none">Vernox</h1>
            <span className="text-[10px] font-mono text-brass leading-none">Industrial CAM Administration</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link 
            to="/" 
            className="text-xs font-medium text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Store
          </Link>
          <div className="h-4 w-px bg-border" />
          <span className="text-xs font-mono bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 px-2.5 py-1 rounded-full">
            Admin Verified
          </span>
        </div>
      </header>

      {/* Main Layout: Sidebar & Content Area */}
      <div className="flex flex-1 flex-col md:flex-row overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 bg-card border-b md:border-b-0 md:border-r border-border/60 p-4 space-y-1 flex-shrink-0">
          <div className="hidden md:block px-3 py-2 text-xs uppercase tracking-widest text-muted-foreground/60 font-semibold mb-3">
            Atelier Navigation
          </div>
          <nav className="flex md:flex-col gap-1 overflow-x-auto pb-2 md:pb-0">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: LayoutDashboard },
              { id: 'orders', label: 'Orders & CAM Routing', icon: ShoppingCart },
              { id: 'products', label: 'Product Catalog', icon: Package },
              { id: 'settings', label: 'Settings & Backups', icon: Settings },
            ].map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AdminTab)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 text-sm rounded-lg transition font-medium whitespace-nowrap ${
                    isActive 
                      ? 'bg-oxblood text-ivory shadow-soft font-semibold' 
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 bg-background-warm">
          {activeTab === 'overview' && (
            <AdminOverview onSelectTab={setActiveTab} />
          )}

          {activeTab === 'orders' && (
            <AdminOrders />
          )}

          {activeTab === 'products' && (
            <AdminProducts />
          )}

          {activeTab === 'settings' && (
            <AdminSettings />
          )}
        </main>
      </div>
    </div>
  );
}
