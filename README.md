# 💰 DompetKu - Smart Personal Finance Tracker

**DompetKu** is a premium, modern personal finance management application built with Next.js 16. It helps you track your income and expenses with an intelligent distribution system, professional-grade visualizations, and a sleek, responsive interface.

---

## ✨ Key Features

- **Interactive Dashboard**: A high-level overview of your monthly financial health with real-time stats and recent activity.
- **Multi-Wallet Support**: Manage several accounts seamlessly, from physical cash to bank accounts and digital wallets.
- **Intelligent Income Distribution**: A unique feature that allows you to allocate income across multiple wallets in a single transaction.
- **Detailed Expense Tracking**: Categorized spending records with support for descriptions and specific transaction dates.
- **Financial Reports**: Dynamic charts (using Recharts) to visualize your spending patterns and fund allocations.
- **Premium UI/UX**: Built with a "vibrant yet professional" aesthetic using Tailwind CSS and Shadcn UI.

---

## 🛠️ Tech Stack

### Frontend & UI
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router & Turbopack)
- **Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Components**: [Shadcn UI](https://ui.shadcn.com/) & [Lucide Icons](https://lucide.dev/)
- **Charts**: [Recharts](https://recharts.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Validation**: [Zod v4](https://zod.dev/)

### Backend & Infrastructure
- **Framework**: Next.js Server Actions
- **ORM**: [Prisma](https://www.prisma.io/) (PostgreSQL)
- **Deployment & Database**: [Supabase](https://supabase.com/) (PostgreSQL as a service)
- **Auth**: [Supabase SSR/Auth](https://supabase.com/docs/guides/auth)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Local PostgreSQL or a Supabase project

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/dompet.git
   cd dompet
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Setup Environment Variables**
   Create a `.env` file in the root directory and add:
   ```env
   DATABASE_URL="your-postgresql-url"
   NEXT_PUBLIC_SUPABASE_URL="your-supabase-url"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
   ```

4. **Initialize Database**
   ```bash
   npx prisma db push
   ```

5. **Run Development Server**
   ```bash
   npm run dev
   ```

Visit [http://localhost:3000](http://localhost:3000) to see your app in action!

---

## 📁 Project Structure

```text
src/
├── app/            # Next.js App Router pages and components
├── components/     # Reusable UI components (Shared)
├── lib/            # Core logic, actions, and validation schemas
│   ├── actions/    # Server-side business logic (income/expense/wallets)
│   ├── db/         # Prisma client initialization
│   └── validations/# Zod schemas for type-safe forms
└── prisma/         # Database schema and migrations
```

---

## 📄 License

This project is licensed under the MIT License. Contributions are welcome!
