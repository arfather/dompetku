'use client'

import { useActionState, useState } from 'react'
import { createIncome } from '@/lib/actions/transaction'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { HandCoins, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import { NumericInput } from '@/components/ui/numeric-input'

const initialState = {
  success: false,
  message: '',
  errors: undefined,
}

const CATEGORIES = [
  'Gaji',
  'Bonus',
  'Investasi',
  'Hadiah',
  'Lainnya'
]

export function IncomeForm({ wallets }) {
  const [state, formAction, isPending] = useActionState(createIncome, initialState)
  const [totalAmount, setTotalAmount] = useState(0)
  const [distributions, setDistributions] = useState(() => {
    const initialDists = {}
    wallets.forEach(w => initialDists[w.id] = 0)
    return initialDists
  })

  const handleDistributionChange = (walletId, rawValue) => {
    const amount = rawValue ? parseInt(rawValue) : 0
    setDistributions(prev => ({ ...prev, [walletId]: amount }))
  }

  const currentDistributed = Object.values(distributions).reduce((acc, val) => acc + val, 0)
  const remaining = totalAmount - currentDistributed

  if (wallets.length === 0) {
    return (
      <Card className="w-full max-w-lg mx-auto">
        <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-zinc-400" />
          <p className="text-zinc-600">Anda belum memiliki dompet. Buat dompet minimal 1 untuk menerima alokasi pemasukan.</p>
          <Link href="/wallets" className={buttonVariants()}>
            Buat Dompet Pertama
          </Link>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HandCoins className="w-5 h-5 text-emerald-500" />
          Catat & Distribusikan Pemasukan
        </CardTitle>
        <CardDescription>Catat total pemasukan Anda dan alokasikan ke berbagai dompet sekaligus.</CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-6">
          <div className="space-y-4 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg border">
            <div className="space-y-2">
              <Label htmlFor="total_amount" className="text-base font-semibold">Total Pemasukan (Rp) *</Label>
              <NumericInput 
                id="total_amount" 
                name="total_amount" 
                required
                placeholder="Contoh: 10.000.000"
                value={totalAmount || ''}
                onChange={(raw) => setTotalAmount(raw ? parseInt(raw) : 0)}
                disabled={isPending}
              />
              {state?.errors?.total_amount && <p className="text-xs text-red-500">{state.errors.total_amount}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <select
                  id="category"
                  name="category"
                  required
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue="Gaji"
                  disabled={isPending}
                >
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
                placeholder="Deskripsi pemasukan..."
                disabled={isPending}
                className="h-20"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-medium text-lg">Alokasi Dompet</h3>
              <div className="text-sm">
                Sisa belum dialokasikan: 
                <span className={`ml-2 font-bold ${remaining === 0 ? 'text-emerald-500' : remaining < 0 ? 'text-red-500' : 'text-amber-500'}`}>
                  Rp {remaining.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {wallets.map((wallet) => (
                <div key={wallet.id} className="flex items-center gap-4">
                  <Label className="w-1/3 truncate" title={wallet.name}>{wallet.name}</Label>
                  <NumericInput 
                    placeholder="0"
                    value={distributions[wallet.id] || ''}
                    onChange={(raw) => handleDistributionChange(wallet.id, raw)}
                    disabled={isPending}
                    className="w-2/3"
                  />
                </div>
              ))}
            </div>

            {/* Hidden input to pass distributions array back to Server Action */}
            <input 
              type="hidden" 
              name="distributions" 
              value={JSON.stringify(Object.entries(distributions).map(([id, amount]) => ({
                wallet_id: id,
                amount: amount
              })))} 
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

          <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isPending || remaining !== 0}>
            {isPending ? 'Menyimpan...' : 'Simpan & Distribusikan Pemasukan'}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
