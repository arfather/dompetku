'use client'

import { useActionState } from 'react'
import { createExpense } from '@/lib/actions/transaction'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Receipt, AlertCircle } from 'lucide-react'
import type { Wallet } from '@prisma/client'
import Link from 'next/link'

const initialState = {
  success: false,
  message: '',
  errors: undefined,
}

const CATEGORIES = [
  'Makan & Minum',
  'Transportasi',
  'Belanja',
  'Tagihan & Utilitas',
  'Kesehatan',
  'Hiburan',
  'Lainnya'
]

export function ExpenseForm({ wallets }: { wallets: Wallet[] }) {
  const [state, formAction, isPending] = useActionState(createExpense, initialState)

  if (wallets.length === 0) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-zinc-400" />
          <p className="text-zinc-600">Anda belum memiliki dompet. Buat dompet terlebih dahulu sebelum mencatat pengeluaran.</p>
          <Link href="/wallets" className={buttonVariants()}>
            Buat Dompet
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Receipt className="w-5 h-5 text-red-500" />
          Catat Pengeluaran
        </CardTitle>
        <CardDescription>Masukkan rincian pengeluaran harian Anda, yang akan otomatis memotong saldo dompet.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="wallet_id">Pilih Dompet Sumber Dana *</Label>
            <select
              id="wallet_id"
              name="wallet_id"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              defaultValue=""
              disabled={isPending}
            >
              <option value="" disabled>-- Pilih Dompet --</option>
              {wallets.map((wallet) => (
                <option key={wallet.id} value={wallet.id}>
                  {wallet.name} (Saldo: Rp {Number(wallet.balance).toLocaleString('id-ID')})
                </option>
              ))}
            </select>
            {state?.errors?.wallet_id && <p className="text-xs text-red-500">{state.errors.wallet_id}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Nominal Pengeluaran (Rp) *</Label>
            <Input 
              id="amount" 
              name="amount" 
              type="number" 
              placeholder="Contoh: 50000" 
              min="1"
              required
              disabled={isPending}
            />
            {state?.errors?.amount && <p className="text-xs text-red-500">{state.errors.amount}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Kategori *</Label>
              <select
                id="category"
                name="category"
                required
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                defaultValue=""
                disabled={isPending}
              >
                <option value="" disabled>-- Pilih Kategori --</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              {state?.errors?.category && <p className="text-xs text-red-500">{state.errors.category}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Tanggal *</Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                required
                defaultValue={new Date().toISOString().split('T')[0]}
                disabled={isPending}
              />
              {state?.errors?.date && <p className="text-xs text-red-500">{state.errors.date}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Catatan Tambahan (Opsional)</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Rincian tambahan mengenai pengeluaran ini..."
              disabled={isPending}
            />
          </div>
          
          {state?.success === false && state?.message && (
            <div className="p-3 bg-red-50 text-red-600 rounded-md text-sm">
              {state.message}
            </div>
          )}

          {state?.success === true && (
            <div className="p-3 bg-green-50 text-green-700 rounded-md text-sm font-medium">
              {state.message}
            </div>
          )}

          <Button type="submit" variant="destructive" className="w-full" disabled={isPending}>
            {isPending ? 'Memproses...' : 'Simpan Pengeluaran'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
