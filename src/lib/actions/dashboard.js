import { db } from '../db'

const HARDCODED_USER_ID = '00000000-0000-0000-0000-000000000000'

export async function getDashboardStats() {
  try {
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    // 1. Total Saldo
    const wallets = await db.wallet.findMany({
      where: { user_id: HARDCODED_USER_ID },
      select: { name: true, balance: true }
    })
    
    let totalBalance = 0
    wallets.forEach(w => totalBalance += Number(w.balance))

    // 2. Transaksi Bulan Ini (Pemasukan & Pengeluaran)
    const thisMonthTransactions = await db.transaction.groupBy({
      by: ['type'],
      where: {
        user_id: HARDCODED_USER_ID,
        date: { gte: startOfMonth },
        journal_id: null
      },
      _sum: {
        amount: true
      }
    })

    const totalIncome = thisMonthTransactions.find(t => t.type === 'INCOME')?._sum.amount?.toNumber() || 0
    const totalExpense = thisMonthTransactions.find(t => t.type === 'EXPENSE')?._sum.amount?.toNumber() || 0

    // 3. Transaksi Terbaru (5 data terakhir)
    const recentTransactions = await db.transaction.findMany({
      where: { 
        user_id: HARDCODED_USER_ID,
        journal_id: null
      },
      orderBy: [
        { date: 'desc' },
        { created_at: 'desc' }
      ],
      take: 5,
      include: {
        wallet: { select: { name: true } }
      }
    })

    // Format data untuk Pie Chart Recharts
    const chartData = wallets
      .filter(w => Number(w.balance) > 0)
      .map(w => ({
        name: w.name,
        value: Number(w.balance)
      }))

    return {
      totalBalance,
      totalIncome,
      totalExpense,
      recentTransactions: recentTransactions.map(t => ({ 
        ...t, 
        amount: Number(t.amount),
        wallet: t.wallet
      })),
      chartData
    }

  } catch (error) {
    console.error('Failed to parse dashboard stats:', error)
    return {
      totalBalance: 0,
      totalIncome: 0,
      totalExpense: 0,
      recentTransactions: [],
      chartData: []
    }
  }
}
