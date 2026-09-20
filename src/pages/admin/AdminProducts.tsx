/**
 * Admin Products & Categories Management View
 * Features: Product catalog table, filtering, Add/Edit product modal,
 * and Category definition manager.
 */

import { useState } from 'react';
import { useCatalog, Product } from '@/lib/catalogContext';
import { finishLabels } from '@/lib/catalog';
import { shapeDefinitions } from '@/lib/shapes';
import { 
  Package, Plus, Edit2, Trash2, Search, X 
} from 'lucide-react';
import { toast } from 'sonner';

export function AdminProducts() {
  const { 
    products, categories, storeConfig, 
    addProduct, updateProduct, deleteProduct 
  } = useCatalog();

  const [productSearch, setProductSearch] = useState('');
  const [productCatFilter, setProductCatFilter] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>({
    slug: '',
    name: '',
    tagline: '',
    description: '',
    category: 'geometric',
    price: 99,
    shapeId: 'circle',
    finishes: ['steel', 'brass'],
    sizes: [{ label: 'Medium · 40cm', widthMm: 400, heightMm: 400, priceDelta: 0 }],
    stock: 50,
    trackInventory: true,
    featured: false,
    bestseller: false,
    isNew: true,
    customizable: true
  });

  const handleStartAddProduct = () => {
    setProductForm({
      slug: '',
      name: '',
      tagline: '',
      description: '',
      category: 'geometric',
      price: 149,
      shapeId: 'circle',
      finishes: ['steel', 'brass', 'copper'],
      sizes: [{ label: 'Medium · 400mm', widthMm: 400, heightMm: 400, priceDelta: 0 }],
      stock: 50,
      trackInventory: true,
      featured: false,
      bestseller: false,
      isNew: true,
      customizable: true
    });
    setEditingProduct(null);
    setIsAddingProduct(true);
  };

  const handleStartEditProduct = (p: Product) => {
    setEditingProduct(p);
    setProductForm({
      slug: p.slug,
      name: p.name,
      tagline: p.tagline,
      description: p.description,
      category: p.category,
      price: p.price,
      shapeId: p.shapeId,
      finishes: p.finishes,
      sizes: p.sizes,
      stock: p.stock ?? 50,
      trackInventory: p.trackInventory ?? true,
      featured: p.featured,
      bestseller: p.bestseller,
      isNew: p.isNew,
      customizable: p.customizable
    });
    setIsAddingProduct(false);
  };

  const handleProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name.trim() || !productForm.slug.trim()) {
      toast.error('Product name and slug are required');
      return;
    }

    if (editingProduct) {
      updateProduct(editingProduct.id, productForm);
      toast.success('Product updated successfully');
      setEditingProduct(null);
    } else {
      addProduct(productForm);
      toast.success('New product created');
      setIsAddingProduct(false);
    }
  };

  const handleFinishToggle = (fKey: string) => {
    const active = productForm.finishes.includes(fKey as any);
    if (active) {
      if (productForm.finishes.length === 1) {
        toast.error('At least one finish required');
        return;
      }
      setProductForm({
        ...productForm,
        finishes: productForm.finishes.filter(f => f !== fKey)
      });
    } else {
      setProductForm({
        ...productForm,
        finishes: [...productForm.finishes, fKey as any]
      });
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {!isAddingProduct && !editingProduct ? (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-display text-3xl text-oxblood-deep">Manage Products</h2>
              <p className="text-muted-foreground text-sm">Add, edit, or customize metal design pieces in the catalog.</p>
            </div>
            <button 
              onClick={handleStartAddProduct}
              className="inline-flex items-center gap-2 bg-oxblood text-ivory px-4 py-2 rounded-full hover:bg-oxblood-deep shadow-soft transition text-sm font-semibold"
            >
              <Plus className="w-4 h-4" /> Add Product
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 bg-card border border-border/50 p-4 rounded-lg shadow-soft">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-3" />
              <input 
                type="text" 
                placeholder="Search products by name or tagline..." 
                value={productSearch}
                onChange={e => setProductSearch(e.target.value)}
                className="pl-9 pr-4 py-2 w-full bg-background border border-border rounded-md text-sm outline-none focus:border-oxblood"
              />
            </div>
            <select 
              value={productCatFilter}
              onChange={e => setProductCatFilter(e.target.value)}
              className="bg-background border border-border rounded-md px-3 py-2 text-sm outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="bg-card border border-border/50 rounded-lg shadow-soft overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/40 text-xs uppercase tracking-wider text-muted-foreground border-b border-border/60">
                  <tr>
                    <th className="px-6 py-3 font-semibold">Product</th>
                    <th className="px-6 py-3 font-semibold">Category</th>
                    <th className="px-6 py-3 font-semibold">Base Price</th>
                    <th className="px-6 py-3 font-semibold">Customizable</th>
                    <th className="px-6 py-3 font-semibold">Tags</th>
                    <th className="px-6 py-3 font-semibold text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {products
                    .filter(p => p.name.toLowerCase().includes(productSearch.toLowerCase()) || p.tagline.toLowerCase().includes(productSearch.toLowerCase()))
                    .filter(p => productCatFilter === 'all' || p.category === productCatFilter)
                    .map(p => (
                      <tr key={p.id} className="hover:bg-muted/10 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-semibold text-oxblood-deep">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.tagline} · <span className="font-mono text-[10px]">{p.slug}</span></div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="font-semibold">{storeConfig.currency}{p.price}</div>
                          <div className="text-[10px] text-muted-foreground font-mono">{p.stock ?? 0} in stock</div>
                        </td>
                        <td className="px-6 py-4">
                          {p.customizable ? (
                            <span className="text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded text-xs border border-emerald-500/20 font-medium">Yes</span>
                          ) : (
                            <span className="text-muted-foreground bg-muted px-2 py-0.5 rounded text-xs">No</span>
                          )}
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex flex-wrap gap-1">
                            {p.featured && <span className="text-[10px] uppercase tracking-wider bg-yellow-500/10 text-yellow-600 px-1.5 py-0.5 rounded border border-yellow-500/10">Featured</span>}
                            {p.bestseller && <span className="text-[10px] uppercase tracking-wider bg-orange-500/10 text-orange-600 px-1.5 py-0.5 rounded border border-orange-500/10">Best</span>}
                            {p.isNew && <span className="text-[10px] uppercase tracking-wider bg-teal-500/10 text-teal-600 px-1.5 py-0.5 rounded border border-teal-500/10">New</span>}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button 
                              onClick={() => handleStartEditProduct(p)}
                              className="p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground rounded transition"
                              title="Edit Product"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${p.name}"?`)) {
                                  deleteProduct(p.id);
                                  toast.success('Product deleted');
                                }
                              }}
                              className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded transition"
                              title="Delete Product"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        /* PRODUCT ADD / EDIT MODAL FORM */
        <div className="bg-card border border-border/60 rounded-lg shadow-soft overflow-hidden max-w-4xl mx-auto">
          <div className="px-6 py-4 border-b border-border/60 flex items-center justify-between bg-muted/20">
            <h3 className="font-display text-xl text-oxblood-deep">
              {editingProduct ? `Edit Product: ${editingProduct.name}` : 'Add New Product'}
            </h3>
            <button 
              onClick={() => {
                setIsAddingProduct(false);
                setEditingProduct(null);
              }}
              className="p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleProductSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Product Name</label>
                <input 
                  type="text" 
                  required
                  value={productForm.name}
                  onChange={e => setProductForm({ ...productForm, name: e.target.value })}
                  placeholder="E.g., Antwerp Atelier Sign"
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-oxblood"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Slug (URL identifier)</label>
                <input 
                  type="text" 
                  required
                  value={productForm.slug}
                  onChange={e => setProductForm({ ...productForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-_]/g, '-') })}
                  placeholder="e.g., antwerp-atelier-sign"
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-oxblood"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tagline</label>
                <input 
                  type="text" 
                  value={productForm.tagline}
                  onChange={e => setProductForm({ ...productForm, tagline: e.target.value })}
                  placeholder="E.g., Hand-finished round monogram"
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-oxblood"
                />
              </div>
              <div className="space-y-1 md:col-span-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Description</label>
                <textarea 
                  rows={3}
                  value={productForm.description}
                  onChange={e => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Describe the product materials, aesthetic details..."
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-oxblood resize-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Base Price ({storeConfig.currency})</label>
                <input 
                  type="number" 
                  required
                  min={1}
                  value={productForm.price}
                  onChange={e => setProductForm({ ...productForm, price: Number(e.target.value) })}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-oxblood"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Category</label>
                <select 
                  value={productForm.category}
                  onChange={e => setProductForm({ ...productForm, category: e.target.value as any })}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-oxblood"
                >
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Default Silhouette Shape</label>
                <select 
                  value={productForm.shapeId}
                  onChange={e => setProductForm({ ...productForm, shapeId: e.target.value })}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-oxblood"
                >
                  {shapeDefinitions.map(s => (
                    <option key={s.id} value={s.id}>{s.name} ({s.id})</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inventory Units in Stock</label>
                <input 
                  type="number" 
                  required
                  min={0}
                  value={productForm.stock}
                  onChange={e => setProductForm({ ...productForm, stock: Math.max(0, parseInt(e.target.value) || 0) })}
                  className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm outline-none focus:border-oxblood font-mono"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input 
                  type="checkbox"
                  id="trackInventory"
                  checked={productForm.trackInventory ?? true}
                  onChange={e => setProductForm({ ...productForm, trackInventory: e.target.checked })}
                  className="rounded border-border text-oxblood focus:ring-oxblood h-4 w-4"
                />
                <label htmlFor="trackInventory" className="text-xs font-medium text-foreground cursor-pointer select-none">
                  Enable Transactional Stock Reservation at Checkout
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground block">Available Finishes</label>
              <div className="flex flex-wrap gap-3">
                {Object.entries(finishLabels).map(([fKey, fData]) => {
                  const isSelected = productForm.finishes.includes(fKey as any);
                  return (
                    <button
                      key={fKey}
                      type="button"
                      onClick={() => handleFinishToggle(fKey)}
                      className={`flex items-center gap-2 border px-3 py-1.5 rounded-full transition-all text-xs font-medium ${
                        isSelected 
                          ? 'border-oxblood bg-oxblood/5 text-oxblood' 
                          : 'border-border text-muted-foreground hover:border-oxblood/40'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-border/80" style={{ backgroundColor: fData.swatch }} />
                      <span>{fData.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-border/60">
              <button
                type="button"
                onClick={() => {
                  setIsAddingProduct(false);
                  setEditingProduct(null);
                }}
                className="px-5 py-2 text-xs font-semibold rounded bg-muted hover:bg-border transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 text-xs font-semibold rounded bg-oxblood text-ivory hover:bg-oxblood-deep shadow-soft transition"
              >
                {editingProduct ? 'Update Product' : 'Save Product'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
