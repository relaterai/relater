'use client';

import { useUser } from '@/swr/use-user';
import { Card } from '@repo/design-system/components/ui/card';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { useState } from 'react';
import { Separator } from '@repo/design-system/components/ui/separator';
import { Textarea } from '@repo/design-system/components/ui/textarea';

interface ProfileFormValues {
  name: string;
  email: string;
  bio?: string;
}

export default function ProfilePage() {
  const { user, isLoading } = useUser();
  const [formData, setFormData] = useState<ProfileFormValues>({
    name: user?.name || '',
    email: user?.email || '',
    bio: ''
  });
  const [errors, setErrors] = useState<Partial<ProfileFormValues>>({});

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-4rem)] items-center justify-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  const validateForm = () => {
    const newErrors: Partial<ProfileFormValues> = {};

    if (!formData.name || formData.name.length < 2) {
      newErrors.name = "Name must be at least 2 characters.";
    } else if (formData.name.length > 30) {
      newErrors.name = "Name cannot exceed 30 characters.";
    }

    if (!formData.email) {
      newErrors.email = "Please enter an email address.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (formData.bio && formData.bio.length > 160) {
      newErrors.bio = "Bio cannot exceed 160 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      // TODO: Implement API call to update user information
      console.log(formData);
    }
  };

  return (
    <div className="container max-w-3xl mx-auto py-10">
      <h1 className="text-2xl font-semibold mb-6">Profile Settings</h1>

      <div className="py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Avatar</label>
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <Button variant="outline" size="sm">Change Avatar</Button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Display Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
            {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            <p className="text-sm text-muted-foreground">
              This is your public display name. It can be your real name or a nickname.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            <p className="text-sm text-muted-foreground">
              This is your primary contact email.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Bio</label>
            <Textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us about yourself"
              className="resize-none"
            />
            {errors.bio && <p className="text-sm text-red-500">{errors.bio}</p>}
            <p className="text-sm text-muted-foreground">
              A brief introduction about yourself, maximum 160 characters.
            </p>
          </div>

          <div>
            <Button type="submit">Save Changes</Button>
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
