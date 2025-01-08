'use client';

import { useEffect, useState, use } from 'react';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Textarea } from '@repo/design-system/components/ui/textarea';
import { useSnapshot } from '@/swr/use-snapshot';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import { SaveIcon, Loader2, Plus, X } from 'lucide-react';
import { toast } from '@repo/design-system/components/ui/use-toast';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Separator } from '@repo/design-system/components/ui/separator';
import { openDB } from 'idb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/design-system/components/ui/tabs';

export default function NotePage(props: { noteId: string }) {
  const noteId = props.noteId;

  const { snapshot, isLoading } = useSnapshot(noteId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [editingTagValue, setEditingTagValue] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [snapshotUrl, setSnapshotUrl] = useState('');

  const [firstLoad, setFirstLoad] = useState(true);

  useEffect(() => {
    if (snapshot && firstLoad) {
      setTitle(snapshot.title || '');
      setContent(snapshot.note || '');
      const newTags = snapshot.tags?.map((tag: { name: string }) => tag.name) || [];
      if (JSON.stringify(newTags) !== JSON.stringify(tags)) {
        setTags(newTags);
      }
      setFirstLoad(false);

      const initDB = async () => {
        const db = await openDB('snapshots', 1, {
          upgrade(db) {
            if (!db.objectStoreNames.contains('files')) {
              db.createObjectStore('files');
            }
          },
        });
        return db;
      };

      const downloadAndStoreFile = async (url: string, key: string) => {
        const db = await initDB();
        const storedFile = await db.get('files', key);

        if (!storedFile) {
          const response = await fetch(url);
          const blob = await response.blob();
          await db.put('files', blob, key);
          return URL.createObjectURL(blob);
        }

        return URL.createObjectURL(storedFile);
      };

      const loadFiles = async () => {
        if (snapshot) {
          if (snapshot.screenshotFileKey) {
            const url = await downloadAndStoreFile(snapshot.screenshotFileKey, `screenshot-${noteId}`);
            setScreenshotUrl(url);
          }
          if (snapshot.snapshotFileKey) {
            const url = await downloadAndStoreFile(snapshot.snapshotFileKey, `snapshot-${noteId}`);
            setSnapshotUrl(url);
          }
        }
      };

      loadFiles();
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
      const response = await fetch(`/api/snapshots/${noteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          note: content,
          tags,
          title,
          pinned: false,
          isDeleted: false
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
        {(snapshot?.screenshotFileKey || snapshot?.snapshotFileKey) && (
          <div className="w-full lg:w-2/3 border-b lg:border-b-0 lg:border-r overflow-auto p-4">
            <div className="flex flex-col gap-4 h-full">
              {(screenshotUrl && snapshotUrl) && (
                <Tabs defaultValue="screenshot" className="w-full">
                  <div className="flex justify-end">
                    <TabsList>
                      <TabsTrigger value="screenshot">Screenshot</TabsTrigger>
                      <TabsTrigger value="snapshot">Snapshot</TabsTrigger>
                    </TabsList>
                  </div>
                  <TabsContent value="screenshot" className="relative aspect-video w-full">
                    {screenshotUrl && (
                      <div className="h-[calc(100%)] lg:h-[calc(100vh-10rem)] w-full overflow-y-scroll">
                        <img
                          src={screenshotUrl}
                          alt="Screenshot preview"
                          className="object-contain"
                        />
                      </div>
                    )}
                  </TabsContent>
                  <TabsContent value="snapshot" className="relative aspect-video w-full">
                    {snapshotUrl && (
                      <iframe
                        src={snapshotUrl}
                        className="w-full h-[calc(100%)] lg:h-[calc(100vh-10rem)] border-0"
                        title="Snapshot preview"
                      />
                    )}
                  </TabsContent>
                </Tabs>
              )}
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
