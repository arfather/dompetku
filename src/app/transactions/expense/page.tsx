import { getWallets } from '@/lib/actions/wallet'
import { ExpenseForm } from './_components/ExpenseForm'
import { BackButton } from '@/components/ui/back-button'

export const dynamic = 'force-dynamic'

export default async function ExpensePage() {
  const wallets = await getWallets()

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-2xl mx-auto mb-2"><BackButton /></div>
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight premium-heading">Catat Pengeluaran</h1>
        <p className="text-muted-foreground mt-2">
          Masukkan pengeluaran harian dan uang Anda akan otomatis dipotong dari dompet yang Anda pilih.
        </p>
      </div>

      <ExpenseForm wallets={wallets} />
    </div>
  )
}
