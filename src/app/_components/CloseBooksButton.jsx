'use client'

import { useState } from 'react'
import { BookMarked, Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger
} from '@/components/ui/dialog'
import { closeBooks } from '@/lib/actions/journal'

export function CloseBooksButton() {
  const [open, setOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)
  const [result, setResult] = useState(null)

  const now = new Date()
  const monthNames = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ]
  const currentMonthName = monthNames[now.getMonth()]
  const currentYear = now.getFullYear()

  const handleCloseBooks = async () => {
    setIsPending(true)
    const res = await closeBooks(now.getMonth() + 1, currentYear)
    setResult(res)
    setIsPending(false)
    if (res.success) {
      setTimeout(() => {
        setOpen(false)
        setResult(null)
      }, 3000)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => {
        setOpen(v)
        if (!v) setResult(null)
    }}>
      <DialogTrigger
        render={
          <Button variant="outline" className="soft-shadow border-indigo-200 dark:border-indigo-900 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/30">
            <BookMarked className="w-4 h-4 mr-2" />
            Tutup Buku {currentMonthName}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookMarked className="w-5 h-5 text-indigo-600" />
            Konfirmasi Tutup Buku
          </DialogTitle>
          <DialogDescription>
            Menutup buku akan membekukan semua transaksi di bulan <strong>{currentMonthName} {currentYear}</strong>. 
            Data akan disimpan dalam satu batch journal dan tidak dapat diubah lagi.
          </DialogDescription>
        </DialogHeader>

        {result ? (
          <div className={`p-4 rounded-lg flex items-start gap-3 ${result.success ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
            {result.success ? <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" /> : <AlertTriangle className="w-5 h-5 mt-0.5 shrink-0" />}
            <p className="text-sm font-medium">{result.message}</p>
          </div>
        ) : (
          <div className="bg-amber-50 dark:bg-amber-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-900 flex gap-3 text-amber-700 dark:text-amber-400">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-xs leading-relaxed">
              Tindakan ini akan mengonsolidasi total pemasukan dan pengeluaran Anda. Pastikan semua transaksi bulan ini sudah dicatat.
            </p>
          </div>
        )}

        <DialogFooter className="sm:justify-end gap-2">
          {!result?.success && (
            <>
              <Button variant="ghost" onClick={() => setOpen(false)} disabled={isPending}>
                Batal
              </Button>
              <Button 
                onClick={handleCloseBooks} 
                className="bg-indigo-600 hover:bg-indigo-700 text-white min-w-[120px]" 
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : (
                  'Ya, Tutup Buku'
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
