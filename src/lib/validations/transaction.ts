import { z } from 'zod'

export const expenseSchema = z.object({
  wallet_id: z.string().uuid("Pilih dompet yang valid"),
  amount: z.coerce.number().min(1, "Nominal minimal adalah 1"),
  category: z.string().min(1, "Kategori wajib diisi"),
  description: z.string().optional(),
  date: z.any()
    .refine((val) => val !== undefined && val !== "", "Tanggal transaksi harus diisi")
    .pipe(z.coerce.date({
      error: () => "Format tanggal tidak valid",
    })),
})

export type ExpenseInput = z.infer<typeof expenseSchema>

export const incomeDistributionSchema = z.object({
  wallet_id: z.string().uuid("Dompet distribusi tidak valid"),
  amount: z.coerce.number().min(0, "Nominal distribusi minimal 0"),
})

export const incomeSchema = z.object({
  total_amount: z.coerce.number().min(1, "Nominal pemasukan minimal 1"),
  category: z.string().min(1, "Kategori pemasukan wajib diisi"),
  description: z.string().optional(),
  date: z.any()
    .refine((val) => val !== undefined && val !== "", "Tanggal transaksi harus diisi")
    .pipe(z.coerce.date({
      error: () => "Format tanggal tidak valid",
    })),
  distributions: z.array(incomeDistributionSchema).min(1, "Harus mengalokasikan ke minimal 1 dompet")
})

export type IncomeInput = z.infer<typeof incomeSchema>
