/**
 * Admin Settings & Database Portability View
 * Features: Global financial configurations, JSON database backup/export,
 * schema validation import, and factory reset routines.
 */

import { useState } from 'react';
import { useCatalog, hashPassphrase } from '@/lib/catalogContext';
import { Download, Upload, Clipboard, ShieldAlert, RefreshCw, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

export function AdminSettings() {
  const {
    products, categories, homepageSettings, orders, topics, storeConfig,
    updateStoreConfig, importDatabase, resetAll
  } = useCatalog();

  const [configForm, setConfigForm] = useState({
    storeName: storeConfig.storeName,
    currency: storeConfig.currency,
    taxRate: storeConfig.taxRate,
    freeShippingThreshold: storeConfig.freeShippingThreshold,
    shippingFee: storeConfig.shippingFee,
    newPassphrase: ''
  });

  const [dbImportText, setDbImportText] = useState('');
  const [dbImportError, setDbImportError] = useState<string | null>(null);

  const handleConfigSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updates: any = {
      storeName: configForm.storeName,
      currency: configForm.currency,
      taxRate: Number(configForm.taxRate),
      freeShippingThreshold: Number(configForm.freeShippingThreshold),
      shippingFee: Number(configForm.shippingFee),
    };
    if (configForm.newPassphrase && configForm.newPassphrase.trim()) {
      updates.adminPassphraseHash = hashPassphrase(configForm.newPassphrase.trim());
    }
    updateStoreConfig(updates);
    setConfigForm(prev => ({ ...prev, newPassphrase: '' }));
    toast.success('Store configurations saved');
  };

  const handleExportDB = () => {
    const payload = JSON.stringify({
      products,
      categories,
      homepageSettings,
      orders,
      topics,
      storeConfig
    }, null, 2);

    navigator.clipboard.writeText(payload);
    toast.success('Database JSON copied to clipboard');
  };

  const handleDownloadBackup = () => {
    const payload = JSON.stringify({
      products,
      categories,
      homepageSettings,
      orders,
      topics,
      storeConfig
    }, null, 2);

    const blob = new Blob([payload], { type: 'application/json' });
    const link = document.createElement('a');
    link.download = `vernox-database-backup-${Date.now()}.json`;
    link.href = URL.createObjectURL(blob);
    link.click();
    toast.success('Backup file downloaded');
  };

  const handleImportDB = (e: React.FormEvent) => {
    e.preventDefault();
    setDbImportError(null);

    const result = importDatabase(dbImportText);
    if (!result.success) {
      setDbImportError(result.errors ? result.errors.join('\n') : (result.error || 'Failed to import'));
      toast.error('Import validation failed');
    } else {
      toast.success('Database successfully restored');
      setDbImportText('');
    }
  };

  const handleReset = () => {
    if (confirm('This will wipe all catalog modifications, orders, and custom settings. Proceed?')) {
      resetAll();
      toast.success('Database reset to factory default');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div>
        <h2 className="font-display text-3xl text-oxblood-deep">Store Settings & System Portability</h2>
        <p className="text-muted-foreground text-sm">Manage business configurations, database backups, and system recovery.</p>
      </div>

      {/* 1. Global Business Configuration */}
      <form onSubmit={handleConfigSubmit} className="bg-card border border-border/50 rounded-lg p-6 shadow-soft space-y-6">
        <h3 className="font-display text-xl text-oxblood border-b border-border/60 pb-2">Business & Pricing Parameters</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Store Name</label>
            <input 
              type="text"
              required
              value={configForm.storeName}
              onChange={e => setConfigForm({ ...configForm, storeName: e.target.value })}
              className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-oxblood"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Currency Symbol</label>
            <select
              value={configForm.currency}
              onChange={e => setConfigForm({ ...configForm, currency: e.target.value })}
              className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-oxblood"
            >
              <option value="₹">₹ (INR - Rupee)</option>
              <option value="$">$ (USD)</option>
              <option value="€">€ (EUR)</option>
              <option value="£">£ (GBP)</option>
              <option value="¥">¥ (JPY)</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-2 md:col-span-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Tax Rate (%)</label>
              <input 
                type="number"
                required
                min={0}
                max={100}
                value={configForm.taxRate}
                onChange={e => setConfigForm({ ...configForm, taxRate: Number(e.target.value) })}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-oxblood text-center"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Free Ship Cutoff</label>
              <input 
                type="number"
                required
                min={0}
                value={configForm.freeShippingThreshold}
                onChange={e => setConfigForm({ ...configForm, freeShippingThreshold: Number(e.target.value) })}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-oxblood text-center"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Shipping Fee</label>
              <input 
                type="number"
                required
                min={0}
                value={configForm.shippingFee}
                onChange={e => setConfigForm({ ...configForm, shippingFee: Number(e.target.value) })}
                className="w-full bg-background border border-border rounded px-3 py-2 text-sm outline-none focus:border-oxblood text-center"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 border-t border-border/40">
          <button 
            type="submit"
            className="bg-oxblood text-ivory hover:bg-oxblood-deep px-6 py-2.5 rounded-full text-xs font-semibold shadow-soft transition"
          >
            Save Store Settings
          </button>
        </div>
      </form>

      {/* 2. Database Export */}
      <div className="bg-card border border-border/50 rounded-lg p-6 shadow-soft space-y-4">
        <h3 className="font-display text-xl text-oxblood border-b border-border/60 pb-1.5 flex items-center gap-2">
          <Download className="w-5 h-5" /> Export Database Backup
        </h3>
        <p className="text-xs text-muted-foreground">
          Export catalog products, collections, categories, verified orders, and store settings in raw JSON format.
        </p>
        <div className="flex gap-2">
          <button 
            onClick={handleExportDB}
            className="inline-flex items-center gap-1.5 bg-oxblood hover:bg-oxblood-deep text-ivory px-4 py-2 rounded-full text-xs font-semibold transition shadow-soft"
          >
            <Clipboard className="w-4 h-4" /> Copy Database JSON
          </button>
          <button 
            onClick={handleDownloadBackup}
            className="inline-flex items-center gap-1.5 border border-oxblood hover:bg-oxblood/5 text-oxblood px-4 py-2 rounded-full text-xs font-semibold transition"
          >
            <Download className="w-4 h-4" /> Download Backup File
          </button>
        </div>
      </div>

      {/* 3. Database Restore */}
      <form onSubmit={handleImportDB} className="bg-card border border-border/50 rounded-lg p-6 shadow-soft space-y-4">
        <h3 className="font-display text-xl text-oxblood border-b border-border/60 pb-1.5 flex items-center gap-2">
          <Upload className="w-5 h-5" /> Restore Database Backup
        </h3>
        <p className="text-xs text-muted-foreground">
          Paste a database JSON backup string below. The system will perform strict schema validation before restoration.
        </p>
        
        {dbImportError && (
          <div className="bg-destructive/10 border border-destructive/20 text-destructive text-xs p-4 rounded space-y-1 font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
            <div className="font-semibold flex items-center gap-1.5 text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" /> Schema Validation Failures:
            </div>
            {dbImportError}
          </div>
        )}

        <div className="space-y-2">
          <textarea 
            rows={5}
            required
            value={dbImportText}
            onChange={e => setDbImportText(e.target.value)}
            placeholder="Paste database JSON here..."
            className="w-full bg-background border border-border rounded px-3 py-2 text-xs font-mono outline-none focus:border-oxblood resize-none"
          />
          <div className="flex justify-end">
            <button 
              type="submit"
              className="bg-oxblood text-ivory hover:bg-oxblood-deep px-5 py-2 rounded-full text-xs font-semibold transition shadow-soft"
            >
              Verify & Import Database
            </button>
          </div>
        </div>
      </form>

      {/* 4. Danger Zone / Recovery */}
      <div className="bg-card border border-border/60 rounded-lg p-6 shadow-soft space-y-4">
        <h3 className="font-display text-xl text-oxblood flex items-center gap-2 border-b border-border/60 pb-2">
          <ShieldAlert className="w-5 h-5 text-destructive" /> Factory Reset Routine
        </h3>
        <div className="border border-destructive/20 bg-destructive/5 p-4 rounded-md flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-destructive">Wipe Local Modifications</div>
            <div className="text-xs text-muted-foreground">Restores catalog, categories, and settings to original state.</div>
          </div>
          <button 
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-full text-xs font-semibold transition"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Reset Database
          </button>
        </div>
      </div>
    </div>
  );
}
