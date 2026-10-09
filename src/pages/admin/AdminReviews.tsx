/**
 * Enterprise Admin Reviews Moderation View
 * Features: Patron testimonials moderation, verification badges,
 * spotlight featured toggles, and deletion controls.
 */

import { useState, useMemo } from 'react';
import { useCatalog } from '@/lib/catalogContext';
import type { Review } from '@/lib/catalogContext';
import { 
  Star, Search, Trash2, CheckCircle2, ShieldCheck, 
  MessageSquare, Plus, Eye, AlertTriangle, X
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminReviews() {
  const { reviews, products, addReview, deleteReview } = useCatalog();
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingReview, setDeletingReview] = useState<Review | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const [form, setForm] = useState({
    productId: products[0]?.id || 'prod-01',
    customerName: '',
    customerRole: '',
    location: '',
    rating: 5,
    comment: '',
    verified: true,
    featured: false,
  });

  const filteredReviews = useMemo(() => {
    return reviews.filter(r => {
      const q = searchQuery.toLowerCase();
      return (
        r.customerName?.toLowerCase().includes(q) ||
        r.comment?.toLowerCase().includes(q) ||
        r.location?.toLowerCase().includes(q)
      );
    });
  }, [reviews, searchQuery]);

  const handleCreateReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.customerName.trim() || !form.comment.trim()) {
      toast.error('Customer name and comment are required');
      return;
    }

    await addReview({
      productId: form.productId,
      customerName: form.customerName.trim(),
      customerRole: form.customerRole.trim() || undefined,
      location: form.location.trim() || undefined,
      rating: Number(form.rating),
      comment: form.comment.trim(),
      verified: form.verified,
      featured: form.featured,
      placedAt: Date.now(),
    });

    toast.success('Testimonial added to product reviews');
    setIsAddOpen(false);
  };

  const handleConfirmDelete = async () => {
    if (!deletingReview) return;
    await deleteReview(deletingReview.id);
    toast.success('Review removed');
    setDeletingReview(null);
  };

  const getProductName = (pId: string) => {
    return products.find(p => p.id === pId)?.name || pId;
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-oxblood-deep">Customer Reviews</h2>
          <p className="text-muted-foreground text-sm">
            Manage and moderate customer product reviews and ratings.
          </p>
        </div>

        <button
          onClick={() => setIsAddOpen(true)}
          className="inline-flex items-center gap-2 bg-oxblood text-ivory hover:bg-oxblood-deep px-4 py-2.5 rounded-lg text-sm font-semibold transition shadow-soft shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add Review</span>
        </button>
      </div>

      {/* Search */}
      <div className="bg-card border border-border/70 rounded-xl p-4 shadow-soft">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search reviews by name or text..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-background border border-border rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-oxblood transition"
          />
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-card border border-border/70 rounded-xl overflow-hidden shadow-soft">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="p-4">Customer & Product</th>
                <th className="p-4">Rating</th>
                <th className="p-4">Comment</th>
                <th className="p-4">Badges</th>
                <th className="p-4">Date</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredReviews.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-muted-foreground">
                    <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground/40 mb-2" />
                    <p className="font-medium text-foreground">No customer reviews found</p>
                  </td>
                </tr>
              ) : (
                filteredReviews.map(r => (
                  <tr key={r.id} className="hover:bg-muted/20 transition group">
                    <td className="p-4">
                      <div className="font-semibold text-foreground text-xs">{r.customerName}</div>
                      {r.location && <div className="text-[11px] text-muted-foreground">{r.location}</div>}
                      <div className="text-[11px] font-mono text-oxblood mt-0.5">
                        {getProductName(r.productId)}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-current' : 'text-muted-foreground/30'}`} 
                          />
                        ))}
                      </div>
                    </td>

                    <td className="p-4 max-w-md">
                      <p className="text-xs text-foreground/90 line-clamp-2 leading-relaxed">
                        "{r.comment}"
                      </p>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {r.verified && (
                          <span className="bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded text-[10px] font-semibold flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3" /> Verified Purchaser
                          </span>
                        )}
                        {r.featured && (
                          <span className="bg-oxblood/10 text-oxblood border border-oxblood/20 px-2 py-0.5 rounded text-[10px] font-semibold">
                            Spotlight
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-4 text-xs text-muted-foreground whitespace-nowrap">
                      {new Date(r.placedAt).toLocaleDateString()}
                    </td>

                    <td className="p-4 text-right">
                      <button
                        onClick={() => setDeletingReview(r)}
                        className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition"
                        title="Delete Review"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD TESTIMONIAL MODAL */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-border rounded-xl w-full max-w-lg p-6 shadow-luxe space-y-4 animate-scale-in">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-lg text-oxblood-deep">Add Collector Testimonial</h3>
              <button 
                onClick={() => setIsAddOpen(false)} 
                className="text-muted-foreground hover:text-foreground p-1 rounded hover:bg-muted transition"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateReview} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product Target</label>
                <select
                  value={form.productId}
                  onChange={e => setForm({ ...form, productId: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm outline-none focus:border-oxblood transition"
                >
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Henrik De Vries"
                    value={form.customerName}
                    onChange={e => setForm({ ...form, customerName: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm outline-none focus:border-oxblood transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Brussels, Belgium"
                    value={form.location}
                    onChange={e => setForm({ ...form, location: e.target.value })}
                    className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm outline-none focus:border-oxblood transition"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Star Rating</label>
                <select
                  value={form.rating}
                  onChange={e => setForm({ ...form, rating: Number(e.target.value) })}
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm outline-none focus:border-oxblood transition"
                >
                  <option value={5}>5 Stars - Flawless</option>
                  <option value={4}>4 Stars - Exquisite</option>
                  <option value={3}>3 Stars - Satisfactory</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Review Content *</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Collector feedback regarding the finish, tolerances, and presentation..."
                  value={form.comment}
                  onChange={e => setForm({ ...form, comment: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm outline-none focus:border-oxblood transition"
                />
              </div>

              <div className="flex items-center gap-4 pt-1">
                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.verified}
                    onChange={e => setForm({ ...form, verified: e.target.checked })}
                    className="rounded border-border accent-oxblood"
                  />
                  <span>Verified Purchaser</span>
                </label>

                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={e => setForm({ ...form, featured: e.target.checked })}
                    className="rounded border-border accent-oxblood"
                  />
                  <span>Spotlight Featured</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-ivory bg-oxblood hover:bg-oxblood-deep rounded-lg transition shadow-soft"
                >
                  Save Testimonial
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE MODAL */}
      {deletingReview && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-card border border-destructive/30 rounded-xl w-full max-w-md p-6 shadow-luxe space-y-4 animate-scale-in">
            <div className="flex items-center gap-3 text-destructive">
              <AlertTriangle className="w-6 h-6" />
              <div>
                <h3 className="font-display text-lg text-foreground">Remove Review</h3>
                <p className="text-xs text-muted-foreground">Irreversible action</p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground">
              Are you sure you want to delete the review by <strong>{deletingReview.customerName}</strong>?
            </p>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setDeletingReview(null)}
                className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-lg transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 text-xs font-semibold text-ivory bg-destructive hover:bg-destructive/90 rounded-lg transition shadow-soft"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
