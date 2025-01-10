'use client';

import './hide-scrollbar.css';
import { ModeToggle } from '@repo/design-system/components/mode-toggle';
import { DownloadWidget } from '@repo/design-system/components/download-widget';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@repo/design-system/components/ui/collapsible';
import { Avatar, AvatarFallback, AvatarImage } from '@repo/design-system/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@repo/design-system/components/ui/dropdown-menu';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@repo/design-system/components/ui/sidebar';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@repo/design-system/components/ui/dialog';
import { Button } from '@repo/design-system/components/ui/button';
import { Input } from '@repo/design-system/components/ui/input';
import { Label } from '@repo/design-system/components/ui/label';
import { cn } from '@repo/design-system/lib/utils';
import {
  ChevronRightIcon,
  ChevronsUpDownIcon,
  HomeIcon,
  LogOutIcon,
  MoreHorizontalIcon,
  SettingsIcon,
  Trash2Icon,
  UserIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import { useState } from 'react';
import Heatmap from './heatmap';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { useTags } from '@/swr/use-tags';
import { useUser } from '@/swr/use-user';

type GlobalSidebarProperties = {
  readonly children: ReactNode;
};

type TagNode = {
  title: string;
  url: string;
  id?: string;
  items: TagNode[];
  isActive?: boolean;
  emoji?: string;
};

const buildTagTree = (tags: Array<{ id: string, name: string, emoji?: string }>): TagNode[] => {
  const root: { items: TagNode[] } = {
    items: []
  };

  const nodeMap = new Map<string, TagNode>();

  tags.forEach((tag) => {
    const parts = tag.name.replace("#", "").split('/');
    let currentLevel = root;

    parts.forEach((part, index) => {
      const path = parts.slice(0, index + 1).join('/');

      if (!nodeMap.has(path)) {
        const newNode: TagNode = {
          title: part,
          url: `/?tag=${path}`,
          id: tag.id,
          items: [],
          isActive: false,
          emoji: tag.emoji
        };

        nodeMap.set(path, newNode);
        currentLevel.items.push(newNode);
      }

      currentLevel = nodeMap.get(path) as TagNode;
    });
  });

  return root.items;
};

const RecursiveMenuItem = ({ item }: { item: TagNode }) => {
  const [isRenameOpen, setIsRenameOpen] = useState(false);
  const [isIconOpen, setIsIconOpen] = useState(false);
  const [newName, setNewName] = useState(item.title);
  const [newIcon, setNewIcon] = useState(item.emoji || '');

  const handlePin = async () => {
    try {
      await fetch(`/api/tags/${item.id}/pin`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Failed to pin tag:', error);
    }
  };

  const handleRemoveTag = async () => {
    try {
      await fetch(`/api/tags/${item.id}`, {
        method: 'DELETE',
        body: JSON.stringify({ removeNotesAlso: false })
      });
    } catch (error) {
      console.error('Failed to remove tag:', error);
    }
  };

  const handleDeleteTag = async () => {
    try {
      await fetch(`/api/tags/${item.id}`, {
        method: 'DELETE',
        body: JSON.stringify({ removeNotesAlso: true })
      });
    } catch (error) {
      console.error('Failed to delete tag:', error);
    }
  };

  const handleRenameTag = async () => {
    try {
      await fetch(`/api/tags/${item.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: newName })
      });
      setIsRenameOpen(false);
    } catch (error) {
      console.error('Failed to rename tag:', error);
    }
  };

  const handleChangeIcon = async () => {
    try {
      await fetch(`/api/tags/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ emoji: newIcon })
      });
    } catch (error) {
      console.error('Failed to change icon:', error);
    }
  };

  return (
    <SidebarMenuItem key={item.title}>
      <Link href={item.url}>
        <SidebarMenuButton>
          <span className='w-3 h-3 flex items-center justify-center'>{item.emoji}</span>
          <span>{item.title}</span>
        </SidebarMenuButton>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction className={`opacity-0 hover:opacity-100 ${item.items?.length ? 'mr-6' : ''}`}>
            <MoreHorizontalIcon className="h-4 w-4" />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" side="right">
          <DropdownMenuItem onClick={handlePin}>
            <span>Pin</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsRenameOpen(true)}>
            <span>Rename</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsIconOpen(true)}>
            <span>Change Icon</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleRemoveTag} className="text-red-600">
            <span>Remove Tag Only</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleDeleteTag} className="text-red-600">
            <span>Delete Tag and Notes</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename Tag</DialogTitle>
            <DialogDescription>
              Enter a new name for this tag
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsRenameOpen(false)}>Cancel</Button>
            <Button onClick={handleRenameTag}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isIconOpen} onOpenChange={setIsIconOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change Icon</DialogTitle>
            <DialogDescription>
              Choose a new emoji icon for this tag
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="icon">Icon</Label>
              <div className="flex flex-col gap-2">
                <Input
                  id="icon"
                  value={newIcon}
                  onChange={(e) => setNewIcon(e.target.value)}
                  placeholder="Currently selected emoji"
                  className="mb-2"
                  maxLength={1}
                />
                <div className="grid grid-cols-8 gap-2 p-2 border rounded-md max-h-[200px] overflow-y-auto">
                  {["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊",
                    "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘",
                    "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪",
                    "🤨", "🧐", "🤓", "😎", "🥸", "🤩", "🥳", "😏",
                    "📝", "📚", "💡", "⭐", "🎯", "🎨", "🔖", "📌"].map((emoji, i) => (
                      <button
                        key={i}
                        onClick={() => setNewIcon(emoji)}
                        className={`p-2 text-xl hover:bg-secondary rounded ${newIcon === emoji ? 'bg-secondary' : ''}`}
                      >
                        {emoji}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setIsIconOpen(false)}>Cancel</Button>
            <Button onClick={handleChangeIcon}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {item.items?.length ? (
        <Collapsible asChild>
          <div>
            <CollapsibleTrigger asChild>
              <SidebarMenuAction className="data-[state=open]:rotate-90">
                <ChevronRightIcon />
                <span className="sr-only">Toggle</span>
              </SidebarMenuAction>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {item.items.map((subItem: any) => (
                  <RecursiveMenuItem key={subItem.title} item={subItem} />
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </div>
        </Collapsible>
      ) : null}
    </SidebarMenuItem>
  );
};

export const GlobalSidebar = ({ children }: GlobalSidebarProperties) => {
  const sidebar = useSidebar();
  const { user } = useUser();
  const { tags } = useTags();

  const tagTree = buildTagTree(tags || [])

  return (
    <>
      <Sidebar variant="inset">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <div
                className={cn(
                  'h-[36px] overflow-hidden transition-all [&>div]:w-full',
                  sidebar.open ? '' : '-mx-1'
                )}
              ></div>
              <div className="flex items-center justify-center">
                <Heatmap />
              </div>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarContent className='hide-scrollbar'>
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip="All Notes">
                  <Link href="/">
                    <HomeIcon />
                    <span>All Notes</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Pinned Tags</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <div className="text-sm text-muted-foreground px-4">
                  Pin tags here for easy access
                </div>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel>Tags</SidebarGroupLabel>
            <SidebarMenu>
              {tagTree.map((item) => (
                <RecursiveMenuItem key={item.title} item={item} />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <DownloadWidget compact />
          <SidebarMenu>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuItem className="flex items-center gap-2 cursor-pointer">
                  <Avatar className="h-8 w-8 rounded-md">
                    <AvatarImage src="https://avatars.githubusercontent.com/u/54500106" alt="Demo User" />
                    <AvatarFallback>DU</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col flex-1 overflow-hidden">
                    <span className="text-sm font-medium truncate">{user?.name || 'User'}</span>
                    <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                  </div>
                  <ChevronsUpDownIcon className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </SidebarMenuItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]" side="right">
                <DropdownMenuItem>
                  <Link href="/settings/profile" className="flex items-center gap-2">
                    <UserIcon className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link href="/settings/billing" className="flex items-center gap-2">
                    <SettingsIcon className="mr-2 h-4 w-4" />
                    <span>Billing</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/recycle-bin" className="flex items-center gap-2">
                    <Trash2Icon className="mr-2 h-4 w-4" />
                    <span>Recycle Bin</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => signOut()} className="text-red-600">
                  <LogOutIcon className="mr-2 h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </>
  );
};
