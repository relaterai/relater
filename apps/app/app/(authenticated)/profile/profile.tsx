'use client';

import { useUser } from '@/swr/use-user';
import { Card } from '@repo/design-system/components/ui/card';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { useState } from 'react';
import { Separator } from '@repo/design-system/components/ui/separator';

export default function ProfilePage() {
  const { user, isLoading } = useUser();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call to update user information
    setIsEditing(false);
  };

  return (
    <div className="container max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>

      <div className="py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Avatar</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <Button variant="outline" size="sm">Change Avatar</Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Display Name</label>
            {isEditing ? (
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="max-w-sm"
              />
            ) : (
              <p>{user?.name}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Email Address</label>
            {isEditing ? (
              <Input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="max-w-sm"
              />
            ) : (
              <p>{user?.email}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Registration Date</label>
            <p>{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US') : '-'}</p>
          </div>

          <div className="pt-4">
            {isEditing ? (
              <div className="flex gap-3">
                <Button type="submit">Save Changes</Button>
                <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              </div>
            ) : (
              <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
            )}
          </div>
        </form>
      </div>

      <Separator />

      <div className="py-8 mt-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-medium text-red-600">Delete Account</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Deleting your account will permanently remove all data. This action cannot be undone.
            </p>
          </div>
          <Button variant="destructive">Delete Account</Button>
        </div>
      </div>
    </div>
  );
}
