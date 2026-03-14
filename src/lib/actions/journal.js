'use server'

import { revalidatePath } from 'next/cache'
import { db } from '../db'

const HARDCODED_USER_ID = '00000000-0000-0000-0000-000000000000'

export async function closeBooks(month, year) {
  try {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0, 23, 59, 59, 999)

    return await db.$transaction(async (tx) => {
      // 1. Cek apakah sudah pernah tutup buku untuk periode ini
      const existingJournal = await tx.journal.findUnique({
        where: {
          user_id_month_year: {
            user_id: HARDCODED_USER_ID,
            month,
            year
          }
        }
      })

      if (existingJournal) {
        throw new Error(`Periode ${month}/${year} sudah pernah ditutup buku.`)
      }

      // 2. Ambil transaksi yang belum masuk journal pada periode tersebut
      const transactions = await tx.transaction.findMany({
        where: {
          user_id: HARDCODED_USER_ID,
          date: { gte: startDate, lte: endDate },
          journal_id: null
        }
      })

      if (transactions.length === 0) {
        throw new Error('Tidak ada transaksi yang dapat ditutup pada periode ini.')
      }

      // 3. Hitung total
      let totalIncome = 0
      let totalExpense = 0
      transactions.forEach(t => {
        if (t.type === 'INCOME') totalIncome += Number(t.amount)
        if (t.type === 'EXPENSE') totalExpense += Number(t.amount)
      })

      // 4. Ambil saldo akhir seluruh dompet
      const wallets = await tx.wallet.findMany({
        where: { user_id: HARDCODED_USER_ID }
      })
      const finalBalance = wallets.reduce((acc, w) => acc + Number(w.balance), 0)

      // 5. Buat Journal
      const journal = await tx.journal.create({
        data: {
          user_id: HARDCODED_USER_ID,
          month,
          year,
          total_income: totalIncome,
          total_expense: totalExpense,
          final_balance: finalBalance
        }
      })

      // 6. Update transaksi agar terhubung ke journal ini
      await tx.transaction.updateMany({
        where: {
          id: { in: transactions.map(t => t.id) }
        },
        data: {
          journal_id: journal.id
        }
      })

      revalidatePath('/')
      revalidatePath('/reports')
      
      return { success: true, message: `Berhasil tutup buku periode ${month}/${year}!` }
    })
  } catch (error) {
    console.error('Failed to close books:', error)
    return { success: false, message: error.message || 'Terjadi kesalahan sistem.' }
  }
}

export async function getJournalHistory() {
  try {
    const journals = await db.journal.findMany({
      where: { user_id: HARDCODED_USER_ID },
      orderBy: [
        { year: 'desc' },
        { month: 'desc' }
      ]
    })

    return journals.map(j => ({
      ...j,
      total_income: Number(j.total_income),
      total_expense: Number(j.total_expense),
      final_balance: Number(j.final_balance)
    }))
  } catch (error) {
    console.error('Failed to get journal history:', error)
    return []
  }
}
