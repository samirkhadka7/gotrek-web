'use client';

import { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { User } from '@/types';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import SearchBar from '@/components/ui/SearchBar';
import Modal from '@/components/ui/Modal';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';
import Pagination from '@/components/ui/Pagination';
import { Pencil, Trash2, Plus, Users, Shield, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import { getImageUrl } from '@/services/api';

const roleBadge: Record<string, 'danger' | 'success' | 'default'> = {
  admin: 'danger', guide: 'success', user: 'default',
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ name: '', email: '', phone: '', role: '', active: true, guideVerified: false });
  const [createOpen, setCreateOpen] = useState(false);
  const [createForm, setCreateForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const perPage = 10;

  const load = async (params?: { page?: number; search?: string }) => {
    try {
      const res = await adminService.getUsers({ page: params?.page || page, limit: perPage, search: params?.search ?? search });
      setUsers(res.data?.data || res.data || []);
      const pagination = res.pagination || res.data?.pagination;
      if (pagination?.totalPages) setTotalPages(pagination.totalPages);
    } catch { toast.error('Failed to load users'); }
    setLoading(false);
  };

  useEffect(() => { load({ page: 1 }); }, []);
  useEffect(() => { setPage(1); load({ page: 1, search }); }, [search]);
  useEffect(() => { load({ page }); }, [page]);

  const handleEdit = async (u: User) => {
    setEditUser(u);
    setEditForm({ name: u.name, email: u.email, phone: u.phone, role: u.role, active: u.active ?? true, guideVerified: u.guideProfile?.verified ?? false });
    try {
      const res = await adminService.getUserById(u._id);
      const d = res.data || res;
      if (d) setEditForm({ name: d.name || u.name, email: d.email || u.email, phone: d.phone || u.phone, role: d.role || u.role, active: d.active ?? u.active ?? true, guideVerified: d.guideProfile?.verified ?? false });
    } catch { /* keep existing */ }
  };

  const handleUpdate = async () => {
    if (!editUser) return;
    try {
      setSaving(true);
      if (editForm.role !== editUser.role) await adminService.updateUserRole(editUser._id, editForm.role);
      const payload: any = { name: editForm.name, email: editForm.email, phone: editForm.phone, role: editForm.role, active: editForm.active };
      if (editForm.role === 'guide') payload.guideProfile = { verified: editForm.guideVerified };
      await adminService.updateUser(editUser._id, payload);
      toast.success('User updated');
      setEditUser(null);
      load();
    } catch { toast.error('Failed to update user'); }
    setSaving(false);
  };

  const handleCreate = async () => {
    if (!createForm.name.trim() || !createForm.email.trim() || !createForm.password.trim() || !createForm.phone.trim()) {
      toast.error('Please fill all required fields'); return;
    }
    try {
      setSaving(true);
      await adminService.createUser(createForm);
      toast.success('User created');
      setCreateOpen(false);
      setCreateForm({ name: '', email: '', password: '', phone: '' });
      load({ page: 1 });
    } catch { toast.error('Failed to create user'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try { await adminService.deleteUser(id); toast.success('User deleted'); load(); }
    catch { toast.error('Failed to delete'); }
  };

  const admins = users.filter(u => u.role === 'admin').length;
  const guides  = users.filter(u => u.role === 'guide').length;

  if (loading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  return (
    <div className="space-y-6 animate-fadeInUp">

      {/* ── Header ── */}
      <div className="relative bg-linear-to-br from-blue-600 to-sky-500 rounded-2xl p-6 text-white overflow-hidden shadow-xl shadow-blue-500/20">
        <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">User Management</h1>
            <p className="text-blue-100 text-sm mt-1">{users.length} total users — {admins} admins, {guides} guides</p>
          </div>
          <Button onClick={() => setCreateOpen(true)} className="bg-white/20 hover:bg-white/30 text-white border-0 shadow-none shrink-0">
            <Plus className="h-4 w-4 mr-2" /> Add User
          </Button>
        </div>
      </div>

      {/* ── Summary chips ── */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-sm">
          <Users className="h-4 w-4 text-blue-500" />
          <span className="font-semibold text-gray-900">{users.length}</span>
          <span className="text-gray-400">Users</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-sm">
          <Shield className="h-4 w-4 text-red-500" />
          <span className="font-semibold text-gray-900">{admins}</span>
          <span className="text-gray-400">Admins</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-sm">
          <UserCheck className="h-4 w-4 text-emerald-500" />
          <span className="font-semibold text-gray-900">{guides}</span>
          <span className="text-gray-400">Guides</span>
        </div>
        <div className="ml-auto">
          <SearchBar onSearch={setSearch} placeholder="Search users..." />
        </div>
      </div>

      {/* ── Table ── */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">User</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Email</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Role</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Plan</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-500 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.length === 0 && (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400 text-sm">No users found</td></tr>
              )}
              {users.map(u => (
                <tr key={u._id} className="hover:bg-gray-50/60 transition-colors group">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      {u.profileImage ? (
                        <img src={getImageUrl(u.profileImage)} alt={u.name} className="w-9 h-9 rounded-xl object-cover shrink-0 shadow-sm" />
                      ) : (
                        <div className="w-9 h-9 rounded-xl bg-linear-to-br from-blue-500 to-sky-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                          {u.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">{u.name}</p>
                        <p className="text-xs text-gray-400">{u.phone || '—'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-sm">{u.email}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={roleBadge[u.role] || 'default'}>{u.role}</Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={u.subscription === 'Premium' ? 'warning' : u.subscription === 'Pro' ? 'info' : 'default'}>
                      {u.subscription || 'Basic'}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => handleEdit(u)} className="p-2 rounded-xl hover:bg-blue-50 transition-colors" title="Edit">
                        <Pencil className="h-4 w-4 text-blue-500" />
                      </button>
                      <button onClick={() => handleDelete(u._id)} className="p-2 rounded-xl hover:bg-red-50 transition-colors" title="Delete">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />

      {/* Edit Modal */}
      <Modal open={!!editUser} onClose={() => setEditUser(null)} title="Edit User">
        <div className="space-y-4">
          <Input label="Name"  value={editForm.name}  onChange={e => setEditForm({ ...editForm, name: e.target.value })} />
          <Input label="Email" value={editForm.email} onChange={e => setEditForm({ ...editForm, email: e.target.value })} />
          <Input label="Phone" value={editForm.phone} onChange={e => setEditForm({ ...editForm, phone: e.target.value })} />
          <Select label="Role" value={editForm.role} onChange={e => setEditForm({ ...editForm, role: e.target.value })}
            options={[{ value: 'user', label: 'User' }, { value: 'guide', label: 'Guide' }, { value: 'admin', label: 'Admin' }]} />
          <div className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3">
            <span className="text-sm font-medium text-gray-700">Active</span>
            <input type="checkbox" className="w-4 h-4 accent-blue-600" checked={editForm.active} onChange={e => setEditForm({ ...editForm, active: e.target.checked })} />
          </div>
          {editForm.role === 'guide' && (
            <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">
              <span className="text-sm font-medium text-emerald-700">Verified Guide</span>
              <input type="checkbox" className="w-4 h-4 accent-emerald-600" checked={editForm.guideVerified} onChange={e => setEditForm({ ...editForm, guideVerified: e.target.checked })} />
            </div>
          )}
          <Button onClick={handleUpdate} className="w-full" isLoading={saving}>Save Changes</Button>
        </div>
      </Modal>

      {/* Create Modal */}
      <Modal open={createOpen} onClose={() => setCreateOpen(false)} title="Create New User">
        <div className="space-y-4">
          <Input label="Full Name" value={createForm.name}     onChange={e => setCreateForm({ ...createForm, name: e.target.value })} />
          <Input label="Email"     value={createForm.email}    onChange={e => setCreateForm({ ...createForm, email: e.target.value })} />
          <Input label="Password"  type="password" value={createForm.password} onChange={e => setCreateForm({ ...createForm, password: e.target.value })} />
          <Input label="Phone"     value={createForm.phone}    onChange={e => setCreateForm({ ...createForm, phone: e.target.value })} />
          <Button onClick={handleCreate} className="w-full" isLoading={saving}>Create User</Button>
        </div>
      </Modal>
    </div>
  );
}
