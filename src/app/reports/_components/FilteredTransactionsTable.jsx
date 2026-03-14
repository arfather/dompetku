'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

export function FilteredTransactionsTable({ transactions }) {
  return (
    <Card className="col-span-1 lg:col-span-2">
      <CardHeader>
        <CardTitle>Daftar Transaksi</CardTitle>
        <CardDescription>Menampilkan riwayat berdasarkan filter yang diterapkan.</CardDescription>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <div className="text-center py-6 text-muted-foreground">
            Tidak ada transaksi yang cocok dengan kriteria filter.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Keterangan</TableHead>
                <TableHead>Dompet</TableHead>
                <TableHead className="text-right">Nominal</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{new Date(tx.date).toLocaleDateString('id-ID')}</TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${tx.type === 'INCOME' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                      {tx.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                  </TableCell>
                  <TableCell>{tx.category}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[200px] truncate" title={tx.description || ''}>{tx.description || '-'}</TableCell>
                  <TableCell>{tx.wallet.name}</TableCell>
                  <TableCell className={`text-right font-medium font-mono ${tx.type === 'INCOME' ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>
                    {tx.type === 'INCOME' ? '+' : '-'} {new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(Number(tx.amount))}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
