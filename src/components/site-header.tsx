"use client"

import { PanelLeft } from "lucide-react"

import { SearchForm } from "@/components/search-form"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { useSidebar } from "@/components/ui/sidebar"
import { useSession } from "next-auth/react"

export function SiteHeader() {
  const { toggleSidebar, open } = useSidebar()
  const { data: session } = useSession();

  return (
    <header className="bg-background sticky top-0 z-50 flex w-full items-center border-b">
      <div className="flex h-14 w-full items-center gap-2 px-4">
        {/* Always show toggle button with smooth rotation animation */}
        <Button
          className="h-8 w-8"
          variant="ghost"
          size="icon"
          onClick={toggleSidebar}
        >
          <PanelLeft className={`transition-all duration-300 ease-in-out ${open ? "rotate-0" : "rotate-180"}`} />
        </Button>
        
        <Separator orientation="vertical" className="mr-2 h-4" />
        
        <span className="hidden sm:block font-serif text-2xl transition-all duration-300 ease-in-out">
          Welcome, {session?.user?.name}
        </span>
        
        <SearchForm className="w-full sm:ml-auto sm:w-auto" />
      </div>
    </header>
  )
}
