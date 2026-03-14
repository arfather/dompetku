import { getWallets } from '@/lib/actions/wallet'
import { IncomeForm } from './_components/IncomeForm'
import { BackButton } from '@/components/ui/back-button'

export const dynamic = 'force-dynamic'

export default async function IncomePage() {
  const wallets = await getWallets()

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <div className="max-w-2xl mx-auto mb-2"><BackButton /></div>
      <div className="mb-8 text-center max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold tracking-tight text-emerald-600 dark:text-emerald-500 premium-heading">Catat Pemasukan</h1>
        <p className="text-muted-foreground mt-2">
          Catat total pemasukan Anda bulan ini dan alokasikan langsung ke berbagai dompet yang Anda miliki.
        </p>
      </div>

      <IncomeForm wallets={wallets} />
    </div>
  )
}
