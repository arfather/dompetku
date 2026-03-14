'use client'

import { useActionState } from 'react'
import { createWallet } from '@/lib/actions/wallet'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet as WalletIcon, PlusCircle } from 'lucide-react'

const initialState = {
  error: '',
  success: false
}

export function WalletForm() {
  const [state, formAction, isPending] = useActionState(createWallet, initialState)

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <WalletIcon className="w-5 h-5" />
          Tambah Dompet Baru
        </CardTitle>
        <CardDescription>Buat dompet baru untuk mengalokasikan dana Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nama Dompet</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="Contoh: Dompet Utama, Tabungan Liburan" 
              required 
              disabled={isPending}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="balance">Saldo Awal (Opsional)</Label>
            <Input 
              id="balance" 
              name="balance" 
              type="number" 
              placeholder="0" 
              min="0"
              step="any"
              disabled={isPending}
            />
          </div>
          
          {state?.error && (
            <p className="text-sm font-medium text-destructive">{state.error}</p>
          )}
          {state?.success && (
            <p className="text-sm font-medium text-green-600 dark:text-green-400">Dompet berhasil dibuat!</p>
          )}

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? (
              <span className="flex items-center gap-2">Sedang menyimpan...</span>
            ) : (
              <span className="flex items-center gap-2"><PlusCircle className="w-4 h-4" /> Simpan Dompet</span>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
