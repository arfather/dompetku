'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Wallet, PlusCircle, Receipt, PieChart } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', icon: Home, label: 'Dash' },
  { href: '/wallets', icon: Wallet, label: 'Dompet' },
  { href: '/transactions/income', icon: PlusCircle, label: 'Masuk' },
  { href: '/transactions/expense', icon: Receipt, label: 'Keluar' },
  { href: '/reports', icon: PieChart, label: 'Laporan' },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around bg-white/80 dark:bg-zinc-950/80 backdrop-blur-lg border-t border-zinc-200 dark:border-zinc-800 px-2 py-3 md:hidden">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = pathname === item.href
        
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center gap-1 min-w-[64px] transition-all",
              isActive 
                ? "text-indigo-600 dark:text-indigo-400" 
                : "text-zinc-500 dark:text-zinc-400"
            )}
          >
            <div className={cn(
              "p-1 rounded-md transition-colors",
              isActive && "bg-indigo-50 dark:bg-indigo-900/30"
            )}>
              <Icon className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-medium uppercase tracking-wider">
              {item.label}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
