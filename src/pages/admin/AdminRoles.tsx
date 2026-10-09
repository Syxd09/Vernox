/**
 * Enterprise Admin Roles & Permissions Management View
 * Features: Multi-admin team roster, RBAC privilege enforcement
 * (Super Admin, Admin, Manager, Support), member onboarding, status suspension,
 * and comprehensive permission matrix audits.
 */

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useCatalog } from '@/lib/catalogContext';
import type { AdminUser, AdminRole } from '@/types/admin';
import { ROLE_PERMISSIONS } from '@/types/admin';
import { 
  Users, UserPlus, Shield, ShieldAlert, Key, 
  Check, X, AlertTriangle, CheckCircle2, Lock 
} from 'lucide-react';
import { toast } from 'sonner';
import { AtelierSelect } from '@/components/ui/select';

export function AdminRoles() {
  const { 
    adminUsers, currentAdmin, adminRole, 
    createAdminUser, updateAdminRole 
  } = useCatalog();

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);

  // Invite Form
  const [inviteForm, setInviteForm] = useState({
    email: '',
    name: '',
    role: 'manager' as AdminRole,
  });

  // Edit Form
  const [editForm, setEditForm] = useState({
    role: 'manager' as AdminRole,
    status: 'active' as 'active' | 'suspended',
  });

  // Prevent background scroll and support ESC to close modals
  useEffect(() => {
    if (isInviteOpen || editingAdmin) {
      document.body.style.overflow = 'hidden';
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setIsInviteOpen(false);
          setEditingAdmin(null);
        }
      };
      window.addEventListener('keydown', handleKeyDown);
      return () => {
        document.body.style.overflow = '';
        window.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isInviteOpen, editingAdmin]);

  const isSuperAdmin = adminRole === 'super_admin';

  const handleOpenInvite = () => {
    if (!isSuperAdmin) {
      toast.error('Only Super Administrators can provision team members.');
      return;
    }
    setInviteForm({
      email: '',
      name: '',
      role: 'manager',
    });
    setIsInviteOpen(true);
  };

  const handleSubmitInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteForm.email.trim() || !inviteForm.name.trim()) {
      toast.error('Please fill in both name and email');
      return;
    }

    const ok = await createAdminUser(inviteForm.email.trim(), inviteForm.name.trim(), inviteForm.role);
    if (ok) {
      toast.success(`Admin invitation dispatched to ${inviteForm.email}`);
      setIsInviteOpen(false);
    } else {
      toast.error('Failed to provision administrator');
    }
  };

  const handleOpenEdit = (admin: AdminUser) => {
    if (!isSuperAdmin) {
      toast.error('Only Super Administrators can modify role assignments.');
      return;
    }
    setEditingAdmin(admin);
    setEditForm({
      role: admin.role,
      status: admin.status,
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    if (editingAdmin.email === 'admin@vernox.com' && editForm.status === 'suspended') {
      toast.error('The primary system Super Administrator cannot be suspended.');
      return;
    }

    const ok = await updateAdminRole(editingAdmin.id, editForm.role, editForm.status);
    if (ok) {
      toast.success(`Privileges updated for ${editingAdmin.email}`);
      setEditingAdmin(null);
    } else {
      toast.error('Failed to update administrator privileges');
    }
  };

  const getRoleBadge = (role: AdminRole) => {
    switch (role) {
      case 'super_admin':
        return <span className="bg-oxblood/10 text-oxblood border border-oxblood/20 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase">Super Admin</span>;
      case 'admin':
        return <span className="bg-purple-500/10 text-purple-600 border border-purple-500/20 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase">Admin</span>;
      case 'manager':
        return <span className="bg-blue-500/10 text-blue-600 border border-blue-500/20 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase">Manager</span>;
      case 'support':
        return <span className="bg-amber-500/10 text-amber-600 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase">Support</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl text-oxblood-deep">Team Roles & Access Control</h2>
          <p className="text-muted-foreground text-sm">
            Govern administrative permissions, assign operational tiers, and manage workspace operators.
          </p>
        </div>

        {isSuperAdmin && (
          <button
            onClick={handleOpenInvite}
            className="inline-flex items-center gap-2 bg-oxblood text-ivory hover:bg-oxblood-deep px-4 py-2.5 rounded-lg text-sm font-semibold transition shadow-soft shrink-0"
          >
            <UserPlus className="w-4 h-4" />
            <span>Add Team Member</span>
          </button>
        )}
      </div>

      {!isSuperAdmin && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center gap-3 text-amber-700 dark:text-amber-400 text-xs">
          <Lock className="w-4 h-4 shrink-0" />
          <span>
            You are operating under <strong>{adminRole.toUpperCase()}</strong> privileges. Only Super Administrators can provision members or modify security roles.
          </span>
        </div>
      )}

      {/* Team Roster Table */}
      <div className="bg-card border border-border/70 rounded-xl overflow-hidden shadow-soft">
        <div className="p-4 border-b border-border/60 flex items-center justify-between">
          <h3 className="font-display text-base text-foreground flex items-center gap-2">
            <Users className="w-4 h-4 text-oxblood" />
            <span>Active Administrators ({adminUsers.length || 1})</span>
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <th className="p-4">Administrator</th>
                <th className="p-4">Role Tier</th>
                <th className="p-4">Account Status</th>
                <th className="p-4">Last Active</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {adminUsers.length === 0 ? (
                // Initial baseline default super admin entry
                <tr className="hover:bg-muted/20 transition">
                  <td className="p-4">
                    <div className="font-semibold text-foreground text-xs">Vernox Super Administrator</div>
                    <div className="font-mono text-xs text-muted-foreground">admin@vernox.com</div>
                  </td>
                  <td className="p-4">{getRoleBadge('super_admin')}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                    </span>
                  </td>
                  <td className="p-4 text-xs text-muted-foreground">Just now</td>
                  <td className="p-4 text-right text-xs text-muted-foreground">System Master</td>
                </tr>
              ) : (
                adminUsers.map(a => (
                  <tr key={a.id} className="hover:bg-muted/20 transition group">
                    <td className="p-4">
                      <div className="font-semibold text-foreground text-xs">{a.name}</div>
                      <div className="font-mono text-xs text-muted-foreground">{a.email}</div>
                    </td>
                    <td className="p-4">{getRoleBadge(a.role)}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-xs font-semibold ${
                        a.status === 'active' ? 'text-emerald-600' : 'text-rose-500'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${a.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        {a.status === 'active' ? 'Active' : 'Suspended'}
                      </span>
                    </td>
                    <td className="p-4 text-xs text-muted-foreground">
                      {a.lastLoginAt ? new Date(a.lastLoginAt).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="p-4 text-right">
                      {isSuperAdmin ? (
                        <button
                          onClick={() => handleOpenEdit(a)}
                          className="px-2.5 py-1 text-xs font-semibold text-oxblood hover:bg-oxblood/10 rounded transition"
                        >
                          Modify Privileges
                        </button>
                      ) : (
                        <span className="text-xs text-muted-foreground">Protected</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Permission Matrix Breakdown */}
      <div className="bg-card border border-border/70 rounded-xl overflow-hidden shadow-soft space-y-4 p-5">
        <div>
          <h3 className="font-display text-lg text-oxblood-deep">Role Privileges Matrix</h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Overview of granular operational boundaries across management tiers.
          </p>
        </div>

        <div className="overflow-x-auto border border-border rounded-lg">
          <table className="w-full text-left text-xs border-collapse">
            <thead className="bg-muted/40 uppercase font-semibold text-muted-foreground border-b border-border">
              <tr>
                <th className="p-3">Platform Capability</th>
                <th className="p-3 text-center">Super Admin</th>
                <th className="p-3 text-center">Admin</th>
                <th className="p-3 text-center">Manager</th>
                <th className="p-3 text-center">Support</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {[
                { name: 'Product Catalog & Pricing Management', key: 'canManageProducts' },
                { name: 'Direct Inventory Stock Adjustments', key: 'canManageInventory' },
                { name: 'Orders & CAM Production Fulfillment', key: 'canManageOrders' },
                { name: 'Coupons & Discount Promotion Rules', key: 'canManageCoupons' },
                { name: 'Customer Directory & Order History', key: 'canManageCustomers' },
                { name: 'Customer Reviews Moderation', key: 'canManageReviews' },
                { name: 'Team Member Onboarding & RBAC', key: 'canManageAdmins' },
                { name: 'System Settings & Financial Taxes', key: 'canManageSettings' },
                { name: 'Compliance Audit Activity Trails', key: 'canViewAuditLogs' },
                { name: 'JSON & CSV Data Export / Portability', key: 'canExportData' },
                { name: 'Factory Database Reset', key: 'canResetDatabase' },
              ].map(row => (
                <tr key={row.key} className="hover:bg-muted/10">
                  <td className="p-3 font-medium text-foreground">{row.name}</td>
                  {(['super_admin', 'admin', 'manager', 'support'] as const).map(role => {
                    const hasPerm = (ROLE_PERMISSIONS[role] as any)[row.key];
                    return (
                      <td key={role} className="p-3 text-center">
                        {hasPerm ? (
                          <Check className="w-4 h-4 text-emerald-600 mx-auto" />
                        ) : (
                          <X className="w-4 h-4 text-muted-foreground/30 mx-auto" />
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* INVITE MODAL */}
      {isInviteOpen && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setIsInviteOpen(false)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scale-in"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-oxblood" />
                <h3 className="font-display text-lg text-oxblood-deep font-bold">Add Team Member</h3>
              </div>
              <button 
                onClick={() => setIsInviteOpen(false)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitInvite} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Marc Van Houtte"
                  value={inviteForm.name}
                  onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm outline-none focus:border-oxblood transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="operator@vernox.com"
                  value={inviteForm.email}
                  onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })}
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm outline-none focus:border-oxblood transition"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Administrative Role *</label>
                <AtelierSelect
                  value={inviteForm.role}
                  onValueChange={val => setInviteForm({ ...inviteForm, role: val as AdminRole })}
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm outline-none focus:border-oxblood transition"
                  options={[
                    { value: 'admin', label: 'Admin (Catalog, Orders, Inventory, Coupons)' },
                    { value: 'manager', label: 'Manager (Products, Orders, Coupons)' },
                    { value: 'support', label: 'Support (Orders, Tracking, Customer Inquiries)' },
                    { value: 'super_admin', label: 'Super Admin (Full Platform Control)' },
                  ]}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setIsInviteOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-ivory bg-oxblood hover:bg-oxblood-deep rounded-lg transition shadow-soft"
                >
                  Confirm Provisioning
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* EDIT ROLE MODAL */}
      {editingAdmin && createPortal(
        <div 
          className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-fade-in"
          onClick={() => setEditingAdmin(null)}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="bg-card border border-border rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-4 animate-scale-in"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-oxblood" />
                <h3 className="font-display text-lg text-oxblood-deep font-bold">Modify Privileges</h3>
              </div>
              <button 
                onClick={() => setEditingAdmin(null)}
                className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-muted/30 p-3 rounded-lg text-xs space-y-1">
              <div className="font-semibold text-foreground">{editingAdmin.name}</div>
              <div className="font-mono text-muted-foreground">{editingAdmin.email}</div>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Assign Role</label>
                <AtelierSelect
                  value={editForm.role}
                  onValueChange={val => setEditForm({ ...editForm, role: val as AdminRole })}
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm outline-none focus:border-oxblood transition"
                  options={[
                    { value: 'super_admin', label: 'Super Admin' },
                    { value: 'admin', label: 'Admin' },
                    { value: 'manager', label: 'Manager' },
                    { value: 'support', label: 'Support' },
                  ]}
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Access Status</label>
                <AtelierSelect
                  value={editForm.status}
                  onValueChange={val => setEditForm({ ...editForm, status: val as any })}
                  className="w-full bg-background border border-border rounded-lg px-3.5 py-2 text-sm outline-none focus:border-oxblood transition"
                  options={[
                    { value: 'active', label: 'Active (Full Credentials Allowed)' },
                    { value: 'suspended', label: 'Suspended (Access Blocked Immediately)' },
                  ]}
                />
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-border">
                <button
                  type="button"
                  onClick={() => setEditingAdmin(null)}
                  className="px-4 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted rounded-lg transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-ivory bg-oxblood hover:bg-oxblood-deep rounded-lg transition shadow-soft"
                >
                  Save Privilege Updates
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
