'use client';

// import { OrganizationSwitcher, UserButton } from '@repo/auth/client';
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
import { cn } from '@repo/design-system/lib/utils';
import {
  AnchorIcon,
  BookOpenIcon,
  BotIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  ChevronUpIcon,
  FolderIcon,
  FrameIcon,
  HashIcon,
  LifeBuoyIcon,
  LogOutIcon,
  MapIcon,
  MoreHorizontalIcon,
  PieChartIcon,
  SendIcon,
  Settings2Icon,
  SettingsIcon,
  ShareIcon,
  SquareTerminalIcon,
  Trash2Icon,
  UserIcon,
} from 'lucide-react';
import type { ReactNode } from 'react';
import Heatmap from './heatmap';
import { signOut } from 'next-auth/react';

type GlobalSidebarProperties = {
  readonly children: ReactNode;
};

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Tag 0',
      url: '#',
      isActive: true,
      items: [
        {
          title: 'Tag 1',
          url: '#',
          items: [
            {
              title: 'Tag 2',
              url: '#',
              items: [
                {
                  title: 'Tag 3',
                  url: '#'
                }
              ]
            },
          ],
        },
        {
          title: 'Tag 4',
          url: '#',
        },
        {
          title: 'Tag 5',
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Webhooks',
      url: '/webhooks',
      icon: AnchorIcon,
    },
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoyIcon,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: SendIcon,
    },
  ],
  projects: [
    {
      name: 'Design Engineering',
      url: '#',
      icon: FrameIcon,
    },
    {
      name: 'Sales & Marketing',
      url: '#',
      icon: PieChartIcon,
    },
    {
      name: 'Travel',
      url: '#',
      icon: MapIcon,
    },
  ],
};

const RecursiveMenuItem = ({ item }: { item: any }) => {
  return (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton asChild>
        <a href={item.url}>
          {
            item.items && <HashIcon />
          }
          <span>{item.title}</span>
        </a>
      </SidebarMenuButton>
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
        <SidebarContent>
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
              {data.navMain.map((item) => (
                <Collapsible
                  key={item.title}
                  asChild
                  defaultOpen={item.isActive}
                >
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip={item.title}>
                      <a href={item.url}>
                        <HashIcon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                    {item.items?.length ? (
                      <>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuAction className="data-[state=open]:rotate-90">
                            <ChevronRightIcon />
                            <span className="sr-only">Toggle</span>
                          </SidebarMenuAction>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.items?.map((subItem) => (
                              <RecursiveMenuItem key={subItem.title} item={subItem} />
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </>
                    ) : null}
                  </SidebarMenuItem>
                </Collapsible>
              ))}
            </SidebarMenu>
          </SidebarGroup>
          {/* <SidebarGroup className="mt-auto">
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navSecondary.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup> */}
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
                    <span className="text-sm font-medium truncate">Demo User</span>
                    <span className="text-xs text-muted-foreground truncate">demo@example.com</span>
                  </div>
                  <ChevronsUpDownIcon className="h-4 w-4 shrink-0 transition-transform duration-200" />
                </SidebarMenuItem>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]" side="right">
                <DropdownMenuItem>
                  <UserIcon className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <SettingsIcon className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* <DropdownMenuItem>
                  <ModeToggle />
                </DropdownMenuItem>
                <DropdownMenuSeparator /> */}
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
