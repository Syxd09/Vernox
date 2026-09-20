/**
 * Admin Orders Management View
 * Features: Order pipeline tracker, status updater, shipping details editor,
 * and 1-Click Industrial CAM Downloads (AutoCAD 2000 DXF, 1:1 Metric Vector SVG, and Workshop Spec Sheet PDF).
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCatalog, Order, OrderStatus, OrderItem } from '@/lib/catalogContext';
import { exportDocumentAsSVG, exportDocumentAsDXF, exportDocumentAsPDF } from '@/lib/exportCAM';
import { getShapeById } from '@/lib/shapes';
import type { VectorDocument } from '@/lib/cadEngineTypes';
import { 
  ShoppingCart, Package, Scissors, Truck, Clock, Eye, Trash2, 
  Search, X, Sparkles, Download, FileCode, FileText
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminOrders() {
  const { orders, updateOrderStatus, updateOrder, deleteOrder, storeConfig } = useCatalog();
  const navigate = useNavigate();

  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const [orderTrackingForm, setOrderTrackingForm] = useState({
    shippingName: '',
    shippingAddress: '',
    shippingCity: '',
    shippingZip: '',
    shippingCountry: 'United States',
    trackingCarrier: '',
    trackingNumber: '',
    estimatedDelivery: '',
    adminNotes: ''
  });

  const filteredOrders = useMemo(() => {
    return orders
      .filter(o => {
        const customerName = o.shippingName || (typeof (o as any).shippingAddress === 'object' ? (o as any).shippingAddress?.name : '');
        const matchesSearch = 
          o.id.toLowerCase().includes(orderSearch.toLowerCase()) || 
          o.email.toLowerCase().includes(orderSearch.toLowerCase()) ||
          (customerName && customerName.toLowerCase().includes(orderSearch.toLowerCase()));
        const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        const timeA = a.placedAt || new Date((a as any).createdAt || 0).getTime();
        const timeB = b.placedAt || new Date((b as any).createdAt || 0).getTime();
        return timeB - timeA;
      });
  }, [orders, orderSearch, orderStatusFilter]);

  const handleOpenOrder = (order: Order) => {
    setSelectedOrder(order);
    setOrderTrackingForm({
      shippingName: order.shippingName || (typeof (order as any).shippingAddress === 'object' ? (order as any).shippingAddress?.name : '') || '',
      shippingAddress: (typeof order.shippingAddress === 'string' ? order.shippingAddress : (order as any).shippingAddress?.line1) || '',
      shippingCity: order.shippingCity || (typeof (order as any).shippingAddress === 'object' ? (order as any).shippingAddress?.city : '') || '',
      shippingZip: order.shippingZip || (typeof (order as any).shippingAddress === 'object' ? (order as any).shippingAddress?.postalCode : '') || '',
      shippingCountry: order.shippingCountry || (typeof (order as any).shippingAddress === 'object' ? (order as any).shippingAddress?.country : '') || 'India',
      trackingCarrier: order.trackingCarrier || (order as any).tracking?.carrier || '',
      trackingNumber: order.trackingNumber || (order as any).tracking?.trackingNumber || '',
      estimatedDelivery: order.estimatedDelivery || (order as any).tracking?.estimatedDelivery || '',
      adminNotes: order.adminNotes || ''
    });
  };

  const handleSaveOrderTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrder) return;

    updateOrder(selectedOrder.id, {
      shippingName: orderTrackingForm.shippingName,
      shippingAddress: orderTrackingForm.shippingAddress,
      shippingCity: orderTrackingForm.shippingCity,
      shippingZip: orderTrackingForm.shippingZip,
      shippingCountry: orderTrackingForm.shippingCountry,
      trackingCarrier: orderTrackingForm.trackingCarrier,
      trackingNumber: orderTrackingForm.trackingNumber,
      estimatedDelivery: orderTrackingForm.estimatedDelivery,
      adminNotes: orderTrackingForm.adminNotes
    });

    toast.success('Order shipping details updated');
    setSelectedOrder(prev => prev ? {
      ...prev,
      shippingName: orderTrackingForm.shippingName,
      shippingAddress: orderTrackingForm.shippingAddress,
      shippingCity: orderTrackingForm.shippingCity,
      shippingZip: orderTrackingForm.shippingZip,
      shippingCountry: orderTrackingForm.shippingCountry,
      trackingCarrier: orderTrackingForm.trackingCarrier,
      trackingNumber: orderTrackingForm.trackingNumber,
      estimatedDelivery: orderTrackingForm.estimatedDelivery,
      adminNotes: orderTrackingForm.adminNotes
    } : null);
  };

  const downloadCAMAsset = (orderId: string, item: OrderItem, format: 'dxf' | 'svg' | 'pdf') => {
    let doc: VectorDocument | null = null;
    if (item.customDesignRef) {
      try {
        const parsed = JSON.parse(item.customDesignRef);
        if (parsed.boundary && parsed.material) {
          doc = parsed;
        } else {
          // Construct VDM from project state
          const shape = getShapeById(parsed.selectedShapeId || item.shapeId || 'rectangle');
          const w = parsed.shapeWidth || item.widthMm || 300;
          const h = parsed.shapeHeight || item.heightMm || 200;
          const path = shape ? shape.getPath(w, h) : `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`;
          doc = {
            id: `doc-${orderId}`,
            version: '3.0.0',
            unit: 'mm',
            boundary: {
              shapeId: parsed.selectedShapeId || item.shapeId || 'rectangle',
              widthMm: w,
              heightMm: h,
              cornerRadiusMm: parsed.shapeCornerRadius || 0,
              pathData: path,
            },
            material: {
              substrate: 'mild_steel',
              finish: item.finish || 'black_patina',
              thicknessMm: parsed.metalThickness || 3.0,
              activeGaugeParams: {
                gaugeName: '3.0mm Plate',
                thicknessMm: 3.0,
                kerfWidthMm: 0.22,
                feedRateMmMin: 2200,
                dwellTimeMs: 350,
                minHoleDiameterMm: 3.0,
                minWebWidthMm: 2.5,
                minEdgeClearanceMm: 4.0,
              },
            },
            layers: [],
            manufacturingAnalytics: {
              totalCutLengthMm: (w + h) * 2,
              totalPierceCount: 1,
              estimatedCutTimeSec: 20,
              partWeightKg: 1.2,
              scrapPercentage: 15,
              boundingWidthMm: w,
              boundingHeightMm: h,
              isManufacturable: true,
            },
            validationIssues: [],
          };
        }
      } catch (e) {
        console.error('Failed to parse design ref', e);
      }
    }

    if (!doc) {
      const shape = getShapeById(item.shapeId || 'rectangle');
      const w = item.widthMm || 300;
      const h = item.heightMm || 200;
      const path = shape ? shape.getPath(w, h) : `M 0 0 L ${w} 0 L ${w} ${h} L 0 ${h} Z`;
      doc = {
        id: `doc-${orderId}`,
        version: '3.0.0',
        unit: 'mm',
        boundary: {
          shapeId: item.shapeId || 'rectangle',
          widthMm: w,
          heightMm: h,
          cornerRadiusMm: 0,
          pathData: path,
        },
        material: {
          substrate: 'mild_steel',
          finish: item.finish || 'black_patina',
          thicknessMm: 3.0,
          activeGaugeParams: {
            gaugeName: '3.0mm Plate',
            thicknessMm: 3.0,
            kerfWidthMm: 0.22,
            feedRateMmMin: 2200,
            dwellTimeMs: 350,
            minHoleDiameterMm: 3.0,
            minWebWidthMm: 2.5,
            minEdgeClearanceMm: 4.0,
          },
        },
        layers: [],
        manufacturingAnalytics: {
          totalCutLengthMm: (w + h) * 2,
          totalPierceCount: 1,
          estimatedCutTimeSec: 20,
          partWeightKg: 1.2,
          scrapPercentage: 15,
          boundingWidthMm: w,
          boundingHeightMm: h,
          isManufacturable: true,
        },
        validationIssues: [],
      };
    }

    if (format === 'dxf') {
      const dxf = exportDocumentAsDXF(doc);
      const blob = new Blob([dxf], { type: 'application/dxf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${orderId}-${item.productSlug || 'vernox'}.dxf`;
      a.click();
      toast.success('Downloaded AutoCAD 2000 AC1015 DXF Toolpath');
    } else if (format === 'svg') {
      const svg = exportDocumentAsSVG(doc, { applyKerfOffset: true });
      const blob = new Blob([svg], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${orderId}-${item.productSlug || 'vernox'}.svg`;
      a.click();
      toast.success('Downloaded 1:1 Metric Vector SVG');
    } else if (format === 'pdf') {
      const pdf = exportDocumentAsPDF(doc, { orderNumber: orderId });
      pdf.save(`${orderId}-spec-sheet.pdf`);
      toast.success('Downloaded Workshop Spec Sheet PDF');
    }
  };

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
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="font-display text-3xl text-oxblood-deep">Order Fulfillment & CAM Routing</h2>
        <p className="text-muted-foreground text-sm">Download CNC laser DXF/SVG packages, generate workshop spec sheets, and track shipping.</p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between bg-card border border-border/50 p-4 rounded-lg shadow-soft">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-2.5" />
          <input 
            type="text"
            value={orderSearch}
            onChange={e => setOrderSearch(e.target.value)}
            placeholder="Search by Order ID, Customer Email, or Recipient..."
            className="w-full bg-background border border-border rounded pl-9 pr-4 py-1.5 text-xs outline-none focus:border-oxblood"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={orderStatusFilter}
            onChange={e => setOrderStatusFilter(e.target.value)}
            className="bg-background border border-border rounded px-3 py-1.5 text-xs outline-none focus:border-oxblood"
          >
            <option value="all">All Pipeline Stages</option>
            <option value="Pending">Pending</option>
            <option value="Paid">Paid</option>
            <option value="Designing">Designing</option>
            <option value="Cutting">Cutting</option>
            <option value="Finished">Finished</option>
            <option value="Shipped">Shipped</option>
            <option value="Delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-3">
        {filteredOrders.length === 0 ? (
          <div className="bg-card border border-border/50 p-12 text-center rounded-lg text-muted-foreground text-sm">
            No orders match the current search filters.
          </div>
        ) : (
          filteredOrders.map(order => (
            <div 
              key={order.id} 
              className="bg-card border border-border/50 rounded-lg p-5 shadow-soft flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-oxblood/30 transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm font-bold text-oxblood-deep">{order.id}</span>
                  {renderStatusBadge(order.status)}
                </div>
                <div className="text-xs text-muted-foreground">
                  <span>Customer: </span>
                  <span className="font-semibold text-foreground">{order.email}</span>
                  <span className="mx-2">·</span>
                  <span>Items: {order.items.reduce((s, i) => s + i.quantity, 0)}</span>
                  <span className="mx-2">·</span>
                  <span>{new Date(order.placedAt || (order as any).createdAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              </div>

              <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                <div className="font-display text-xl font-bold text-oxblood-deep">
                  {storeConfig.currency}{order.total.toFixed(2)}
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                    className="bg-background border border-border rounded px-2.5 py-1.5 text-xs outline-none focus:border-oxblood font-semibold"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Designing">Designing</option>
                    <option value="Cutting">Cutting</option>
                    <option value="Finished">Finished</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                  </select>

                  <button
                    onClick={() => handleOpenOrder(order)}
                    className="inline-flex items-center gap-1.5 bg-oxblood text-ivory px-3 py-1.5 rounded text-xs hover:bg-oxblood-deep transition font-semibold"
                  >
                    <Eye className="w-3.5 h-3.5" /> Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Order Detail Modal with 1-Click CAM Downloads */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-card border border-border shadow-luxe max-w-4xl w-full rounded-lg overflow-hidden flex flex-col max-h-[92vh]">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-muted/40 border-b border-border/80 flex justify-between items-center">
              <div>
                <h4 className="font-display text-xl text-oxblood-deep">Fulfillment & CAM Dispatch</h4>
                <p className="text-xs font-mono text-brass">{selectedOrder.id}</p>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)} 
                className="p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 overflow-y-auto flex-1 grid md:grid-cols-2 gap-6">
              {/* Left Column: Ordered Items & CAM Assets */}
              <div className="space-y-6">
                <div className="space-y-4">
                  <h5 className="font-semibold text-oxblood border-b border-border/50 pb-2 flex items-center gap-2 text-sm">
                    <Package className="w-4 h-4" /> Ordered Items & Laser Toolpaths
                  </h5>

                  {selectedOrder.items.map(item => (
                    <div key={item.id} className="p-4 bg-background border border-border rounded-lg space-y-3">
                      <div className="flex gap-3 items-center">
                        {item.customDesignThumb ? (
                          <img 
                            src={item.customDesignThumb} 
                            alt="Custom composite" 
                            className="w-16 h-16 object-contain bg-slate-950 border border-border rounded p-1" 
                          />
                        ) : (
                          <div className="w-16 h-16 bg-muted/40 border border-border rounded flex items-center justify-center">
                            <Package className="w-8 h-8 text-brass/50" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-oxblood-deep truncate text-sm">{item.productName}</div>
                          <div className="text-xs text-muted-foreground capitalize mt-0.5">
                            {item.finish} · {item.sizeLabel}
                          </div>
                          <div className="text-xs font-mono text-muted-foreground mt-1">
                            {storeConfig.currency}{item.unitPrice.toFixed(2)} × {item.quantity}
                          </div>
                        </div>
                      </div>

                      {/* 1-Click CAM Exporters Bar */}
                      <div className="pt-2 border-t border-border/60 flex flex-wrap gap-1.5">
                        <button
                          onClick={() => downloadCAMAsset(selectedOrder.id, item, 'dxf')}
                          className="inline-flex items-center gap-1 bg-slate-900 text-slate-100 hover:bg-slate-800 border border-slate-700 px-2 py-1 rounded text-[10px] font-mono font-medium transition"
                          title="Download AutoCAD 2000 AC1015 DXF with closed LWPOLYLINE"
                        >
                          <Scissors className="w-3 h-3 text-red-400" />
                          <span>Laser DXF</span>
                        </button>

                        <button
                          onClick={() => downloadCAMAsset(selectedOrder.id, item, 'svg')}
                          className="inline-flex items-center gap-1 bg-slate-900 text-slate-100 hover:bg-slate-800 border border-slate-700 px-2 py-1 rounded text-[10px] font-mono font-medium transition"
                          title="Download 1:1 Metric Vector SVG"
                        >
                          <FileCode className="w-3 h-3 text-cyan-400" />
                          <span>Vector SVG</span>
                        </button>

                        <button
                          onClick={() => downloadCAMAsset(selectedOrder.id, item, 'pdf')}
                          className="inline-flex items-center gap-1 bg-slate-900 text-slate-100 hover:bg-slate-800 border border-slate-700 px-2 py-1 rounded text-[10px] font-mono font-medium transition"
                          title="Download Workshop Spec Sheet PDF Traveler"
                        >
                          <FileText className="w-3 h-3 text-amber-400" />
                          <span>Spec PDF</span>
                        </button>

                        {item.customDesignRef && item.customDesignRef.startsWith('{') && (
                          <button
                            onClick={() => {
                              localStorage.setItem('vernox-custom-inspect', item.customDesignRef!);
                              setSelectedOrder(null);
                              navigate('/customize');
                            }}
                            className="inline-flex items-center gap-1 bg-oxblood text-ivory px-2 py-1 rounded text-[10px] uppercase tracking-wider hover:bg-oxblood-deep transition font-semibold ml-auto"
                          >
                            <Sparkles className="w-3 h-3 text-brass" /> Studio
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Summary Card */}
                <div className="bg-muted/20 border border-border/40 p-4 rounded-lg text-xs space-y-2">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Fulfillment Status</span>
                    <span>{renderStatusBadge(selectedOrder.status)}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Customer Account</span>
                    <span className="font-semibold text-foreground">{selectedOrder.email}</span>
                  </div>
                  <div className="flex justify-between font-display text-lg font-bold border-t border-border/50 pt-2 text-oxblood-deep">
                    <span>Total Charge</span>
                    <span>{storeConfig.currency}{selectedOrder.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Right Column: Shipping & Tracking Dispatch */}
              <form onSubmit={handleSaveOrderTracking} className="space-y-4 border-l border-border/40 pl-0 md:pl-6">
                <h5 className="font-semibold text-oxblood border-b border-border/50 pb-2 flex items-center gap-2 text-sm">
                  <Truck className="w-4 h-4" /> Shipping & Tracking Details
                </h5>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Recipient Name</label>
                  <input 
                    type="text"
                    value={orderTrackingForm.shippingName}
                    onChange={e => setOrderTrackingForm({ ...orderTrackingForm, shippingName: e.target.value })}
                    placeholder="Customer Full Name"
                    className="w-full bg-background border border-border rounded px-3 py-1.5 text-xs outline-none focus:border-oxblood"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Street Address</label>
                  <input 
                    type="text"
                    value={orderTrackingForm.shippingAddress}
                    onChange={e => setOrderTrackingForm({ ...orderTrackingForm, shippingAddress: e.target.value })}
                    placeholder="Address details"
                    className="w-full bg-background border border-border rounded px-3 py-1.5 text-xs outline-none focus:border-oxblood"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">City</label>
                    <input 
                      type="text"
                      value={orderTrackingForm.shippingCity}
                      onChange={e => setOrderTrackingForm({ ...orderTrackingForm, shippingCity: e.target.value })}
                      className="w-full bg-background border border-border rounded px-3 py-1.5 text-xs outline-none focus:border-oxblood"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">ZIP / Postal</label>
                    <input 
                      type="text"
                      value={orderTrackingForm.shippingZip}
                      onChange={e => setOrderTrackingForm({ ...orderTrackingForm, shippingZip: e.target.value })}
                      className="w-full bg-background border border-border rounded px-3 py-1.5 text-xs outline-none focus:border-oxblood"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border/40">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Tracking Carrier</label>
                    <input 
                      type="text"
                      value={orderTrackingForm.trackingCarrier}
                      onChange={e => setOrderTrackingForm({ ...orderTrackingForm, trackingCarrier: e.target.value })}
                      placeholder="e.g. DHL, FedEx"
                      className="w-full bg-background border border-border rounded px-3 py-1.5 text-xs outline-none focus:border-oxblood"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Tracking Code</label>
                    <input 
                      type="text"
                      value={orderTrackingForm.trackingNumber}
                      onChange={e => setOrderTrackingForm({ ...orderTrackingForm, trackingNumber: e.target.value })}
                      placeholder="Tracking number string"
                      className="w-full bg-background border border-border rounded px-3 py-1.5 text-xs outline-none focus:border-oxblood"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Estimated Delivery Date</label>
                  <input 
                    type="text"
                    value={orderTrackingForm.estimatedDelivery}
                    onChange={e => setOrderTrackingForm({ ...orderTrackingForm, estimatedDelivery: e.target.value })}
                    placeholder="e.g. July 24, 2026"
                    className="w-full bg-background border border-border rounded px-3 py-1.5 text-xs outline-none focus:border-oxblood"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground">Workshop Routing Notes</label>
                  <textarea 
                    rows={2}
                    value={orderTrackingForm.adminNotes}
                    onChange={e => setOrderTrackingForm({ ...orderTrackingForm, adminNotes: e.target.value })}
                    placeholder="Enter laser operator or quality inspection notes..."
                    className="w-full bg-background border border-border rounded px-3 py-1.5 text-xs outline-none focus:border-oxblood resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-oxblood text-ivory hover:bg-oxblood-deep font-semibold py-2 rounded text-xs transition"
                >
                  Save Dispatch & Tracking
                </button>
              </form>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-muted/20 border-t border-border/80 flex justify-between gap-3">
              <button
                onClick={() => {
                  if (confirm('Delete this order permanently?')) {
                    deleteOrder(selectedOrder.id);
                    setSelectedOrder(null);
                    toast.success('Order deleted');
                  }
                }}
                className="inline-flex items-center gap-1 text-xs text-destructive hover:underline font-semibold"
              >
                <Trash2 className="w-3.5 h-3.5" /> Delete Order
              </button>
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-muted hover:bg-border px-5 py-2 rounded text-xs font-semibold"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
