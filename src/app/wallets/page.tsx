import { WalletForm } from './_components/WalletForm'
import { WalletList } from './_components/WalletList'
import { getWallets } from '@/lib/actions/wallet'
import { BackButton } from '@/components/ui/back-button'

export const dynamic = 'force-dynamic'

export default async function WalletsPage() {
  const wallets = await getWallets()

  return (
    <div className="container mx-auto py-10 px-4 md:px-6">
      <BackButton />
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight premium-heading">Manajemen Dompet</h1>
        <p className="text-muted-foreground mt-2">
          Kelola berbagai dompet untuk mengalokasikan dana Anda.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_2fr]">
        <div>
          <WalletForm />
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Daftar Dompet</h2>
          <WalletList initialWallets={wallets} />
        </div>
      </div>
    </div>
  )
}
