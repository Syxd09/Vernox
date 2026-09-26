/**
 * Admin Overview Dashboard View
 * Features: Atelier telemetry, revenue charts, popular finishes distribution,
 * pipeline status breakdown, and recent orders summary.
 */

import { useMemo } from 'react';
import { useCatalog, Order, OrderStatus } from '@/lib/catalogContext';
import { 
  Sparkles, ShoppingCart, Tag, Scissors, Clock, Eye 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip as ChartTooltip, ResponsiveContainer, 
  BarChart, Bar, PieChart, Pie, Cell 
} from 'recharts';

const PIE_COLORS = ['#6b1e28', '#d9b382', '#9aa0a6', '#4a4a4a', '#a47a2a', '#7a3a1a', '#3f3f46'];

interface AdminOverviewProps {
  onSelectTab: (tab: any) => void;
  onSelectOrder?: (order: Order) => void;
}

export function AdminOverview({ onSelectTab, onSelectOrder }: AdminOverviewProps) {
  const { orders, storeConfig } = useCatalog();

  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, order) => sum + order.total, 0);
  }, [orders]);

  const avgOrderValue = useMemo(() => {
    return orders.length > 0 ? totalRevenue / orders.length : 0;
  }, [orders, totalRevenue]);

  const pendingOrdersCount = useMemo(() => {
    return orders.filter(o => o.status === 'Pending' || o.status === 'Designing' || o.status === 'Cutting').length;
  }, [orders]);

  // Revenue trend (last 7 days)
  const revenueTrendData = useMemo(() => {
    const days: { date: string; amount: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const dayOrders = orders.filter(o => {
        const od = new Date(o.placedAt || o.createdAt || Date.now());
        return od.getDate() === d.getDate() && od.getMonth() === d.getMonth();
      });
      const dayTotal = dayOrders.reduce((s, o) => s + o.total, 0);
      days.push({ date: dateStr, amount: dayTotal });
    }
    return days;
  }, [orders]);

  // Popular Finishes
  const popularityData = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach(o => {
      o.items.forEach(i => {
        const finish = i.finish || 'mild_steel';
        counts[finish] = (counts[finish] || 0) + i.quantity;
      });
    });
    return Object.entries(counts).map(([name, count]) => ({
      name: name.replace(/_/g, ' ').toUpperCase(),
      count,
    })).sort((a, b) => b.count - a.count);
  }, [orders]);

  // Fulfillment Pipeline
  const pipelineData = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach(o => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [orders]);

  const renderStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">Pending</span>;
      case 'Paid': return <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">Paid</span>;
      case 'Designing': return <span className="bg-blue-500/10 text-blue-500 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">Designing</span>;
      case 'Cutting': return <span className="bg-purple-500/10 text-purple-500 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">Cutting</span>;
      case 'Finished': return <span className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">Finished</span>;
      case 'Shipped': return <span className="bg-oxblood/10 text-oxblood border border-oxblood/20 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">Shipped</span>;
      case 'Delivered': return <span className="bg-green-600/10 text-green-600 border border-green-600/20 px-2 py-0.5 rounded text-[10px] font-semibold uppercase">Delivered</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-oxblood-deep">Atelier Overview</h2>
          <p className="text-muted-foreground text-sm">Key statistics and recent storefront activity.</p>
        </div>
        <div className="bg-card border border-border/60 rounded-lg px-4 py-2 text-xs font-mono text-muted-foreground shadow-soft flex items-center gap-2">
          <Clock className="w-3.5 h-3.5 text-brass" />
          Live telemetry · {new Date().toLocaleDateString()}
        </div>
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `${storeConfig.currency}${totalRevenue.toFixed(2)}`, desc: 'From verified orders', icon: Sparkles, color: 'text-yellow-600 bg-yellow-500/10' },
          { label: 'Total Orders', value: orders.length, desc: 'Processed in platform', icon: ShoppingCart, color: 'text-oxblood bg-oxblood/10' },
          { label: 'Avg. Order Value', value: `${storeConfig.currency}${avgOrderValue.toFixed(2)}`, desc: 'Average cart size', icon: Tag, color: 'text-purple-600 bg-purple-500/10' },
          { label: 'Pending Production', value: pendingOrdersCount, desc: 'Waiting in studio / shop', icon: Scissors, color: 'text-blue-600 bg-blue-500/10' },
        ].map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="bg-card border border-border/50 rounded-lg p-5 shadow-soft hover:border-oxblood/20 transition-all">
              <div className="flex justify-between items-start">
                <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">{stat.label}</span>
                <div className={`p-2 rounded ${stat.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="font-display text-3xl text-oxblood-deep mt-2">{stat.value}</div>
              <div className="text-xs text-muted-foreground mt-1">{stat.desc}</div>
            </div>
          );
        })}
      </div>

      {/* CHARTS CONTAINER GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Revenue Area Chart */}
        <div className="bg-card border border-border/50 p-6 rounded-lg shadow-soft">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Revenue Trend (Last 7 Days)</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueTrendData}>
                <defs>
                  <linearGradient id="colorAmt" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6b1e28" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#6b1e28" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `${storeConfig.currency}${v}`} />
                <ChartTooltip formatter={(v) => [`${storeConfig.currency}${Number(v).toFixed(2)}`, 'Revenue']} />
                <Area type="monotone" dataKey="amount" stroke="#6b1e28" strokeWidth={2} fillOpacity={1} fill="url(#colorAmt)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Popular Finishes Bar Chart */}
        <div className="bg-card border border-border/50 p-6 rounded-lg shadow-soft">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Popular Finish Materials (Units Sold)</h3>
          <div className="h-64">
            {popularityData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground font-mono">No order items data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={popularityData} layout="vertical">
                  <XAxis type="number" stroke="#888888" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis dataKey="name" type="category" stroke="#888888" fontSize={9} tickLine={false} axisLine={false} width={110} />
                  <ChartTooltip formatter={(v) => [v, 'Units Sold']} />
                  <Bar dataKey="count" fill="#d9b382" radius={[0, 4, 4, 0]}>
                    {popularityData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* 3. Pipeline Pie Chart */}
        <div className="bg-card border border-border/50 p-6 rounded-lg shadow-soft lg:col-span-2">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">Fulfillment Status Pipeline Distribution</h3>
          <div className="grid md:grid-cols-[1fr_200px] gap-6 items-center">
            <div className="h-56">
              {pipelineData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-xs text-muted-foreground font-mono">No orders placed</div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pipelineData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pipelineData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <ChartTooltip formatter={(v) => [v, 'Orders']} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
            <div className="space-y-2">
              <div className="text-xs uppercase tracking-widest text-muted-foreground/60 font-bold mb-2">Legend</div>
              {pipelineData.map((item, idx) => (
                <div key={item.name} className="flex items-center gap-2 text-xs font-medium">
                  <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  <span className="capitalize">{item.name}</span>
                  <span className="text-muted-foreground font-mono ml-auto">({item.value})</span>
                </div>
              ))}
              {pipelineData.length === 0 && <div className="text-xs text-muted-foreground">No orders to display</div>}
            </div>
          </div>
        </div>
      </div>

      {/* ACTIVE RECENT ORDERS */}
      <div className="bg-card border border-border/50 rounded-lg shadow-soft overflow-hidden">
        <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between">
          <h3 className="font-display text-xl text-oxblood-deep">Active Atelier Orders</h3>
          <button onClick={() => onSelectTab('orders')} className="text-xs uppercase tracking-widest text-brass hover:underline font-semibold">View All Orders →</button>
        </div>
        {orders.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground text-sm">
            No orders processed yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
                <tr>
                  <th className="px-6 py-3 font-semibold">Order ID</th>
                  <th className="px-6 py-3 font-semibold">Customer</th>
                  <th className="px-6 py-3 font-semibold">Items Count</th>
                  <th className="px-6 py-3 font-semibold">Total Price</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {orders.slice(-5).reverse().map(o => (
                  <tr key={o.id} className="hover:bg-muted/10 transition-colors">
                    <td className="px-6 py-4 font-mono font-medium text-brass">{o.id}</td>
                    <td className="px-6 py-4 text-muted-foreground">{o.email}</td>
                    <td className="px-6 py-4">{o.items.reduce((sum, item) => sum + item.quantity, 0)}</td>
                    <td className="px-6 py-4 font-medium">{storeConfig.currency}{o.total.toFixed(2)}</td>
                    <td className="px-6 py-4">{renderStatusBadge(o.status)}</td>
                    <td className="px-6 py-4 text-right">
                      <button 
                        onClick={() => onSelectTab('orders')}
                        className="inline-flex items-center gap-1 bg-muted hover:bg-border text-xs px-2.5 py-1.5 rounded transition"
                      >
                        <Eye className="w-3.5 h-3.5" /> View / Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
