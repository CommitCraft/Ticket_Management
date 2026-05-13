import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardContent } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeaderCell, TableRow } from '../components/ui/table';
import { listRoles, listUsers, updateUser } from '../services/users';
import { api } from '../services/api';
import { Select } from '../components/ui/select';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';

export function UsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = async () => {
    const [nextUsers, nextRoles, nextDepartments] = await Promise.all([
      listUsers(),
      listRoles(),
      api.get('/api/departments').then(res => res.data.items ?? []).catch(() => [])
    ]);
    setUsers(nextUsers);
    setRoles(nextRoles);
    setDepartments(nextDepartments);
  };

  useEffect(() => {
    void load();
  }, []);

  const filteredUsers = useMemo(
    () => users.filter((user) => {
      const matchesQuery = [user.fullName, user.email, user.phoneNumber, user.companyName, user.roleKey, user.departmentId?.name]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query.toLowerCase()));
      const matchesRole = roleFilter ? user.roleKey === roleFilter : true;
      const matchesStatus = statusFilter ? user.status === statusFilter : true;
      return matchesQuery && matchesRole && matchesStatus;
    }),
    [query, roleFilter, statusFilter, users]
  );

  const activeCount = users.filter((user) => user.status === 'active').length;
  const disabledCount = users.filter((user) => user.status !== 'active').length;
  const roleCount = new Set(users.map((user) => user.roleKey)).size;

  const saveRole = async (userId: string, roleKey: string) => {
    await updateUser(userId, { roleKey });
    toast.success('Role updated');
    await load();
  };

  const saveDepartment = async (userId: string, departmentId: string) => {
    await updateUser(userId, { departmentId: departmentId || null });
    toast.success('Department updated');
    await load();
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Manage system users, statuses, and role assignments." />

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Total Users</p>
            <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white">{users.length}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Active Users</p>
            <p className="mt-2 text-3xl font-black text-green-600 dark:text-green-400">{activeCount}</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 dark:border-slate-800">
          <CardContent className="p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Roles Assigned</p>
            <p className="mt-2 text-3xl font-black text-blue-600 dark:text-blue-400">{roleCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <CardContent className="grid gap-3 border-b border-slate-200 p-4 dark:border-slate-800 md:grid-cols-4">
          <Input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, company, phone, email, role, department" />
          <Select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
            <option value="">All Roles</option>
            {roles.map((role) => <option key={role.key} value={role.key}>{role.name}</option>)}
          </Select>
          <Select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="disabled">Disabled</option>
          </Select>
          <Button variant="secondary" onClick={() => { setQuery(''); setRoleFilter(''); setStatusFilter(''); }}>
            Clear Filters
          </Button>
        </CardContent>

        <CardContent className="overflow-x-auto p-0">
          <Table>
            <TableHead>
              <TableRow className="bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 border-b-2 border-slate-200 dark:border-slate-600">
                <TableHeaderCell className="text-slate-700 dark:text-slate-200">Name</TableHeaderCell>
                <TableHeaderCell className="text-slate-700 dark:text-slate-200">Phone</TableHeaderCell>
                <TableHeaderCell className="text-slate-700 dark:text-slate-200">Company</TableHeaderCell>
                <TableHeaderCell className="text-slate-700 dark:text-slate-200">Email</TableHeaderCell>
                <TableHeaderCell className="text-slate-700 dark:text-slate-200">Role</TableHeaderCell>
                <TableHeaderCell className="text-slate-700 dark:text-slate-200">Department</TableHeaderCell>
                <TableHeaderCell className="text-slate-700 dark:text-slate-200">Status</TableHeaderCell>
                <TableHeaderCell className="text-slate-700 dark:text-slate-200">Actions</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user._id} className="hover:bg-blue-50 dark:hover:bg-blue-900/10 border-b border-slate-100 dark:border-slate-800 transition">
                  <TableCell className="font-semibold text-slate-900 dark:text-white">{user.fullName}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">{user.phoneNumber || '—'}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">{user.companyName || '—'}</TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">{user.email}</TableCell>
                  <TableCell>
                    <Badge className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {user.roleKey}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-slate-600 dark:text-slate-300">{user.departmentId?.name || '—'}</TableCell>
                  <TableCell>
                    <Badge className={user.status === 'active' ? 'rounded-full bg-green-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-300'}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="min-w-[21rem] align-top">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-900/60">
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Quick Actions</p>
                          <p className="text-[11px] text-slate-400 dark:text-slate-500">Role, department, and access controls</p>
                        </div>
                        <Badge className="rounded-full bg-slate-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                          Admin
                        </Badge>
                      </div>
                      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                        <div className="space-y-1.5 md:col-span-1 xl:col-span-1">
                          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Role</label>
                          <Select
                            defaultValue={user.roleKey}
                            onChange={(event) => void saveRole(user._id, event.target.value)}
                            className="h-11 w-full rounded-xl border-slate-200 bg-white text-sm dark:border-slate-700 dark:bg-slate-950"
                          >
                            {roles.map((role) => <option key={role.key} value={role.key}>{role.name}</option>)}
                          </Select>
                        </div>

                        <div className="space-y-1.5 md:col-span-1 xl:col-span-1">
                          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Department</label>
                          <Select
                            defaultValue={user.departmentId?._id || ''}
                            onChange={(event) => void saveDepartment(user._id, event.target.value)}
                            className="h-11 w-full rounded-xl border-slate-200 bg-white text-sm dark:border-slate-700 dark:bg-slate-950"
                          >
                            <option value="">No Department</option>
                            {departments.map((dept) => <option key={dept._id} value={dept._id}>{dept.name}</option>)}
                          </Select>
                        </div>

                        <div className="space-y-1.5 md:col-span-2 xl:col-span-1">
                          <label className="text-[11px] font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">Status</label>
                          <Button
                            variant="secondary"
                            className={`h-11 w-full rounded-xl border ${user.status === 'active' ? 'border-green-200 bg-green-50 text-green-700 hover:bg-green-100 dark:border-green-900/40 dark:bg-green-900/20 dark:text-green-300 dark:hover:bg-green-900/30' : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800'}`}
                            onClick={() => updateUser(user._id, { status: user.status === 'active' ? 'disabled' : 'active' }).then(load)}
                          >
                            {user.status === 'active' ? 'Disable User' : 'Enable User'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
