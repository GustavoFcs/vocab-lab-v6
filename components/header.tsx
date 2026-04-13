"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BookOpen, FlaskConical, GraduationCap, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { SettingsDialog } from "./settings-dialog"

const navItems = [
  {
    label: "VocabLab",
    href: "/",
    icon: BookOpen,
  },
  {
    label: "GrammarLab",
    href: "/grammar",
    icon: FlaskConical,
  },
]

function getSectionLabel(pathname: string) {
  const item = navItems.find((n) => n.href === pathname)
  return item?.label ?? "VocabLab"
}

export function Header() {
  const pathname = usePathname()
  const sectionLabel = getSectionLabel(pathname)

  return (
    <header className="sticky top-0 z-50 w-full bg-zinc-950">
      {/* Row 1 — brand + breadcrumb */}
      <div className="flex h-11 items-center gap-2 px-4 sm:px-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="flex size-7 items-center justify-center rounded-md bg-white/10">
            <GraduationCap className="size-4 text-white" />
          </div>
          <span className="font-semibold text-sm text-white">Library</span>
        </Link>
        <ChevronRight className="size-3.5 text-zinc-500 shrink-0" />
        <span className="text-sm font-medium text-zinc-300">{sectionLabel}</span>
        <div className="ml-auto">
          <SettingsDialog />
        </div>
      </div>

      {/* Row 2 — tab navigation */}
      <nav className="flex items-end px-2 sm:px-4 gap-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 text-sm transition-colors relative",
                isActive
                  ? "bg-background text-foreground font-semibold rounded-tl-xl rounded-tr-xl"
                  : "text-zinc-400 hover:text-zinc-200 rounded-tl-lg rounded-tr-lg hover:bg-zinc-800"
              )}
            >
              <item.icon className="size-3.5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </header>
  )
}
