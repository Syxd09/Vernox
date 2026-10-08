/**
 * Vernox Enterprise Management Shell
 * Authenticated Administrative Portal with Modular Subviews:
 * - AdminOverview (Analytics, Revenue, Live Pipeline)
 * - AdminOrders (1-Click CAM Downloads: DXF, SVG, PDF, and Shipping Fulfillment)
 * - AdminProducts (Product catalog, pricing, inline stock adjustment)
 * - AdminCoupons (Promotional coupons, discount rules, redemption audits)
 * - AdminCustomers (Patron directory, order frequency, lifetime spend)
 * - AdminNotifications (Operational dispatch, stock depletion, alerts)
 * - AdminReviews (Collector testimonials moderation, verified status)
 * - AdminRoles (Multi-admin team, RBAC privileges, invitation)
 * - AdminAuditLogs (Tamper-evident activity trail, CSV/JSON export)
 * - AdminSettings (Financial configurations, database backup/export, factory reset)
 */

import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { useCatalog } from '@/lib/catalogContext';
import { AdminOverview } from './admin/AdminOverview';
import { AdminOrders } from './admin/AdminOrders';
import { AdminProducts } from './admin/AdminProducts';
import { AdminCoupons } from './admin/AdminCoupons';
import { AdminCustomers } from './admin/AdminCustomers';
import { AdminNotifications } from './admin/AdminNotifications';
import { AdminReviews } from './admin/AdminReviews';
import { AdminRoles } from './admin/AdminRoles';
import { AdminAuditLogs } from './admin/AdminAuditLogs';
import { AdminSettings } from './admin/AdminSettings';
import { AdminCommandPalette } from '@/components/admin/AdminCommandPalette';
import { 
  LayoutDashboard, ShoppingCart, Package, Settings, 
  ArrowLeft, Lock, Tag, Users, MessageSquare, 
  ShieldCheck, FileText, LogOut, Bell, Search, 
  PanelLeftClose, PanelLeftOpen, ChevronRight, ExternalLink,
  Menu, X, Palette
} from 'lucide-react';
import { toast } from 'sonner';

export type AdminTab = 
  | 'overview' 
  | 'orders' 
  | 'custom-orders'
  | 'products' 
  | 'coupons' 
  | 'customers' 
  | 'notifications'
  | 'reviews' 
  | 'roles' 
  | 'audit' 
  | 'settings';

export default function Admin() {
  const { 
    isAdmin, loginAdmin, logoutAdmin, currentAdmin, adminRole,
    orders, products 
  } = useCatalog();

  // Authentication Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Ergonomic UI States
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    try {
      return localStorage.getItem('vernox-admin-sidebar-collapsed') === 'true';
    } catch {
      return false;
    }
  });
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // Keyboard shortcut listener for universal Ctrl+K / ⌘K Spotlight search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsCommandPaletteOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (isMobileDrawerOpen) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isMobileDrawerOpen]);

  // Real-time Operational Telemetry Badges
  const pendingOrdersCount = useMemo(() => {
    return orders.filter(o => o.status === 'Pending').length;
  }, [orders]);

  const customOrdersCount = useMemo(() => {
    return orders.filter(o => o.items?.some(i => i.customDesignRef || i.userUploadedImage || i.productId === 'custom-bespoke')).length;
  }, [orders]);

  const lowStockCount = useMemo(() => {
    return products.filter(p => (p.stock ?? 0) <= 5).length;
  }, [products]);

  const urgentAlertsCount = useMemo(() => {
    const outStock = products.filter(p => (p.stock ?? 0) === 0).length;
    const lowStock = products.filter(p => (p.stock ?? 0) > 0 && (p.stock ?? 0) <= 5).length;
    const pending = orders.filter(o => o.status === 'Pending').length;
    return outStock + lowStock + pending;
  }, [products, orders]);

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
        toast.success('Administrative session established');
      } else {
        toast.error('Invalid administrative credentials or insufficient authorization');
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
        <div className="w-full max-w-md bg-card border border-border/80 rounded-xl p-8 shadow-luxe space-y-6 animate-scale-in">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-oxblood/10 border border-oxblood/20 flex items-center justify-center mx-auto text-oxblood mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="font-display text-2xl text-oxblood-deep">Vernox Atelier Portal</h1>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Sign in with authorized administrator credentials to manage CAM production routing, orders, promotions, and enterprise store operations.
            </p>
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
                className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-oxblood transition"
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
                className="w-full bg-background border border-border rounded-lg px-3.5 py-2.5 text-sm outline-none focus:border-oxblood transition"
              />
            </div>

            <button 
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-oxblood text-ivory hover:bg-oxblood-deep font-semibold py-2.5 rounded-lg text-sm transition shadow-soft disabled:opacity-50 mt-2"
            >
              {isAuthenticating ? "Verifying Credentials..." : "Authenticate Administrator"}
            </button>
          </form>

          <div className="text-center pt-2 border-t border-border/60">
            <Link to="/" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition">
              <ArrowLeft className="w-3 h-3" /> Back to Vernox Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Navigation Items Structure
  const navigationSections = [
    {
      title: 'Store',
      items: [
        { id: 'overview' as AdminTab, label: 'Overview', icon: LayoutDashboard },
        { 
          id: 'orders' as AdminTab, 
          label: 'Orders', 
          icon: ShoppingCart, 
          badge: pendingOrdersCount > 0 ? pendingOrdersCount : undefined,
          badgeColor: 'bg-oxblood text-ivory'
        },
        { 
          id: 'custom-orders' as AdminTab, 
          label: 'Custom Orders', 
          icon: Palette, 
          badge: customOrdersCount > 0 ? `${customOrdersCount}` : undefined,
          badgeColor: 'bg-brass/20 text-brass border border-brass/40 font-bold'
        },
        { 
          id: 'products' as AdminTab, 
          label: 'Products', 
          icon: Package, 
          badge: lowStockCount > 0 ? `${lowStockCount} low` : undefined,
          badgeColor: 'bg-amber-500/10 text-amber-600 border border-amber-500/30'
        },
        { id: 'coupons' as AdminTab, label: 'Discounts', icon: Tag },
      ]
    },
    {
      title: 'Customers & Feedback',
      items: [
        { id: 'customers' as AdminTab, label: 'Customers', icon: Users },
        { 
          id: 'notifications' as AdminTab, 
          label: 'Notifications', 
          icon: Bell, 
          badge: urgentAlertsCount > 0 ? urgentAlertsCount : undefined,
          badgeColor: 'bg-oxblood text-ivory'
        },
        { id: 'reviews' as AdminTab, label: 'Reviews', icon: MessageSquare },
      ]
    },
    {
      title: 'Settings',
      items: [
        { id: 'roles' as AdminTab, label: 'Team', icon: ShieldCheck },
        { id: 'audit' as AdminTab, label: 'Activity Log', icon: FileText },
        { id: 'settings' as AdminTab, label: 'Store Settings', icon: Settings },
      ]
    }
  ];

  // Helper for current tab title
  const currentTabInfo = navigationSections
    .flatMap(s => s.items)
    .find(item => item.id === activeTab);

  // 2. Authenticated Admin Dashboard Workspace
  return (
    <div className="h-screen h-[100dvh] bg-background flex flex-col overflow-hidden">
      {/* Universal Command Palette (⌘K) Modal */}
      <AdminCommandPalette 
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsCommandPaletteOpen(false);
        }}
        onSelectOrder={() => {
          setActiveTab('orders');
          setIsCommandPaletteOpen(false);
        }}
        onSelectProduct={() => {
          setActiveTab('products');
          setIsCommandPaletteOpen(false);
        }}
      />

      {/* Top Header Bar */}
      <header className="h-16 bg-card border-b border-border/70 flex items-center justify-between px-3 sm:px-6 relative z-20 shrink-0">
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Mobile Navigation Drawer Toggle */}
          <button
            onClick={() => setIsMobileDrawerOpen(true)}
            className="md:hidden p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition"
            title="Open Navigation"
          >
            <Menu className="w-4 h-4" />
          </button>

          {/* Desktop Sidebar Toggle Button (Open/Close) */}
          <button
            onClick={() => {
              setIsSidebarCollapsed(prev => {
                const next = !prev;
                try { localStorage.setItem('vernox-admin-sidebar-collapsed', String(next)); } catch {}
                return next;
              });
            }}
            className="hidden md:flex p-2 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-muted transition items-center justify-center"
            title={isSidebarCollapsed ? "Open Navigation Sidebar" : "Close Navigation Sidebar"}
          >
            {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4 text-oxblood" /> : <PanelLeftClose className="w-4 h-4" />}
          </button>

          {/* Logo Mark */}
          <div className="w-8 h-8 rounded-md bg-oxblood flex items-center justify-center overflow-hidden text-ivory font-bold text-sm shadow-soft shrink-0">
            V
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-display text-base sm:text-lg text-oxblood-deep leading-none font-bold">
                Vernox Atelier
              </h1>
            </div>
            <div className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
              <span className="hidden xs:inline">Admin Console</span>
              <ChevronRight className="w-2.5 h-2.5 hidden xs:inline" />
              <span className="font-medium text-foreground truncate max-w-[140px] sm:max-w-none">
                {currentTabInfo?.label}
              </span>
            </div>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3.5">
          {/* Universal Search Trigger (⌘K) */}
          <button
            onClick={() => setIsCommandPaletteOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg border border-border bg-background/80 hover:bg-muted text-xs text-muted-foreground transition shadow-2xs group"
            title="Open Command Palette (Ctrl+K or ⌘K)"
          >
            <Search className="w-3.5 h-3.5 text-oxblood shrink-0" />
            <span className="hidden md:inline">Quick search or command...</span>
            <span className="hidden xs:inline md:hidden">Search</span>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 font-mono text-[10px] bg-muted px-1.5 py-0.5 rounded border border-border/70 text-foreground group-hover:border-foreground/30">
              ⌘K
            </kbd>
          </button>

          {/* Quick Notification Bell Trigger */}
          <button
            onClick={() => setActiveTab('notifications')}
            className={`relative p-2 rounded-lg border border-border transition ${
              activeTab === 'notifications' 
                ? 'bg-oxblood/10 text-oxblood border-oxblood/30' 
                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
            }`}
            title="Operational Notifications"
          >
            <Bell className="w-4 h-4" />
            {urgentAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-oxblood text-ivory text-[9px] font-mono font-bold flex items-center justify-center animate-pulse">
                {urgentAlertsCount > 9 ? '9+' : urgentAlertsCount}
              </span>
            )}
          </button>

          <div className="h-4 w-px bg-border hidden sm:block" />

          {/* Storefront Link */}
          <Link 
            to="/" 
            className="text-xs font-medium text-muted-foreground hover:text-foreground hidden lg:inline-flex items-center gap-1.5 transition"
          >
            Storefront <ExternalLink className="w-3 h-3" />
          </Link>

          <div className="h-4 w-px bg-border hidden lg:block" />

          {/* Current Admin Badge & Role */}
          <div className="flex items-center gap-2">
            <div className="text-right hidden md:block">
              <div className="text-xs font-semibold text-foreground leading-tight">
                {currentAdmin?.name || 'Atelier Administrator'}
              </div>
              <div className="text-[10px] font-mono text-muted-foreground leading-tight">
                {currentAdmin?.email || 'admin@vernox.com'}
              </div>
            </div>

            <span className={`text-[10px] font-mono uppercase font-bold px-2 py-0.5 rounded-full border hidden sm:inline-block ${
              adminRole === 'super_admin'
                ? 'bg-oxblood/10 text-oxblood border-oxblood/30'
                : adminRole === 'admin'
                ? 'bg-purple-500/10 text-purple-600 border-purple-500/30'
                : 'bg-blue-500/10 text-blue-600 border-blue-500/30'
            }`}>
              {adminRole.replace('_', ' ')}
            </span>

            <button
              onClick={() => {
                logoutAdmin();
                toast.success('Signed out of administrative console');
              }}
              title="Sign Out"
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout: Fixed Collapsible Sidebar & Content Viewport */}
      <div className="flex flex-1 min-h-0 overflow-hidden relative">
        {/* Desktop Sidebar Navigation - Fixed in Place */}
        <aside 
          className={`bg-card border-r border-border/60 transition-all duration-200 shrink-0 hidden md:flex flex-col justify-between h-full select-none ${
            isSidebarCollapsed ? 'w-16' : 'w-64'
          }`}
        >
          {/* Top Section of Sidebar */}
          <div className="p-3 space-y-4 overflow-y-auto flex-1 min-h-0">
            {/* Collapse / Expand Toggle Button for Desktop */}
            <div className="flex items-center justify-between px-2 pt-1">
              {!isSidebarCollapsed && (
                <span className="text-[11px] font-mono uppercase tracking-wider text-muted-foreground/70 font-semibold">
                  Navigation
                </span>
              )}
              <button
                onClick={() => {
                  setIsSidebarCollapsed(prev => {
                    const next = !prev;
                    try { localStorage.setItem('vernox-admin-sidebar-collapsed', String(next)); } catch {}
                    return next;
                  });
                }}
                className={`p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition ${
                  isSidebarCollapsed ? 'mx-auto' : 'ml-auto'
                }`}
                title={isSidebarCollapsed ? "Open / Expand Sidebar" : "Close / Collapse Sidebar"}
              >
                {isSidebarCollapsed ? <PanelLeftOpen className="w-4 h-4 text-oxblood" /> : <PanelLeftClose className="w-4 h-4" />}
              </button>
            </div>

            {/* Navigation Sections */}
            <nav className="flex flex-col gap-1">
              {navigationSections.map((sec, secIdx) => (
                <div key={secIdx} className="space-y-1">
                  {!isSidebarCollapsed && (
                    <div className="px-2.5 pt-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60 font-semibold">
                      {sec.title}
                    </div>
                  )}

                  {sec.items.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        title={tab.label}
                        className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition font-medium whitespace-nowrap group relative w-full ${
                          isActive 
                            ? 'bg-oxblood text-ivory shadow-soft font-semibold' 
                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                        } ${isSidebarCollapsed ? 'justify-center px-2' : ''}`}
                      >
                        <Icon className="w-4 h-4 shrink-0" />
                        
                        {!isSidebarCollapsed && (
                          <span className="truncate flex-1 text-left">{tab.label}</span>
                        )}

                        {/* Badge Indicator */}
                        {tab.badge && (
                          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                            isSidebarCollapsed 
                              ? 'absolute top-1 right-1 w-2 h-2 p-0 rounded-full bg-oxblood' 
                              : (tab.badgeColor || 'bg-muted text-foreground')
                          }`}>
                            {!isSidebarCollapsed && tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}
            </nav>
          </div>

          {/* Bottom Sidebar User Footprint (Desktop only) */}
          <div className="p-3 border-t border-border/60 bg-muted/20 shrink-0">
            {!isSidebarCollapsed ? (
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-oxblood/10 border border-oxblood/20 flex items-center justify-center font-bold text-xs text-oxblood shrink-0">
                  {currentAdmin?.name ? currentAdmin.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate text-foreground">
                    {currentAdmin?.name || 'Administrator'}
                  </div>
                  <div className="text-[10px] font-mono text-muted-foreground truncate">
                    {currentAdmin?.role || 'Active Session'}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex justify-center" title={currentAdmin?.name || 'Admin'}>
                <div className="w-8 h-8 rounded-full bg-oxblood/10 border border-oxblood/20 flex items-center justify-center font-bold text-xs text-oxblood">
                  {currentAdmin?.name ? currentAdmin.name.charAt(0).toUpperCase() : 'A'}
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Content Viewport */}
        <main className="flex-1 min-w-0 min-h-0 overflow-y-auto p-4 sm:p-6 md:p-8 bg-background-warm">
          {activeTab === 'overview' && (
            <AdminOverview onSelectTab={setActiveTab} />
          )}

          {activeTab === 'orders' && (
            <AdminOrders />
          )}

          {activeTab === 'custom-orders' && (
            <AdminOrders initialFilter="custom" />
          )}

          {activeTab === 'products' && (
            <AdminProducts />
          )}

          {activeTab === 'coupons' && (
            <AdminCoupons />
          )}

          {activeTab === 'customers' && (
            <AdminCustomers />
          )}

          {activeTab === 'notifications' && (
            <AdminNotifications onSelectTab={setActiveTab} />
          )}

          {activeTab === 'reviews' && (
            <AdminReviews />
          )}

          {activeTab === 'roles' && (
            <AdminRoles />
          )}

          {activeTab === 'audit' && (
            <AdminAuditLogs />
          )}

          {activeTab === 'settings' && (
            <AdminSettings />
          )}
        </main>
      </div>

      {/* Mobile Slide-Over Navigation Drawer */}
      {isMobileDrawerOpen && createPortal(
        <div 
          className="fixed inset-0 z-[9995] bg-black/75 backdrop-blur-sm animate-fade-in md:hidden"
          onClick={() => setIsMobileDrawerOpen(false)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="fixed inset-y-0 left-0 w-72 bg-card border-r border-border p-4 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-200 z-[9996]"
          >
            <div className="space-y-4 overflow-y-auto">
              {/* Drawer Header */}
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-oxblood text-ivory font-bold flex items-center justify-center text-xs">
                    V
                  </div>
                  <span className="font-display text-base text-oxblood-deep font-bold">
                    Vernox Atelier
                  </span>
                </div>
                <button 
                  onClick={() => setIsMobileDrawerOpen(false)}
                  className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex flex-col gap-1">
                {navigationSections.map((sec, secIdx) => (
                  <div key={secIdx} className="space-y-1">
                    <div className="px-2 pt-3 pb-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground/60 font-semibold">
                      {sec.title}
                    </div>

                    {sec.items.map(tab => {
                      const Icon = tab.icon;
                      const isActive = activeTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => {
                            setActiveTab(tab.id);
                            setIsMobileDrawerOpen(false);
                          }}
                          className={`flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition font-medium w-full text-left ${
                            isActive 
                              ? 'bg-oxblood text-ivory shadow-soft font-semibold' 
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <Icon className="w-4 h-4 shrink-0" />
                          <span className="truncate flex-1">{tab.label}</span>

                          {tab.badge && (
                            <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded-full shrink-0 ${
                              tab.badgeColor || 'bg-muted text-foreground'
                            }`}>
                              {tab.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </nav>
            </div>

            {/* Drawer Footer User Info */}
            <div className="pt-3 border-t border-border mt-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-full bg-oxblood/10 border border-oxblood/20 flex items-center justify-center font-bold text-xs text-oxblood shrink-0">
                    {currentAdmin?.name ? currentAdmin.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-semibold truncate text-foreground">
                      {currentAdmin?.name || 'Administrator'}
                    </div>
                    <div className="text-[10px] font-mono text-muted-foreground truncate">
                      {adminRole.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setIsMobileDrawerOpen(false);
                    logoutAdmin();
                  }}
                  className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition"
                  title="Sign Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
