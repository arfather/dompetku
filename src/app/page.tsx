import Link from 'next/link'
import { WalletIcon, Receipt, PlusCircle, TrendingUp, TrendingDown, PieChart } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { getDashboardStats } from '@/lib/actions/dashboard'
import { WalletPieChart } from './_components/WalletPieChart'
import { RecentTransactionsTable } from './_components/RecentTransactionsTable'

import { AuthDialog } from '@/components/auth-dialog'

export const dynamic = 'force-dynamic'

export default async function Home() {
  const stats = await getDashboardStats()

  return (
    <AuthDialog>
      <div className="flex min-h-screen flex-col items-center bg-zinc-50 dark:bg-zinc-950 p-4 pb-24 md:p-12 font-sans">
        <main className="w-full max-w-6xl flex flex-col gap-6 md:gap-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="flex flex-col gap-2">
              <h1 className="text-4xl md:text-5xl lg:text-6xl premium-heading text-zinc-900 dark:text-zinc-50 text-center md:text-left">
                <span className="text-primary">DompetKu</span>
              </h1>
              <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 text-center md:text-left max-w-lg">
                Ringkasan aktivitas keuangan dan alokasi dana Anda.
              </p>
            </div>
            <div className="hidden md:flex gap-3">
              <Link href="/wallets" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md hover:-translate-y-0.5 h-11 px-6">
                <WalletIcon className="w-4 h-4 mr-2 text-primary" />
                Dompet
              </Link>
              <Link href="/transactions/income" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/40 hover:-translate-y-0.5 h-11 px-6">
                <PlusCircle className="w-4 h-4 mr-2" />
                Pemasukan
              </Link>
              <Link href="/transactions/expense" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-semibold transition-all bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-600/20 hover:shadow-rose-600/40 hover:-translate-y-0.5 h-11 px-6">
                <Receipt className="w-4 h-4 mr-2" />
                Pengeluaran
              </Link>
            </div>
          </div>

          {/* Overview Row */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="soft-shadow hover:shadow-lg transition-all border-none bg-linear-to-br from-indigo-50 to-white dark:from-indigo-950/20 dark:to-zinc-900">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">Laporan Transaksi</CardTitle>
                <PieChart className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-4 text-zinc-600 dark:text-zinc-400">
                  Lihat filter trend riwayat transaksi Anda.
                </CardDescription>
                <Link href="/reports" className="w-full inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-bold transition-all bg-indigo-600 hover:bg-indigo-700 text-white h-10 px-4">
                  Lihat Laporan Lengkap
                </Link>
              </CardContent>
            </Card>

            <Card className="soft-shadow hover:shadow-lg transition-all border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-500">Pemasukan Bulan Ini</CardTitle>
                <div className="p-2 bg-emerald-50 dark:bg-emerald-900/30 rounded-lg">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  +Rp {stats.totalIncome.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-medium italic">Sejak awal periode</p>
              </CardContent>
            </Card>

            <Card className="soft-shadow hover:shadow-lg transition-all border-none">
              <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                <CardTitle className="text-sm font-bold uppercase tracking-wider text-zinc-500">Pengeluaran Bulan Ini</CardTitle>
                <div className="p-2 bg-rose-50 dark:bg-rose-900/30 rounded-lg">
                  <TrendingDown className="h-4 w-4 text-rose-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-black text-rose-600 dark:text-rose-400 font-mono">
                  -Rp {stats.totalExpense.toLocaleString('id-ID')}
                </div>
                <p className="text-xs text-muted-foreground mt-2 font-medium italic">Sejak awal periode</p>
              </CardContent>
            </Card>
          </div>

          {/* Graphic & Table Row */}
          <div className="grid gap-8 md:grid-cols-1 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <RecentTransactionsTable transactions={stats.recentTransactions} />
            </div>
            <Card className="soft-shadow border-none">
              <CardHeader>
                <CardTitle className="premium-heading text-lg">Alokasi Dompet</CardTitle>
                <CardDescription>Pembagian saldo Anda saat ini</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <WalletPieChart data={stats.chartData} />
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthDialog>
  )
}
