'use client';

import { useSnapshot } from '@/swr/use-snapshot';
import { Badge } from '@repo/design-system/components/ui/badge';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Separator } from '@repo/design-system/components/ui/separator';
import { SidebarTrigger } from '@repo/design-system/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@repo/design-system/components/ui/tabs';
import { toast } from '@repo/design-system/components/ui/use-toast';
import { timeAgo } from '@repo/utils';
import { openDB } from 'idb';
import { Loader2, Pencil, Plus, Save, SquareArrowOutUpRight, X } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, } from 'react';
import { useTags } from '@/swr/use-tags';
import Link from 'next/link';

import EditorJS from '@editorjs/editorjs';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import './style.css'

// import { defaultValueCtx, Editor, rootCtx } from '@milkdown/kit/core';
// import { commonmark } from '@milkdown/kit/preset/commonmark';
// import { gfm } from '@milkdown/kit/preset/gfm';
// import { nord } from '@milkdown/theme-nord';
// import '@milkdown/theme-nord/style.css';

export default function NotePage(props: { noteId: string }) {
  const noteId = props.noteId;

  const { snapshot, isLoading, mutate: mutateNote } = useSnapshot(noteId);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<Array<{ name: string, emoji: string }>>([]);
  const [newTag, setNewTag] = useState('');
  const [editingTagIndex, setEditingTagIndex] = useState<number | null>(null);
  const [editingTagValue, setEditingTagValue] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);

  const [screenshotUrl, setScreenshotUrl] = useState('');
  const [snapshotUrl, setSnapshotUrl] = useState('');

  const [firstLoad, setFirstLoad] = useState(true);
  const [lastSavedState, setLastSavedState] = useState({ title: '', content: '', tags: [] as Array<{ name: string, emoji: string }> });
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'unsaved'>('saved');
  const [lastSavedTime, setLastSavedTime] = useState<Date | null>(null);

  const [editorReady, setEditorReady] = useState(false);

  const { mutate } = useTags();

  const [editorHolder, setEditorHolder] = useState<HTMLElement | null>(null);
  const editorHolderRef = useCallback((node: HTMLElement | null) => {
    if (node) setEditorHolder(node)
  }, [])

  // const editorRef = useRef<Editor>()
  const editorRef = useRef<EditorJS | null>(null);

  useEffect(() => {
    if (editorHolder && !editorRef.current) {
      editorRef.current = new EditorJS({
        // data: JSON.parse(snapshot.note),
        holder: editorHolder,
        tools: {
          header: Header,
          list: List
        },
        onReady: async () => {
          setEditorReady(true)
        },
        onChange: async () => {
          if (editorRef.current) {
            setContent(JSON.stringify(await editorRef.current.save()))
          }
        }
      })
    }

    // if (editorHolder) {
    //   Editor.make()
    //     .config((ctx) => {
    //       ctx.set(rootCtx, editorHolder);
    //       ctx.set(defaultValueCtx, content || '');
    //     })
    //     .config(nord)
    //     .use(commonmark)
    //     .use(gfm)
    //     .create()
    //     .then(editor => {
    //       editorRef.current = editor
    //     })

    //   setEditorReady(true);

    //   return () => {
    //     editorRef.current?.destroy();
    //   };
    // }

    return () => {
      editorRef.current?.destroy()
      editorRef.current = null
    }
  }, [editorHolder])

  useEffect(() => {
    if (snapshot && firstLoad && editorReady) {
      setFirstLoad(false);

      const initialTitle = snapshot.title || '';
      const initialContent = snapshot.note || '';
      const initialTags = snapshot.tags || [];

      if (snapshot.note) editorRef.current?.render(JSON.parse(snapshot.note))

      setTitle(initialTitle);
      setContent(initialContent);
      if (JSON.stringify(initialTags) !== JSON.stringify(tags)) {
        setTags(initialTags);
      }
      setLastSavedState({
        title: initialTitle,
        content: initialContent,
        tags: initialTags
      });

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
  }, [snapshot, editorReady]);

  const handleSave = async (changes: { title?: string, content?: string, tags?: string[] }) => {
    setSaveStatus('saving');
    try {
      const response = await fetch(`/api/snapshots/${noteId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(changes),
      });

      if (response.ok) {
        setLastSavedState({ title, content, tags });
        setLastSavedTime(new Date());
        setSaveStatus('saved');

        if (changes.tags) {
          mutate();
        }
      }
    } catch (error) {
      setSaveStatus('unsaved');
      toast({
        title: "Save failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      mutateNote()
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      const changes: any = {};
      if (title !== lastSavedState.title) changes.title = title;
      if (content !== lastSavedState.content) changes.note = content;

      if (Object.keys(changes).length > 0) {
        handleSave(changes);
      }
    }, 2000);

    if (title !== lastSavedState.title || content !== lastSavedState.content) {
      setSaveStatus('unsaved');
    }

    return () => clearTimeout(timer);
  }, [title, content]);

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  const handleAddTag = () => {
    if (newTag && !tags.some(tag => tag.name === newTag)) {
      const newTagObj = { name: newTag, emoji: "#" };
      const newTags = [...tags, newTagObj];
      setTags(newTags);
      setNewTag('');
      handleSave({ tags: newTags.map(tag => tag.name) });
    }
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newTags = tags.filter(tag => tag.name !== tagToRemove);
    setTags(newTags);
    handleSave({ tags: newTags.map(tag => tag.name) });
  };

  const handleTagClick = (index: number) => {
    setEditingTagIndex(index);
    setEditingTagValue(tags[index].name);
  };

  const handleTagEdit = (index: number) => {
    if (editingTagValue && !tags.some(tag => tag.name === editingTagValue)) {
      const newTags = [...tags];
      newTags[index] = { ...newTags[index], name: editingTagValue };
      setTags(newTags);
      handleSave({ tags: newTags.map(tag => tag.name) });
    }
    setEditingTagIndex(null);
  };

  const getSaveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return (
          <span className='flex items-center gap-1 whitespace-nowrap text-muted-foreground text-sm'>
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Saving...
          </span>
        );
      case 'unsaved':
        return <span className='whitespace-nowrap text-sm text-yellow-500'>Unsaved</span>;
      case 'saved':
        return (
          <span className='flex items-center gap-1 whitespace-nowrap text-muted-foreground text-sm'>
            <Save className="h-3.5 w-3.5" />
            {lastSavedTime ? `Saved ${timeAgo(lastSavedTime, { withAgo: true })}` : 'Saved'}
          </span>
        );
    }
  };

  return (
    <div className='flex h-full flex-col bg-background'>
      <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className='flex w-full items-center justify-between gap-2 px-4'>
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
          </div>
          <div className="flex items-center gap-2">
            {snapshot?.pageUrl && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={snapshot.pageUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1">
                  {snapshot.pageUrl.length > 50 ? snapshot.pageUrl.slice(0, 50) + '...' : snapshot.pageUrl}
                  <SquareArrowOutUpRight />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className='flex flex-1 flex-col overflow-hidden lg:!flex-row'>
        {(snapshot?.screenshotFileKey || snapshot?.snapshotFileKey) && (
          <div className='overflow-auto w-full border-b p-4 lg:!w-2/3 lg:border-r lg:border-b-0'>
            <div className='flex h-full flex-col gap-4'>
              <Tabs defaultValue={snapshot?.screenshotFileKey ? "screenshot" : "snapshot"} className="w-full">
                <div className="flex justify-end">
                  <TabsList>
                    {snapshot?.screenshotFileKey && <TabsTrigger value="screenshot">Screenshot</TabsTrigger>}
                    {snapshot?.snapshotFileKey && <TabsTrigger value="snapshot">Snapshot</TabsTrigger>}
                  </TabsList>
                </div>
                <TabsContent value="screenshot" className="relative aspect-video w-full">
                  {screenshotUrl && (
                    <div className='h-[calc(100%)] w-full overflow-y-auto lg:h-[calc(100vh-10rem)] flex items-center justify-center'>
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
                      className='h-[calc(100%)] w-full border-0 lg:h-[calc(100vh-10rem)]'
                      title="Snapshot preview"
                    />
                  )}
                </TabsContent>
              </Tabs>
            </div>
          </div>
        )}
        <div className="flex-1 overflow-auto">
          <div className='container mx-auto space-y-6 p-6'>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Pencil className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Note Title"
                  className='border-none !w-fit bg-transparent px-0 font-semibold !text-2xl shadow-none focus-visible:ring-0'
                />
              </div>
              {getSaveStatusText()}
            </div>
            <div className='flex flex-wrap items-center gap-2'>
              {tags.map((tag, index) => (
                editingTagIndex === index ? (
                  <Input
                    key={index}
                    value={editingTagValue}
                    onChange={(e) => setEditingTagValue(e.target.value)}
                    onBlur={() => handleTagEdit(index)}
                    onKeyDown={(e) => e.key === 'Enter' && handleTagEdit(index)}
                    className='h-7 w-32 border-none bg-transparent shadow-none focus-visible:ring-0'
                    autoFocus
                  />
                ) : (
                  <Badge
                    key={index}
                    variant="secondary"
                    className='group flex cursor-pointer items-center justify-between gap-2 py-1.5 hover:bg-secondary/80'
                  >
                    <span onClick={() => handleTagClick(index)}>{tag.emoji} {tag.name}</span>
                    <div className="hover:text-destructive" onClick={() => handleRemoveTag(tag.name)}>
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
                  className='h-7 w-32 border-none bg-transparent shadow-none focus-visible:ring-0'
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
            <div ref={editorHolderRef} className='h-[calc(100vh-48rem)] w-full resize-none border-none px-0 shadow-none focus-visible:ring-0 [&_h2]:text-[2rem]' />
          </div>
        </div>
      </div>
    </div>
  );
}
