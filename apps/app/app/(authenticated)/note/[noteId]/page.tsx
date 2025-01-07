'use client';

import { useEffect, useState } from 'react';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { useSnapshot } from '@/swr/use-snapshot';
import { useParams, useRouter } from 'next/navigation';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import { SaveIcon, Loader2, Plus, X } from 'lucide-react';
import { toast } from '@repo/design-system/components/ui/use-toast';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Separator } from '@repo/design-system/components/ui/separator';

export default function NotePage() {
  const { noteId } = useParams<{ noteId: string }>();

  const { snapshot, isLoading } = useSnapshot(noteId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [editingTagValue, setEditingTagValue] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const [showScreenshot, setShowScreenshot] = useState(false);

  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (snapshot && firstLoad) {
      setTitle(snapshot.title || '');
      setContent(snapshot.content || '');
      const newTags = snapshot.tags?.map((tag: { name: string }) => tag.name) || [];
      if (JSON.stringify(newTags) !== JSON.stringify(tags)) {
        setTags(newTags);
      }
      setFirstLoad(false);
    }
  }, [snapshot]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  const handleSave = async () => {
    try {
      const response = await fetch(`/api/notes/${noteId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          content,
          tags
        }),
      });

      if (response.ok) {
        toast({
          title: "Saved successfully",
          duration: 2000,
        });
      }
    } catch (error) {
      toast({
        title: "Save failed",
        description: "Please try again later",
        variant: "destructive",
      });
    }
  };

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      setTags([...tags, newTag]);
      setNewTag('');
    }
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleTagClick = (index: number) => {
    setEditingTagIndex(index);
    setEditingTagValue(tags[index]);
  };

  const handleTagEdit = (index: number) => {
    if (editingTagValue && !tags.includes(editingTagValue)) {
      const newTags = [...tags];
      newTags[index] = editingTagValue;
      setTags(newTags);
    }
    setEditingTagIndex(null);
  };

  return (
    <div className="flex flex-col h-full bg-background">
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-2 px-4 justify-between w-full">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={handleSave} size="sm" variant="outline">
              <SaveIcon className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row flex-1 overflow-hidden">
        {snapshot?.screenshotFileKey && (
          <div className="w-full lg:w-2/3 border-b lg:border-b-0 lg:border-r overflow-auto p-4">
            <div className="flex flex-col gap-4">
              <div className="flex justify-end">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowScreenshot(prev => !prev)}
                >
                  {showScreenshot ? 'Snapshot' : 'Screenshot'}
                </Button>
              </div>
              <div className="relative aspect-video w-full">
                {showScreenshot ? (
                  <img
                    src={snapshot.screenshotFileKey}
                    alt="Screenshot preview"
                    className="object-contain"
                  />
                ) : (
                  <iframe
                    src={snapshot.snapshotFileKey}
                    className="w-full h-full border-0"
                    title="Snapshot preview"
                  />
                )}
              </div>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-auto">
          <div className="container mx-auto p-6 space-y-6">
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Note Title"
              className="text-2xl font-semibold border-none bg-transparent focus-visible:ring-0 shadow-none px-0"
            />
            <div className="flex flex-wrap gap-2 items-center">
              {tags.map((tag, index) => (
                editingTagIndex === index ? (
                  <Input
                    key={index}
                    value={editingTagValue}
                    onChange={(e) => setEditingTagValue(e.target.value)}
                    onBlur={() => handleTagEdit(index)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTagEdit(index)}
                    className="w-32 h-7 focus-visible:ring-0 shadow-none border-none bg-transparent"
                    autoFocus
                  />
                ) : (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="cursor-pointer hover:bg-secondary/80 group flex justify-between items-center gap-2 py-1.5"
                  >
                    <span onClick={() => handleTagClick(index)}>{tag}</span>
                    <div className="hover:text-destructive" onClick={() => handleRemoveTag(tag)}>
                      <X className="h-4 w-4 scale-[85%]" />
                    </div>
                  </Badge>
                )
              ))}
              {isAddingTag ? (
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onBlur={handleAddTag}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  placeholder="New tag"
                  className="w-32 h-7 focus-visible:ring-0 shadow-none border-none bg-transparent"
                  autoFocus
                />
              ) : (
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsAddingTag(true)}
                  className="h-6 px-2"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              )}
            </div>
            <Separator />
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing..."
              className="min-h-[calc(100vh-48rem)] resize-none border-none focus-visible:ring-0 shadow-none px-0"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
