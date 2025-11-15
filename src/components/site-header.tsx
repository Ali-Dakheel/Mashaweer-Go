import Image from "next/image"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"

export function SiteHeader() {
  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-2 px-4 lg:gap-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator orientation="vertical" className="mx-2 data-[orientation=vertical]:h-4" />
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Logo"
            width={24}
            height={24}
            className="rounded"
          />
          <h1 className="text-lg font-semibold">Admin Dashboard</h1>
        </div>
      </div>
    </header>
  )
}
