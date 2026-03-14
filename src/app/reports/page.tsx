import { getTransactionReport, getUniqueCategories } from '@/lib/actions/report'
import { getWallets } from '@/lib/actions/wallet'
import { BackButton } from '@/components/ui/back-button'
import { ReportFilterForm } from './_components/ReportFilterForm'
import { FilteredTransactionsTable } from './_components/FilteredTransactionsTable'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Scale } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>
}) {
  const params = await searchParams
  
  const filters = {
    startDate: params.start,
    endDate: params.end,
    walletId: params.wallet,
    type: params.type as any,
    category: params.category,
  }

  const [reportData, wallets, categories] = await Promise.all([
    getTransactionReport(filters),
    getWallets(),
    getUniqueCategories(),
  ])

  const { transactions, summary } = reportData

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-indigo-600 dark:text-indigo-400 premium-heading">Laporan Transaksi</h1>
        <p className="text-muted-foreground mt-2">
          Pantau riwayat lengkap dan trend keuangan Anda berdasarkan filter spesifik.
        </p>
      </div>

      <ReportFilterForm wallets={wallets} categories={categories} />

      {/* Summary Cards for current filter */}
      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Pemasukan</CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 font-mono">
              Rp {summary.totalIncome.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Pada periode ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Total Pengeluaran</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600 dark:text-red-400 font-mono">
              Rp {summary.totalExpense.toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Pada periode ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Arus Kas Bersih (Net Flow)</CardTitle>
            <Scale className="h-4 w-4 text-zinc-500" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold font-mono ${summary.netFlow >= 0 ? 'text-zinc-900 dark:text-zinc-50' : 'text-red-600 dark:text-red-400'}`}>
               {summary.netFlow < 0 ? '-' : ''}Rp {Math.abs(summary.netFlow).toLocaleString('id-ID')}
            </div>
            <p className="text-xs text-muted-foreground mt-1">Pemasukan dikurangi Pengeluaran</p>
          </CardContent>
        </Card>
      </div>

      <FilteredTransactionsTable transactions={transactions} />
    </div>
  )
}
