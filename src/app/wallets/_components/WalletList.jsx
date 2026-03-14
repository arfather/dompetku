'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export function WalletList({ initialWallets }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 mt-6">
      {initialWallets.length === 0 ? (
        <p className="text-muted-foreground">Belum ada dompet. Silakan buat dompet pertama Anda.</p>
      ) : (
        initialWallets.map((wallet) => (
          <Card key={wallet.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-semibold">{wallet.name}</CardTitle>
              <CardDescription>Dibuat pada {new Date(wallet.created_at).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold font-mono">
                {new Intl.NumberFormat('id-ID', {
                  style: 'currency',
                  currency: 'IDR',
                  minimumFractionDigits: 0
                }).format(Number(wallet.balance))}
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
