import { Separator } from "@repo/design-system/components/ui/separator"
import { Metadata } from "next"
import Image from "next/image"
import { SidebarNav } from "./sidebar-nav"
import { Button } from "@repo/design-system/components/ui/button"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Forms",
  description: "Advanced form example using react-hook-form and Zod.",
}

const sidebarNavItems = [
  {
    title: "Profile",
    href: "/settings/profile",
  },
  {
    title: "Billing",
    href: "/settings/billing",
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
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
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