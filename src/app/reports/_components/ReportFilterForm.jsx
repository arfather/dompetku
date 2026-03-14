'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Filter } from 'lucide-react'

export function ReportFilterForm({ wallets, categories }) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [dateFrom, setDateFrom] = useState(searchParams.get('start') || '')
  const [dateTo, setDateTo] = useState(searchParams.get('end') || '')
  const [walletId, setWalletId] = useState(searchParams.get('wallet') || 'ALL')
  const [type, setType] = useState(searchParams.get('type') || 'ALL')
  const [category, setCategory] = useState(searchParams.get('category') || 'ALL')

  const handleFilter = (e) => {
    e.preventDefault()
    
    const params = new URLSearchParams()
    if (dateFrom) params.set('start', dateFrom)
    if (dateTo) params.set('end', dateTo)
    if (walletId !== 'ALL') params.set('wallet', walletId)
    if (type !== 'ALL') params.set('type', type)
    if (category !== 'ALL') params.set('category', category)
    
    router.push(`/reports?${params.toString()}`)
  }

  const handleReset = () => {
    setDateFrom('')
    setDateTo('')
    setWalletId('ALL')
    setType('ALL')
    setCategory('ALL')
    router.push(`/reports`)
  }

  return (
    <Card className="mb-8">
      <CardHeader className="pb-4">
        <CardTitle className="text-base flex items-center gap-2">
          <Filter className="w-4 h-4" /> Filter Laporan
        </CardTitle>
        <CardDescription>Saring riwayat transaksi Anda.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleFilter} className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 items-end">
          <div className="space-y-2">
            <Label>Mulai Tanggal</Label>
            <Input 
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label>Sampai Tanggal</Label>
            <Input 
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Tipe Transaksi</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={type}
              onChange={(e) => setType(e.target.value)}
            >
              <option value="ALL">Semua Tipe</option>
              <option value="INCOME">Pemasukan</option>
              <option value="EXPENSE">Pengeluaran</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label>Dompet</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={walletId}
              onChange={(e) => setWalletId(e.target.value)}
            >
              <option value="ALL">Semua Dompet</option>
              {wallets.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </div>
          
          <div className="space-y-2">
            <Label>Kategori</Label>
            <select
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="ALL">Semua Kategori</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div className="md:col-span-3 lg:col-span-5 flex justify-end gap-2 mt-2">
            <Button type="button" variant="outline" onClick={handleReset}>Reset</Button>
            <Button type="submit">Terapkan Filter</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
