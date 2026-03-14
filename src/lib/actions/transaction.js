'use server'

import { revalidatePath } from 'next/cache'
import { db } from '../db'
import { expenseSchema, incomeSchema } from '../validations/transaction'

const HARDCODED_USER_ID = '00000000-0000-0000-0000-000000000000'

export async function createExpense(_prevState, formData) {
  try {
    const rawData = {
      wallet_id: formData.get('wallet_id'),
      amount: formData.get('amount'),
      category: formData.get('category'),
      description: formData.get('description') || undefined,
      date: formData.get('date'),
    }

    const validatedData = expenseSchema.safeParse(rawData)

    if (!validatedData.success) {
      return { 
        success: false, 
        errors: validatedData.error.flatten().fieldErrors,
        message: 'Mohon periksa form input Anda.'
      }
    }

    const { wallet_id, amount, category, description, date } = validatedData.data

    await db.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({
        where: { id: wallet_id, user_id: HARDCODED_USER_ID }
      })

      if (!wallet) {
        throw new Error('Dompet tidak ditemukan.')
      }

      if (Number(wallet.balance) < amount) {
        throw new Error('Saldo dompet tidak mencukupi untuk pengeluaran ini.')
      }

      const transaction = await tx.transaction.create({
        data: {
          user_id: HARDCODED_USER_ID,
          wallet_id,
          type: 'EXPENSE',
          amount,
          category,
          description,
          date
        }
      })

      await tx.wallet.update({
        where: { id: wallet_id },
        data: { balance: { decrement: amount } }
      })

      return transaction
    })

    revalidatePath('/wallets')
    revalidatePath('/')
    
    return { success: true, message: 'Pengeluaran berhasil dicatat!' }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan sistem.'
    console.error('Failed to create expense:', error)
    return { success: false, message }
  }
}

export async function createIncome(_prevState, formData) {
  try {
    const distributionsRaw = formData.get('distributions')
    let parsedDistributions = []
    
    try {
      parsedDistributions = JSON.parse(distributionsRaw || '[]')
    } catch {
      return { success: false, message: 'Data distribusi tidak valid.' }
    }

    const rawData = {
      total_amount: formData.get('total_amount'),
      category: formData.get('category'),
      description: formData.get('description') || undefined,
      date: formData.get('date'),
      distributions: parsedDistributions
    }

    const validatedData = incomeSchema.safeParse(rawData)

    if (!validatedData.success) {
      return { 
        success: false, 
        errors: validatedData.error.flatten().fieldErrors,
        message: 'Mohon periksa form input pemasukan Anda.'
      }
    }

    const { total_amount, category, description, date, distributions } = validatedData.data

    // Validasi tambahan: Total distribusi harus sama dengan total_amount
    const totalDistributed = distributions.reduce((acc, dist) => acc + dist.amount, 0)
    if (totalDistributed !== total_amount) {
      return {
        success: false,
        message: `Total alokasi (Rp ${totalDistributed.toLocaleString('id-ID')}) tidak sesuai dengan total pemasukan (Rp ${total_amount.toLocaleString('id-ID')})`
      }
    }

    await db.$transaction(async (tx) => {
      // Create one INCOME transaction. We will just arbitrarily link it to the first wallet in the distribution 
      // or we can make wallet_id nullable for 'General Income'. In our schema `wallet_id` is required.
      // So let's link the main transaction record to the first wallet, or better, to the most funded wallet.
      const primaryWalletId = distributions[0].wallet_id

      const transaction = await tx.transaction.create({
        data: {
          user_id: HARDCODED_USER_ID,
          wallet_id: primaryWalletId, // Schema requirement
          type: 'INCOME',
          amount: total_amount,
          category,
          description,
          date
        }
      })

      for (const dist of distributions) {
        if (dist.amount <= 0) continue;
        
        // Buat log income_distributions
        await tx.incomeDistribution.create({
          data: {
            transaction_id: transaction.id,
            wallet_id: dist.wallet_id,
            allocated_amount: dist.amount,
            // percentage bisa dihitung jika diperlukan, kita null-kan saja
          }
        })

        // Tambah saldo ke masing-masing dompet
        await tx.wallet.update({
          where: { id: dist.wallet_id },
          data: { balance: { increment: dist.amount } }
        })
      }
    })

    revalidatePath('/wallets')
    revalidatePath('/')
    
    return { success: true, message: 'Pemasukan berhasil didistribusikan!' }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Terjadi kesalahan sistem.'
    console.error('Failed to record income:', error)
    return { success: false, message }
  }
}
