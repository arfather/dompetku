'use server'

import { db } from '../db'
import { Prisma } from '@prisma/client'

const HARDCODED_USER_ID = '00000000-0000-0000-0000-000000000000'

export type ReportFilters = {
  startDate?: string
  endDate?: string
  walletId?: string
  type?: 'INCOME' | 'EXPENSE' | 'ALL'
  category?: string
}

export async function getTransactionReport(filters: ReportFilters) {
  try {
    const whereClause: Prisma.TransactionWhereInput = {
      user_id: HARDCODED_USER_ID,
    }

    if (filters.startDate) {
      whereClause.date = { ...whereClause.date as object, gte: new Date(filters.startDate) }
    }
    if (filters.endDate) {
      whereClause.date = { ...whereClause.date as object, lte: new Date(filters.endDate) }
    }
    if (filters.walletId && filters.walletId !== 'ALL') {
      whereClause.wallet_id = filters.walletId
    }
    if (filters.type && filters.type !== 'ALL') {
      whereClause.type = filters.type
    }
    if (filters.category && filters.category !== 'ALL') {
      whereClause.category = filters.category
    }

    const transactions = await db.transaction.findMany({
      where: whereClause,
      orderBy: [
        { date: 'desc' },
        { created_at: 'desc' },
      ],
      include: {
        wallet: {
          select: { name: true }
        }
      }
    })

    // Hitung ringkasan
    let totalIncome = 0
    let totalExpense = 0

    transactions.forEach(t => {
      if (t.type === 'INCOME') totalIncome += Number(t.amount)
      if (t.type === 'EXPENSE') totalExpense += Number(t.amount)
    })

    return {
      transactions: transactions.map(t => ({
        ...t,
        amount: Number(t.amount)
      })),
      summary: {
        totalIncome,
        totalExpense,
        netFlow: totalIncome - totalExpense
      }
    }
  } catch (error) {
    console.error('Failed to fetch report:', error)
    return {
      transactions: [],
      summary: { totalIncome: 0, totalExpense: 0, netFlow: 0 }
    }
  }
}

export async function getUniqueCategories() {
  try {
    const categories = await db.transaction.findMany({
      where: { user_id: HARDCODED_USER_ID },
      select: { category: true },
      distinct: ['category']
    })
    return categories.map(c => c.category).filter(Boolean)
  } catch {
    return []
  }
}
