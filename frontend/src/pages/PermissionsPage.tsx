import { useEffect, useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { PageHeader } from '../components/layout/PageHeader';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Badge } from '../components/ui/badge';
import { api } from '../services/api';

const schema = z.object({
  key: z.string().min(2),
  name: z.string().min(2),
  description: z.string().optional()
});

type PermissionFormValues = z.infer<typeof schema>;

export function PermissionsPage() {
  const [permissions, setPermissions] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { register, handleSubmit, reset, setValue, formState: { isSubmitting } } = useForm<PermissionFormValues>({ resolver: zodResolver(schema) });

  const load = async () => {
    try {
      const res = await api.get('/api/permissions');
      setPermissions(res.data.items ?? []);
    } catch (error) {
      toast.error('Failed to load permissions');
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const onSubmit = async (values: PermissionFormValues) => {
    try {
      if (editingId) {
        await api.patch(`/api/permissions/${editingId}`, values);
        toast.success('Permission updated');
      } else {
        await api.post('/api/permissions', values);
        toast.success('Permission created');
      }
      
      reset();
      setEditingId(null);
      await load();
    } catch (error) {
      toast.error('Failed to save permission');
    }
  };

  const handleEdit = (permission: any) => {
    setEditingId(permission._id);
    setValue('key', permission.key);
    setValue('name', permission.name);
    setValue('description', permission.description || '');
  };

  const handleDelete = async (permissionId: string, permissionName: string) => {
    if (!confirm(`Are you sure you want to delete permission "${permissionName}"?`)) return;
    try {
      await api.delete(`/api/permissions/${permissionId}`);
      toast.success('Permission deleted');
      await load();
    } catch (error) {
      toast.error('Failed to delete permission');
    }
  };

  const handleCancel = () => {
    reset();
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Permissions" description="Manage granular permission definitions for role-based access control." />
      <Card>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
            <Input placeholder="Permission key (e.g., ticket_read)" {...register('key')} disabled={!!editingId} />
            <Input placeholder="Permission name" {...register('name')} />
            <Textarea className="md:col-span-2" placeholder="Description" {...register('description')} />
            <div className="md:col-span-2 flex justify-end gap-2">
              {editingId && (
                <Button type="button" variant="secondary" onClick={handleCancel} disabled={isSubmitting}>
                  Cancel
                </Button>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : editingId ? 'Update Permission' : 'Create Permission'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
      <div className="grid gap-4">
        <Card>
          <CardContent className="overflow-x-auto p-0">
            <table className="w-full text-sm">
              <thead className="border-b bg-slate-50 dark:bg-slate-900">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Key</th>
                  <th className="px-4 py-3 text-left font-semibold">Name</th>
                  <th className="px-4 py-3 text-left font-semibold">Description</th>
                  <th className="px-4 py-3 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {permissions.map((permission) => (
                  <tr key={permission._id} className={editingId === permission._id ? 'bg-blue-50 dark:bg-blue-500/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800'}>
                    <td className="px-4 py-3">
                      <Badge variant="outline" className="font-mono">{permission.key}</Badge>
                    </td>
                    <td className="px-4 py-3 font-medium">{permission.name}</td>
                    <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{permission.description || '-'}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleEdit(permission)}>
                          Edit
                        </Button>
                        <Button variant="destructive" size="sm" onClick={() => handleDelete(permission._id, permission.name)}>
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {permissions.length === 0 && (
              <div className="px-4 py-8 text-center text-slate-500">
                No permissions found. Create one to get started.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
