'use client';

import { useUser } from '@/swr/use-user';
import { Card } from '@repo/design-system/components/ui/card';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { useEffect, useState, useRef } from 'react';
import { Separator } from '@repo/design-system/components/ui/separator';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { UploadIcon } from 'lucide-react';
import { BillingPicker } from '../components/billing-picker';
import { Label } from '@repo/design-system/components/ui/label';

interface ProfileFormValues {
  name: string;
  email: string;
  avatar?: string;
  newAvatarFile?: File;
  newAvatarPreview?: string;
}

export default function ProfilePage() {
  const { user, isLoading, mutate } = useUser();
  const [formData, setFormData] = useState<ProfileFormValues>({
    name: user?.name || '',
    email: user?.email || '',
    avatar: user?.image || ''
  });
  const [errors, setErrors] = useState<Partial<ProfileFormValues>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFormData({
      ...formData,
      name: user?.name || '',
      email: user?.email || '',
      avatar: user?.image || ''
    });
  }, [user]);

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

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);

    setFormData({
      ...formData,
      newAvatarFile: file,
      newAvatarPreview: previewUrl
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        setIsSubmitting(true);

        let avatarKey = formData.avatar;
        if (formData.newAvatarFile) {
          const fileName = `avatar.${formData.newAvatarFile.name.split('.').pop()}`
          const uploadUrlResponse = await fetch('/api/files/upload-url', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              fileName,
              contentType: formData.newAvatarFile.type
            })
          });

          const { url: uploadUrl, key: uploadKey } = await uploadUrlResponse.json();

          const uploadResponse = await fetch(uploadUrl, {
            method: 'PUT',
            body: formData.newAvatarFile,
            headers: {
              'Content-Type': formData.newAvatarFile.type,
              'Content-Disposition': `attachment; filename="${fileName}"`
            }
          });

          if (!uploadResponse.ok) {
            throw new Error('Failed to upload file');
          }

          avatarKey = uploadKey;
        }

        const response = await fetch('/api/user', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            image: formData.newAvatarFile ? avatarKey : undefined
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to update profile');
        }

        const updatedUser = await response.json();
        await mutate(updatedUser);

        if (formData.newAvatarPreview) {
          URL.revokeObjectURL(formData.newAvatarPreview);
        }
        setFormData(prev => ({
          ...prev,
          newAvatarFile: undefined,
          newAvatarPreview: undefined,
          avatar: updatedUser.avatar
        }));
      } catch (error) {
        console.error('Error updating profile:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="mx-auto">
      {/* <h1 className="text-2xl font-semibold">Profile</h1> */}
      <div>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <Label className="block mb-2">Avatar</Label>
            <div className="relative group w-16 h-16">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden">
                {formData.newAvatarPreview ? (
                  <img src={formData.newAvatarPreview} alt="User avatar" className="w-full h-full object-cover" />
                ) : formData.avatar ? (
                  <img src={formData.avatar} alt="User avatar" className="w-full h-full object-cover" />
                ) : (
                  user?.name?.[0]?.toUpperCase()
                )}
              </div>
              <div
                className="absolute w-16 h-16 inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <UploadIcon className="w-6 h-6 text-white" />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleAvatarChange}
                accept="image/*"
                className="hidden"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="block my-2">Display Name</Label>
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
            <Label className="block my-2">Email</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-gray-50"
            />
            <p className="text-sm text-muted-foreground">
              This is your primary contact email.
            </p>
          </div>

          <div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </div>
      <Separator />
      <Label className="block mt-4">Plan</Label>
      <BillingPicker currentPlan={user?.plan} />
      {/* <Separator />

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
      </div> */}
    </div>
  );
}
