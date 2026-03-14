'use server'

import { revalidatePath } from 'next/cache'
import { db } from '../db'

// We are currently using a hardcoded user ID for MVP since Auth isn't fully integrated yet
// In production, this should come from Supabase server session
const HARDCODED_USER_ID = '00000000-0000-0000-0000-000000000000'

export async function createWallet(_prevState, formData) {
  const name = formData.get('name')
  const balance = formData.get('balance')
  
  if (!name || name.trim() === '') {
    return { error: 'Wallet name is required', success: false }
  }

  const initialBalance = balance ? parseFloat(balance) : 0

  try {
    // Note: We need to ensure a user exists first for our Foreign Key constraint.
    // We will do a check/create for the mock user
    let user = await db.user.findUnique({
      where: { id: HARDCODED_USER_ID }
    })
    
    if (!user) {
      user = await db.user.create({
        data: {
          id: HARDCODED_USER_ID,
          email: 'demo@dompetku.localhost',
        }
      })
    }

    await db.wallet.create({
      data: {
        name: name.trim(),
        balance: initialBalance,
        user_id: HARDCODED_USER_ID,
      }
    })

    revalidatePath('/wallets')
    return { success: true, error: '' }
  } catch (error) {
    console.error('Failed to create wallet:', error)
    return { error: 'Failed to create wallet', success: false }
  }
}

export async function getWallets() {
  try {
    const wallets = await db.wallet.findMany({
      where: {
        user_id: HARDCODED_USER_ID
      },
      orderBy: {
        created_at: 'desc'
      }
    })

    return wallets.map(w => ({
      ...w,
      balance: Number(w.balance)
    }))
  } catch (error) {
    console.error('Failed to fetch wallets:', error)
    return []
  }
}
