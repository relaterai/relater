import { Button } from "@repo/design-system/components/ui/button"
import { Separator } from "@repo/design-system/components/ui/separator"
import type { Metadata } from "next"
import Link from "next/link"
import { SidebarNav } from "./sidebar-nav"
export const metadata: Metadata = {
  title: "Billing - Relater",
  description: "Manage your billing information and subscription.",
}

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings/profile",
  },
  {
    title: "Billing",
    href: "/settings/billing",
  },
  {
    title: "API Keys",
    href: "/settings/api",
  }
]

interface SettingsLayoutProps {
  children: React.ReactNode
}

export default function SettingsLayout({ children }: SettingsLayoutProps) {
  return (
    <>
      <div className="space-y-6 p-10 pb-16">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <h2 className='font-bold text-2xl tracking-tight'>Settings</h2>
            <Link href="/">
              <Button variant="outline">Home</Button>
            </Link>
          </div>
          <p className="text-muted-foreground">
            Manage your account settings and set e-mail preferences.
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
          <aside className="-mx-4 lg:w-[280px]">
            <SidebarNav items={sidebarNavItems} />
          </aside>
          <div className="flex-1 lg:max-w-2xl">{children}</div>
        </div>
      </div>
    </>
  )
}